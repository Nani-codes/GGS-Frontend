import { execFile } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { InstagramPost } from '@/types/instagram';

const execFileAsync = promisify(execFile);

export const INSTAGRAM_IMAGE_PROXY_PATH = '/api/instagram/image';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36';
const INSTAGRAM_APP_ID = '936619743392459';
const PROFILE_API = 'https://www.instagram.com/api/v1/users/web_profile_info/';

interface PublicProfileNode {
  id: string;
  shortcode: string;
  display_url?: string;
  taken_at_timestamp?: number;
  edge_media_to_caption?: {
    edges?: Array<{ node?: { text?: string } }>;
  };
  edge_liked_by?: { count?: number };
  edge_media_to_comment?: { count?: number };
  thumbnail_resources?: Array<{ src: string; config_width: number }>;
  owner?: { username?: string };
}

interface PublicProfileResponse {
  data?: {
    user?: {
      username?: string;
      edge_owner_to_timeline_media?: {
        edges?: Array<{ node: PublicProfileNode }>;
      };
    };
  };
}

/**
 * Instagram CDN (scontent.*.cdninstagram.com) image URLs are signed and bound to
 * the IP/region that fetched them, so they 403 when loaded directly from a user's
 * browser. We route them through our own server-side proxy instead.
 */
function toProxiedImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  return `${INSTAGRAM_IMAGE_PROXY_PATH}?u=${encodeURIComponent(rawUrl)}`;
}

function mapPublicNode(node: PublicProfileNode, username: string): InstagramPost {
  const rawImageUrl =
    node.display_url ||
    [...(node.thumbnail_resources || [])]
      .sort((a, b) => b.config_width - a.config_width)[0]
      ?.src ||
    '';

  const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || '';

  return {
    id: node.id,
    imageUrl: toProxiedImageUrl(rawImageUrl),
    caption,
    likes: node.edge_liked_by?.count || 0,
    timestamp: node.taken_at_timestamp
      ? new Date(node.taken_at_timestamp * 1000).toISOString()
      : new Date().toISOString(),
    postUrl: `https://www.instagram.com/p/${node.shortcode}/`,
    username: node.owner?.username || username,
    comments: node.edge_media_to_comment?.count || 0,
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Performs the profile request via the system `curl` binary rather than Node's
 * built-in fetch (undici).
 *
 * Instagram fingerprints the HTTP client (TLS/HTTP2 signature): undici requests
 * are consistently rejected with 429 while curl's browser-like signature is
 * accepted. Using curl is what makes the fetch reliable on this server.
 */
async function curlProfile(
  username: string
): Promise<{ status: number; body: string }> {
  const url = `${PROFILE_API}?username=${encodeURIComponent(username)}`;
  const args = [
    '-s',
    '--compressed',
    '--max-time',
    '20',
    '-w',
    '\n%{http_code}',
    '-H',
    `x-ig-app-id: ${INSTAGRAM_APP_ID}`,
    '-H',
    `user-agent: ${USER_AGENT}`,
    '-H',
    'accept: */*',
    '-H',
    'accept-language: en-US,en;q=0.9',
    '-H',
    `referer: https://www.instagram.com/${username}/`,
    url,
  ];

  const { stdout } = await execFileAsync('curl', args, {
    maxBuffer: 10 * 1024 * 1024,
    timeout: 25_000,
  });

  const separator = stdout.lastIndexOf('\n');
  const body = separator === -1 ? '' : stdout.slice(0, separator);
  const status = parseInt(stdout.slice(separator + 1).trim(), 10) || 0;

  return { status, body };
}

/**
 * Fetches the latest posts for a public Instagram profile.
 *
 * Instagram occasionally rate limits requests, so we retry a few times with
 * backoff before giving up. Transient failures are handled upstream by serving
 * the persisted cache.
 */
export async function fetchPublicProfilePosts(
  username: string,
  limit = 8,
  maxAttempts = 3
): Promise<InstagramPost[]> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { status, body } = await curlProfile(username);

      if (status === 429) {
        lastError = new Error('Instagram rate limit reached (429)');
        if (attempt < maxAttempts) await sleep(attempt * 1500);
        continue;
      }

      if (status !== 200) {
        throw new Error(`Instagram profile API returned ${status}`);
      }

      const data = JSON.parse(body) as PublicProfileResponse;
      const edges = data.data?.user?.edge_owner_to_timeline_media?.edges || [];

      const posts = edges
        .slice(0, limit)
        .map(({ node }) => mapPublicNode(node, username))
        .filter((post) => post.imageUrl);

      if (posts.length) return posts;

      lastError = new Error('Instagram profile returned no usable posts');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Instagram fetch failed');
      if (attempt < maxAttempts) await sleep(attempt * 1500);
    }
  }

  throw lastError || new Error('Unable to fetch Instagram posts');
}

export interface InstagramImageResult {
  buffer: Buffer;
  contentType: string;
  status: number;
}

/**
 * Fetches an Instagram CDN image server-side via curl (Node's fetch is blocked
 * with 403 by the same client fingerprinting that affects the profile API).
 * The body is written to a temp file so we can capture the exact HTTP status and
 * content-type without corrupting the binary payload.
 */
export async function fetchInstagramImage(url: string): Promise<InstagramImageResult> {
  const tmpFile = path.join(os.tmpdir(), `ig-img-${crypto.randomUUID()}`);

  try {
    const { stdout } = await execFileAsync(
      'curl',
      [
        '-s',
        '--compressed',
        '--max-time',
        '25',
        '-o',
        tmpFile,
        '-w',
        '%{http_code} %{content_type}',
        '-H',
        `user-agent: ${USER_AGENT}`,
        '-H',
        'accept: image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        url,
      ],
      { maxBuffer: 4096, timeout: 30_000 }
    );

    const [codeStr, ...contentTypeParts] = stdout.trim().split(' ');
    const status = parseInt(codeStr, 10) || 0;
    const contentType = contentTypeParts.join(' ') || 'image/jpeg';
    const buffer = await fs.readFile(tmpFile);

    return { buffer, contentType, status };
  } finally {
    await fs.unlink(tmpFile).catch(() => {});
  }
}
