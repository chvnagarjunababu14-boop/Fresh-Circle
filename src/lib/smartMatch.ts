import { getDistance, MAX_RADIUS_KM } from './distance';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;
type Profile = Tables<'profiles'>;
type Requirement = Tables<'requirements'>;

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

export function smartMatchAlgorithm(
  requirements: Requirement[],
  vendors: Profile[],
  products: Product[],
  buyerLat: number,
  buyerLng: number
): MatchResult[] {
  return requirements
    .filter(r => r.status === 'open')
    .map(req => {
      const matches: VendorMatch[] = [];
      let totalQty = 0;

      const relevantProducts = products
        .filter(p => p.name.toLowerCase() === req.item_name.toLowerCase() && p.qty_kg > 0)
        .map(p => {
          const vendor = vendors.find(v => v.id === p.vendor_id);
          if (!vendor || vendor.lat == null || vendor.lng == null) return null;
          const distance = getDistance(buyerLat, buyerLng, vendor.lat, vendor.lng);
          if (distance > MAX_RADIUS_KM) return null;
          const effectivePrice = p.is_surplus ? Number(p.price_per_kg) * 0.7 : Number(p.price_per_kg);
          return { vendor, product: p, distance, effectivePrice } as VendorMatch;
        })
        .filter(Boolean) as VendorMatch[];

      relevantProducts.sort((a, b) => a.effectivePrice - b.effectivePrice || a.distance - b.distance);

      for (const match of relevantProducts) {
        if (totalQty >= req.qty_needed) break;
        matches.push(match);
        totalQty += Number(match.product.qty_kg);
      }

      return {
        item_name: req.item_name,
        matches,
        totalQty,
        fulfilled: totalQty >= req.qty_needed,
      };
    });
}
