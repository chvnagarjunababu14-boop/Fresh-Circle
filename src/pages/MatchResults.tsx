import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Tag, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { smartMatchAlgorithm } from '@/lib/smartMatch';

export default function MatchResults() {
  const navigate = useNavigate();
  const { requirements, vendors, products, currentUser } = useAppStore();

  const results = useMemo(() => {
    if (!currentUser) return [];
    const buyerLat = currentUser.lat ?? 12.9716;
    const buyerLng = currentUser.lng ?? 77.5946;
    return smartMatchAlgorithm(requirements, vendors, products, buyerLat, buyerLng);
  }, [requirements, vendors, products, currentUser]);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="touch-target rounded-xl bg-secondary"
        >
          <ArrowLeft size={28} />
        </motion.button>
        <h1 className="text-kiosk">Match Results</h1>
      </div>

      {results.length === 0 && (
        <div className="card-surface text-center py-12">
          <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-kiosk-sm">No requirements to match</p>
          <p className="text-muted-foreground font-medium">Add requirements first</p>
        </div>
      )}

      <div className="space-y-6">
        {results.map((result, i) => (
          <motion.div
            key={result.item_name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-3 h-3 rounded-full ${result.fulfilled ? 'bg-primary' : 'bg-surplus'}`} />
              <h2 className="text-kiosk-sm flex-1">{result.item_name}</h2>
              {result.fulfilled ? (
                <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={14} /> FULFILLED
                </span>
              ) : (
                <span className="text-xs font-bold bg-surplus/10 text-surplus px-3 py-1 rounded-full">
                  {result.totalQty.toFixed(0)} / {results.length > 0 ? 'needed' : '0'} kg
                </span>
              )}
            </div>

            <div className="space-y-2">
              {result.matches.map((match) => (
                <div key={match.product.id} className={`card-surface flex items-center gap-3 ${match.product.is_surplus ? 'border-surplus border-2' : ''}`}>
                  <span className="text-3xl">{match.product.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{match.vendor.business_name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <MapPin size={12} />
                      <span>{match.distance.toFixed(1)} km</span>
                      <Tag size={12} />
                      <span>₹{match.effectivePrice.toFixed(0)}/kg</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{match.product.qty_kg} kg</div>
                    {match.product.is_surplus && (
                      <span className="text-xs font-bold text-surplus">-30%</span>
                    )}
                  </div>
                </div>
              ))}
              {result.matches.length === 0 && (
                <div className="card-surface text-center py-4 text-muted-foreground text-sm font-medium">
                  No vendors found within 4km
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
