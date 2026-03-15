import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type Product = Tables<'products'>;
type Requirement = Tables<'requirements'>;
type StorageRequest = Tables<'storage_requests'>;

interface AppStore {
  // Products
  products: Product[];
  loadProducts: () => Promise<void>;
  addProduct: (p: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  toggleSurplus: (id: string) => Promise<void>;

  // Requirements
  requirements: Requirement[];
  loadRequirements: () => Promise<void>;
  addRequirement: (r: Omit<Requirement, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  fulfillRequirement: (id: string) => Promise<void>;

  // Storage
  storageRequests: StorageRequest[];
  loadStorageRequests: () => Promise<void>;
  addStorageRequest: (s: Omit<StorageRequest, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;

  // All vendors
  vendors: Profile[];
  loadVendors: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  products: [],
  loadProducts: async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) set({ products: data });
  },
  addProduct: async (p) => {
    const { data, error } = await supabase.from('products').insert(p).select().single();
    if (data) set((s) => ({ products: [...s.products, data] }));
  },
  toggleSurplus: async (id) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    const newSurplus = !product.is_surplus;
    const newPrice = newSurplus ? product.price_per_kg * 0.7 : product.price_per_kg / 0.7;
    const { error } = await supabase
      .from('products')
      .update({ is_surplus: newSurplus, price_per_kg: newPrice })
      .eq('id', id);
    if (!error) {
      set((s) => ({
        products: s.products.map((p) =>
          p.id === id ? { ...p, is_surplus: newSurplus, price_per_kg: newPrice } : p
        ),
      }));
    }
  },

  requirements: [],
  loadRequirements: async () => {
    const { data } = await supabase.from('requirements').select('*');
    if (data) set({ requirements: data });
  },
  addRequirement: async (r) => {
    const { data } = await supabase.from('requirements').insert(r).select().single();
    if (data) set((s) => ({ requirements: [...s.requirements, data] }));
  },
  fulfillRequirement: async (id) => {
    const { error } = await supabase.from('requirements').update({ status: 'fulfilled' }).eq('id', id);
    if (!error) {
      set((s) => ({
        requirements: s.requirements.map((r) =>
          r.id === id ? { ...r, status: 'fulfilled' } : r
        ),
      }));
    }
  },

  storageRequests: [],
  loadStorageRequests: async () => {
    const { data } = await supabase.from('storage_requests').select('*');
    if (data) set({ storageRequests: data });
  },
  addStorageRequest: async (s) => {
    const { data } = await supabase.from('storage_requests').insert(s).select().single();
    if (data) set((st) => ({ storageRequests: [...st.storageRequests, data] }));
  },

  vendors: [],
  loadVendors: async () => {
    const { data } = await supabase.from('profiles').select('*').eq('role', 'vendor');
    if (data) set({ vendors: data });
  },
}));
