import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';

export default function BuyerDashboard() {
  const { requirements, addRequirement, loadRequirements } = useAppStore();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [itemName, setItemName] = useState('');
  const [qtyNeeded, setQtyNeeded] = useState('');

  useEffect(() => { loadRequirements(); }, []);

  const myReqs = requirements.filter(r => r.buyer_id === profile?.id);

  const handleAdd = async () => {
    if (!itemName || !qtyNeeded || !profile) return;
    await addRequirement({
      buyer_id: profile.id,
      item_name: itemName,
      qty_needed: Number(qtyNeeded),
      status: 'open',
    });
    setItemName('');
    setQtyNeeded('');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-kiosk">Requirements</h1>
        <p className="text-muted-foreground font-medium">{profile?.business_name}</p>
      </div>

      <div className="card-surface mb-6 space-y-3">
        <p className="text-kiosk-sm">Post Requirement</p>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Item name (e.g. Tomato)"
          className="w-full min-h-[56px] rounded-xl border border-border bg-background px-4 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          value={qtyNeeded}
          onChange={(e) => setQtyNeeded(e.target.value)}
          placeholder="Quantity needed (kg)"
          className="w-full min-h-[56px] rounded-xl border border-border bg-background px-4 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          disabled={!itemName || !qtyNeeded}
          className="btn-fresh w-full disabled:opacity-40"
        >
          <Plus size={28} />
          <span>Add Requirement</span>
        </motion.button>
      </div>

      <div className="space-y-3 mb-6">
        {myReqs.length === 0 && (
          <div className="card-surface text-center py-8">
            <p className="text-muted-foreground font-medium">No requirements yet</p>
            <p className="text-sm text-muted-foreground">Add items you need above</p>
          </div>
        )}
        {myReqs.map((r) => (
          <motion.div key={r.id} layout className="card-surface flex items-center gap-4">
            {r.status === 'fulfilled' ? (
              <CheckCircle2 size={28} className="text-primary shrink-0" />
            ) : (
              <Circle size={28} className="text-muted-foreground shrink-0" />
            )}
            <div className="flex-1">
              <div className="text-kiosk-sm">{r.item_name}</div>
              <div className="text-muted-foreground text-sm font-medium">{r.qty_needed} kg</div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              r.status === 'fulfilled'
                ? 'bg-primary/10 text-primary'
                : 'bg-surplus/10 text-surplus'
            }`}>
              {r.status.toUpperCase()}
            </span>
          </motion.div>
        ))}
      </div>

      {myReqs.some(r => r.status === 'open') && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/match-results')}
          className="btn-fresh w-full"
        >
          <Search size={28} />
          <span>Find Best Match</span>
        </motion.button>
      )}
    </div>
  );
}
