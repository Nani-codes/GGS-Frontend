import { promises as fs } from 'fs';
import path from 'path';
import { InstagramPost } from '@/types/instagram';

const CACHE_FILE = path.join(process.cwd(), '.instagram-posts-cache.json');

interface PostsCache {
  posts: InstagramPost[];
  cachedAt: number;
}

let memoryCache: PostsCache | null = null;

async function readCache(): Promise<PostsCache | null> {
  if (memoryCache) return memoryCache;

  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf8');
    const cache = JSON.parse(raw) as PostsCache;
    if (cache.posts?.length) {
      memoryCache = cache;
      return cache;
    }
  } catch {
    // No cache on disk yet.
  }

  return null;
}

/** Age of the current cache in milliseconds, or null if there is no cache. */
export async function getCacheAge(): Promise<number | null> {
  const cache = await readCache();
  return cache ? Date.now() - cache.cachedAt : null;
}

/** Returns cached posts only if they are newer than maxAgeMs. */
export async function getFreshCachedPosts(maxAgeMs: number): Promise<InstagramPost[] | null> {
  const cache = await readCache();
  if (cache && Date.now() - cache.cachedAt < maxAgeMs) {
    return cache.posts;
  }
  return null;
}

/** Returns cached posts regardless of age (used as a fallback on live-fetch failure). */
export async function getStaleCachedPosts(): Promise<InstagramPost[] | null> {
  const cache = await readCache();
  return cache?.posts ?? null;
}

export async function setCachedPosts(posts: InstagramPost[]): Promise<void> {
  if (!posts.length) return;

  const cache: PostsCache = { posts, cachedAt: Date.now() };
  memoryCache = cache;

  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache), 'utf8');
  } catch (error) {
    console.warn('Could not persist Instagram posts cache to disk:', error);
  }
}
