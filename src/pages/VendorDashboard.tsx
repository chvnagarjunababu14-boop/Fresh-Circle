import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertTriangle, Package, Mic } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import VoiceInput from '@/components/VoiceInput';
import type { Product } from '@/lib/types';

const produceItems = [
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Potato', emoji: '🥔' },
  { name: 'Onion', emoji: '🧅' },
  { name: 'Carrot', emoji: '🥕' },
  { name: 'Brinjal', emoji: '🍆' },
  { name: 'Chili', emoji: '🌶️' },
];

export default function VendorDashboard() {
  const { products, addProduct, toggleSurplus, currentUser } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof produceItems[0] | null>(null);
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [surplusMode, setSurplusMode] = useState(false);

  const myProducts = products.filter(p => p.vendor_id === currentUser?.id);

  const handleAdd = useCallback(() => {
    if (!selectedItem || !qty || !price || !currentUser) return;
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      vendor_id: currentUser.id,
      name: selectedItem.name,
      emoji: selectedItem.emoji,
      qty_kg: Number(qty),
      price_per_kg: Number(price),
      is_surplus: false,
      created_at: new Date().toISOString(),
    };
    addProduct(newProduct);
    setSelectedItem(null);
    setQty('');
    setPrice('');
    setShowAdd(false);
  }, [selectedItem, qty, price, currentUser, addProduct]);

  const handleVoice = (text: string) => {
    // Parse "50 kg tomato at 40"
    const match = text.match(/(\d+)\s*(?:kg|kilo)?\s*(\w+)(?:\s*(?:at|@)\s*(\d+))?/i);
    if (match) {
      setQty(match[1]);
      const itemName = match[2].toLowerCase();
      const found = produceItems.find(p => p.name.toLowerCase().startsWith(itemName));
      if (found) setSelectedItem(found);
      if (match[3]) setPrice(match[3]);
      setShowAdd(true);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-kiosk">My Stock</h1>
          <p className="text-muted-foreground font-medium">{currentUser?.business_name}</p>
        </div>
        <VoiceInput onResult={handleVoice} />
      </div>

      {/* Surplus Toggle */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setSurplusMode(!surplusMode)}
        className={`w-full mb-6 ${surplusMode ? 'btn-surplus' : 'card-surface flex items-center gap-3 min-h-[64px] px-4 cursor-pointer'}`}
      >
        <AlertTriangle size={28} className={surplusMode ? '' : 'text-surplus'} />
        <div className="text-left">
          <div className="text-lg font-bold">End of Day Surplus</div>
          <div className="text-sm opacity-80">
            {surplusMode ? '30% discount active · Tap to disable' : 'Tap to mark unsold stock'}
          </div>
        </div>
      </motion.button>

      {/* Product List */}
      <div className="space-y-3 mb-6">
        {myProducts.map((p) => (
          <motion.div
            key={p.id}
            layout
            className={`card-surface flex items-center gap-4 ${p.is_surplus ? 'border-surplus border-2' : ''}`}
          >
            <span className="text-4xl">{p.emoji}</span>
            <div className="flex-1">
              <div className="text-kiosk-sm">{p.name}</div>
              <div className="text-muted-foreground text-sm font-medium">
                {p.qty_kg} kg · ₹{p.price_per_kg.toFixed(0)}/kg
              </div>
            </div>
            {p.is_surplus && (
              <span className="bg-surplus text-surplus-foreground text-xs font-bold px-3 py-1 rounded-full">
                SURPLUS
              </span>
            )}
            {surplusMode && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleSurplus(p.id)}
                className="touch-target rounded-xl bg-secondary"
              >
                <Package size={24} className={p.is_surplus ? 'text-surplus' : 'text-muted-foreground'} />
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add Stock Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAdd(true)}
        className="btn-fresh w-full"
      >
        <Plus size={32} />
        <span className="text-xl">Add Stock</span>
      </motion.button>

      {/* Add Stock Sheet */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="p-4 max-w-lg mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-kiosk">Add Stock</h2>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowAdd(false)} className="touch-target rounded-xl bg-secondary text-kiosk-sm">
                  ✕
                </motion.button>
              </div>

              {/* Item Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {produceItems.map((item) => (
                  <motion.button
                    key={item.name}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedItem(item)}
                    className={`card-surface flex flex-col items-center gap-2 py-6 ${
                      selectedItem?.name === item.name ? 'border-primary border-2 bg-primary/5' : ''
                    }`}
                  >
                    <span className="text-5xl">{item.emoji}</span>
                    <span className="font-bold text-sm">{item.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-bold text-muted-foreground mb-2 block">Quantity (kg)</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full min-h-[64px] rounded-xl border border-border bg-surface px-4 text-xl font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-muted-foreground mb-2 block">Price per kg (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full min-h-[64px] rounded-xl border border-border bg-surface px-4 text-xl font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                disabled={!selectedItem || !qty || !price}
                className="btn-fresh w-full disabled:opacity-40"
              >
                <Plus size={28} />
                <span>Add {selectedItem?.name || 'Item'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
