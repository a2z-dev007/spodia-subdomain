export interface GalleryPhoto {
  id: string | number;
  src: string;
  category: string;
  categoryType: 'property' | 'room' | 'service' | 'other';
  title: string;
  description?: string;
  roomName?: string;
  roomDetails?: {
    bedType?: string;
    dimensions?: string;
    maxAdults?: number;
    maxChildren?: number;
    roomId?: number;
  };
  isCover?: boolean;
  order?: number;
  globalIndex: number;
}

export interface GalleryCategory {
  id: string;
  name: string;
  count: number;
  type: 'all' | 'property' | 'room' | 'service';
  roomData?: any;
}

export type GalleryViewMode = 'editorial' | 'grid';
