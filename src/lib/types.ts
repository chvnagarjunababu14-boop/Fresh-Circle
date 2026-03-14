export type UserRole = 'vendor' | 'buyer' | 'logistics' | 'storage';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  business_name: string;
  lat: number | null;
  lng: number | null;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  emoji: string;
  qty_kg: number;
  price_per_kg: number;
  is_surplus: boolean;
  created_at: string;
}

export interface Requirement {
  id: string;
  buyer_id: string;
  item_name: string;
  qty_needed: number;
  status: 'open' | 'fulfilled';
}

export interface StorageRequest {
  id: string;
  vendor_id: string;
  qty: number;
  status: 'pending' | 'stored';
}

export interface VendorMatch {
  vendor: Profile;
  product: Product;
  distance: number;
  effectivePrice: number;
}

export interface MatchResult {
  item_name: string;
  matches: VendorMatch[];
  totalQty: number;
  fulfilled: boolean;
}
