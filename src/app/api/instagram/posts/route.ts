import { NextResponse } from 'next/server';
import { InstagramApiResponse, InstagramPost } from '@/types/instagram';
import { fetchPublicProfilePosts } from '@/lib/instagram-public';
import {
  getFreshCachedPosts,
  getStaleCachedPosts,
  setCachedPosts,
} from '@/lib/instagram-posts-cache';

export const dynamic = 'force-dynamic';

const INSTAGRAM_USERNAME = 'greengoldseedsaurangabad';
// How long a cached result is considered fresh before we refresh in the background.
const FRESH_TTL_MS = 30 * 60 * 1000;

// Prevent overlapping background refreshes across concurrent requests.
let refreshInFlight: Promise<InstagramPost[]> | null = null;

async function refreshPosts(): Promise<InstagramPost[]> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const posts = await fetchPublicProfilePosts(INSTAGRAM_USERNAME);
      if (posts.length) {
        await setCachedPosts(posts);
      }
      return posts;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

function jsonResponse(payload: InstagramApiResponse, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function GET() {
  // 1. Fresh cache -> serve immediately, no network call.
  const fresh = await getFreshCachedPosts(FRESH_TTL_MS);
  if (fresh?.length) {
    return jsonResponse({ posts: fresh, success: true });
  }

  // 2. Stale cache -> serve immediately and refresh in the background.
  const stale = await getStaleCachedPosts();
  if (stale?.length) {
    void refreshPosts().catch((error) => {
      console.warn('Background Instagram refresh failed:', error);
    });
    return jsonResponse({ posts: stale, success: true });
  }

  // 3. No cache at all -> fetch live and wait for it.
  try {
    const posts = await refreshPosts();
    if (posts.length) {
      return jsonResponse({ posts, success: true });
    }
    return jsonResponse({
      posts: [],
      success: true,
      error: 'No posts found for this account.',
    });
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);

    // Last-ditch: serve any stale cache that may have appeared meanwhile.
    const fallback = await getStaleCachedPosts();
    if (fallback?.length) {
      return jsonResponse({
        posts: fallback,
        success: true,
        error: 'Serving cached Instagram posts while live fetch is unavailable',
      });
    }

    return jsonResponse(
      {
        posts: [],
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch Instagram posts',
      },
      500
    );
  }
}
