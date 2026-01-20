import { NextResponse } from 'next/server';
import { InstagramPost, InstagramApiResponse } from '@/types/instagram';

// Instagram Internal API endpoints
const INSTAGRAM_FEED_URL = 'https://i.instagram.com/api/v1/feed/user/';

// Target Instagram account details
const INSTAGRAM_USERNAME = 'greengoldseedsaurangabad';
const INSTAGRAM_USER_ID = '53194360488'; // Pre-fetched user ID for greengoldseedsaurangabad

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600;

// Instagram App ID (constant for web)
const INSTAGRAM_APP_ID = '936619743392459';

// Interface for Instagram Feed API response
interface InstagramFeedItem {
  id: string;
  pk: string;
  code: string; // shortcode for URL
  taken_at: number;
  image_versions2?: {
    candidates: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  carousel_media?: Array<{
    image_versions2?: {
      candidates: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    };
  }>;
  caption?: {
    text: string;
  };
  like_count?: number;
  comment_count?: number;
  user: {
    username: string;
    full_name: string;
  };
}

interface InstagramFeedResponse {
  items: InstagramFeedItem[];
  num_results: number;
  more_available: boolean;
  user: {
    pk: string;
    username: string;
  };
}

// Build cookie string from environment variables
function buildCookieString(): string {
  const cookies: string[] = [];
  
  if (process.env.INSTAGRAM_MID) {
    cookies.push(`mid=${process.env.INSTAGRAM_MID}`);
  }
  if (process.env.INSTAGRAM_DATR) {
    cookies.push(`datr=${process.env.INSTAGRAM_DATR}`);
  }
  if (process.env.INSTAGRAM_IG_DID) {
    cookies.push(`ig_did=${process.env.INSTAGRAM_IG_DID}`);
  }
  cookies.push('ig_nrcb=1');
  cookies.push('ps_l=1');
  cookies.push('ps_n=1');
  if (process.env.INSTAGRAM_DS_USER_ID) {
    cookies.push(`ds_user_id=${process.env.INSTAGRAM_DS_USER_ID}`);
  }
  if (process.env.INSTAGRAM_CSRF_TOKEN) {
    cookies.push(`csrftoken=${process.env.INSTAGRAM_CSRF_TOKEN}`);
  }
  if (process.env.INSTAGRAM_SESSION_ID) {
    cookies.push(`sessionid=${process.env.INSTAGRAM_SESSION_ID}`);
  }
  
  return cookies.join('; ');
}

// Build request headers
function buildHeaders(): HeadersInit {
  return {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Chromium";v="143", "Not A(Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-storage-access': 'active',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
    'x-ig-app-id': INSTAGRAM_APP_ID,
    'x-csrftoken': process.env.INSTAGRAM_CSRF_TOKEN || '',
    'x-instagram-ajax': '1',
    'x-requested-with': 'XMLHttpRequest',
    'Cookie': buildCookieString(),
  };
}

// Fetch Instagram posts using feed API
async function fetchInstagramPosts(userId: string): Promise<InstagramPost[]> {
  const url = `${INSTAGRAM_FEED_URL}${userId}/`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Instagram Feed API error: ${response.status}`, errorText.substring(0, 500));
    
    if (response.status === 401 || response.status === 403) {
      throw new Error('Instagram session expired. Please refresh cookies in .env.local');
    }
    
    throw new Error(`Instagram API returned ${response.status}`);
  }

  const data: InstagramFeedResponse = await response.json();
  
  if (!data?.items || data.items.length === 0) {
    console.warn('No items found in Instagram feed response');
    return [];
  }

  // Map to InstagramPost interface
  const posts: InstagramPost[] = data.items.slice(0, 5).map((item) => {
    // Get image URL - prefer highest resolution
    let imageUrl = '';
    if (item.image_versions2?.candidates?.length) {
      // Sort by width descending and get the largest
      const sorted = [...item.image_versions2.candidates].sort((a, b) => b.width - a.width);
      imageUrl = sorted[0]?.url || '';
    } else if (item.carousel_media?.[0]?.image_versions2?.candidates?.length) {
      // For carousel posts, use the first image
      const sorted = [...item.carousel_media[0].image_versions2.candidates].sort((a, b) => b.width - a.width);
      imageUrl = sorted[0]?.url || '';
    }

    const caption = item.caption?.text || '';
    const likes = item.like_count || 0;
    const comments = item.comment_count || 0;
    const timestamp = new Date(item.taken_at * 1000).toISOString();
    
    return {
      id: item.id || item.pk,
      imageUrl: imageUrl,
      caption: caption,
      likes: likes,
      timestamp: timestamp,
      postUrl: `https://www.instagram.com/p/${item.code}/`,
      username: item.user?.username || INSTAGRAM_USERNAME,
      comments: comments,
    };
  });

  return posts;
}

export async function GET() {
  try {
    // Validate required environment variables
    if (!process.env.INSTAGRAM_SESSION_ID || !process.env.INSTAGRAM_CSRF_TOKEN) {
      console.error('Missing required Instagram credentials');
      return NextResponse.json({
        posts: [],
        success: false,
        error: 'Instagram credentials not configured. Please set INSTAGRAM_SESSION_ID and INSTAGRAM_CSRF_TOKEN in .env.local',
      }, { status: 500 });
    }

    // Use pre-fetched user ID (more reliable than profile lookup)
    const posts = await fetchInstagramPosts(INSTAGRAM_USER_ID);

    if (posts.length > 0) {
      const response: InstagramApiResponse = {
        posts: posts,
        success: true,
      };

      return NextResponse.json(response, {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=600`,
        },
      });
    }

    // No posts found
    return NextResponse.json({
      posts: [],
      success: true,
      error: 'No posts found for this account.',
    }, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=600`,
      },
    });
  } catch (error) {
    console.error('Error in Instagram API route:', error);
    const response: InstagramApiResponse = {
      posts: [],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Instagram posts',
    };

    return NextResponse.json(response, { status: 500 });
  }
}











