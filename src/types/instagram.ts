export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp: string;
  postUrl: string;
  username: string;
  comments?: number;
}

export interface InstagramApiResponse {
  posts: InstagramPost[];
  success: boolean;
  error?: string;
}



