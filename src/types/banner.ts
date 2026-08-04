export type BannerDisplayMode = 'cover' | 'contain' | 'map';

export interface BannerMedia {
  url: string;
}

export interface Banner {
  documentId: string;
  Title: string;
  Display_Mode: BannerDisplayMode;
  Background_Color?: string | null;
  Sort_Order: number;
  Is_Active: boolean;
  Desktop_Image?: BannerMedia | null;
  Mobile_Image?: BannerMedia | null;
}

export interface BannersResponse {
  data: Banner[];
}
