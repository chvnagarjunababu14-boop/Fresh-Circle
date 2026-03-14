import { create } from 'zustand';
import type { UserRole, Profile, Product, Requirement, StorageRequest } from './types';

interface AppStore {
  // Auth state (mock)
  currentUser: Profile | null;
  setCurrentUser: (user: Profile | null) => void;
  
  // Products
  products: Product[];
  addProduct: (p: Product) => void;
  toggleSurplus: (id: string) => void;
  
  // Requirements
  requirements: Requirement[];
  addRequirement: (r: Requirement) => void;
  fulfillRequirement: (id: string) => void;
  
  // Storage
  storageRequests: StorageRequest[];
  addStorageRequest: (s: StorageRequest) => void;
  
  // All vendors (mock)
  vendors: Profile[];
  setVendors: (v: Profile[]) => void;
}

// Generate mock vendors
const mockVendors: Profile[] = [
  { id: 'v1', email: 'ravi@farm.in', role: 'vendor', business_name: 'Ravi Fresh Farm', lat: 12.9716, lng: 77.5946 },
  { id: 'v2', email: 'anita@greens.in', role: 'vendor', business_name: 'Anita Greens', lat: 12.9616, lng: 77.5846 },
  { id: 'v3', email: 'kumar@veggies.in', role: 'vendor', business_name: 'Kumar Veggies', lat: 12.9816, lng: 77.6046 },
];

const mockProducts: Product[] = [
  { id: 'p1', vendor_id: 'v1', name: 'Tomato', emoji: '🍅', qty_kg: 50, price_per_kg: 40, is_surplus: false, created_at: new Date().toISOString() },
  { id: 'p2', vendor_id: 'v1', name: 'Potato', emoji: '🥔', qty_kg: 80, price_per_kg: 30, is_surplus: false, created_at: new Date().toISOString() },
  { id: 'p3', vendor_id: 'v2', name: 'Tomato', emoji: '🍅', qty_kg: 30, price_per_kg: 35, is_surplus: true, created_at: new Date().toISOString() },
  { id: 'p4', vendor_id: 'v2', name: 'Onion', emoji: '🧅', qty_kg: 60, price_per_kg: 25, is_surplus: false, created_at: new Date().toISOString() },
  { id: 'p5', vendor_id: 'v3', name: 'Potato', emoji: '🥔', qty_kg: 100, price_per_kg: 28, is_surplus: false, created_at: new Date().toISOString() },
  { id: 'p6', vendor_id: 'v3', name: 'Onion', emoji: '🧅', qty_kg: 45, price_per_kg: 22, is_surplus: true, created_at: new Date().toISOString() },
];

export const useAppStore = create<AppStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  products: mockProducts,
  addProduct: (p) => set((s) => ({ products: [...s.products, p] })),
  toggleSurplus: (id) => set((s) => ({
    products: s.products.map(p => p.id === id ? { ...p, is_surplus: !p.is_surplus, price_per_kg: !p.is_surplus ? p.price_per_kg * 0.7 : p.price_per_kg / 0.7 } : p)
  })),
  
  requirements: [],
  addRequirement: (r) => set((s) => ({ requirements: [...s.requirements, r] })),
  fulfillRequirement: (id) => set((s) => ({
    requirements: s.requirements.map(r => r.id === id ? { ...r, status: 'fulfilled' as const } : r)
  })),
  
  storageRequests: [],
  addStorageRequest: (s) => set((st) => ({ storageRequests: [...st.storageRequests, s] })),
  
  vendors: mockVendors,
  setVendors: (v) => set({ vendors: v }),
}));
