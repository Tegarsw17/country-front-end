// types/derivativenews.ts

// Bentuk data mentah dari backend (Ponder / Postgres)
export type NewsCardRow = {
    id: number;
    title: string;
    imageUrl: string;
    country: string;
    description: string;
};

// Bentuk data yang dipakai SwipeCard di frontend
export type DerivativeNews = {
    id: number;
    title: string;
    description: string;      // diambil dari description
    imageUrl?: string;
    country: string;
    symbol: string;       //
};
