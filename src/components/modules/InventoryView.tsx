import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  X,
} from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Consumable' | 'Capital Asset' | 'Tooling';
  labCode: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  reorderStatus: 'adequate' | 'low' | 'reorder_placed';
}

export const InventoryView: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Consumable' | 'Capital Asset' | 'Tooling'>('Consumable');
  const [newLabCode, setNewLabCode] = useState('LAB-EET-204');
  const [newStock, setNewStock] = useState<number>(10);
  const [newThreshold, setNewThreshold] = useState<number>(5);
  const [newUnit, setNewUnit] = useState('Units');

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.labCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku.trim() || !newName.trim()) return;

    const created: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: newSku.trim().toUpperCase(),
      name: newName.trim(),
      category: newCategory,
      labCode: newLabCode.trim().toUpperCase(),
      currentStock: Number(newStock) || 0,
      minThreshold: Number(newThreshold) || 0,
      unit: newUnit.trim() || 'Units',
      reorderStatus: Number(newStock) <= Number(newThreshold) ? 'low' : 'adequate',
    };

    setItems((prev) => [created, ...prev]);
    setShowAddModal(false);

    // Reset Form
    setNewSku('');
    setNewName('');
    setNewStock(10);
    setNewThreshold(5);
    setNewUnit('Units');
  };

  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Consumables &amp; Laboratory Inventory
          </h2>
          <p className="text-xs text-[#a39589] mt-0.5">
            Continuous stock auditing, threshold triggers, and departmental replenishment tracking.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 transition-all"
        >
          <Plus className="h-4 w-4 text-red-300" />
          <span>Add Inventory Item</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-red-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stock by SKU, name, or lab..."
            className="w-full rounded-xl border border-[#36221f] bg-[#160f0e] py-2 pl-9 pr-4 text-xs text-[#f5efe8] placeholder:text-[#7d6c60] focus:border-red-600 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#191110] text-[11px] font-semibold uppercase text-[#8a796e] border-b border-[#241715]">
              <tr>
                <th className="px-5 py-3">SKU / Code</th>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Assigned Facility</th>
                <th className="px-4 py-3 text-right">In Stock</th>
                <th className="px-4 py-3 text-right">Min Threshold</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#231614]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d1211] border border-[#382320] text-red-400">
                        <Package className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-white">No Inventory Items Recorded</p>
                      <p className="text-xs text-[#8a796e] max-w-sm">
                        {items.length === 0
                          ? 'No consumable stocks or toolings registered yet. Add items to track minimum thresholds and reorder alerts.'
                          : 'No items match your search filter.'}
                      </p>
                      {items.length === 0 && (
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="mt-2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition"
                        >
                          <Plus className="h-3.5 w-3.5 text-red-300" />
                          <span>Add First Inventory Item</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#201514] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-red-400">
                      {item.sku}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-white">{item.name}</td>
                    <td className="px-4 py-3.5 text-[#a39589]">{item.category}</td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-amber-400/90">
                      {item.labCode}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-white tabular-nums font-mono">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="px-4 py-3.5 text-right text-[#8a796e] tabular-nums font-mono">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {item.reorderStatus === 'low' ? (
                        <span className="text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60 font-mono text-[11px]">
                          Low Stock Alert
                        </span>
                      ) : item.reorderStatus === 'reorder_placed' ? (
                        <span className="text-amber-400 font-medium">Reorder Placed</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">Adequate</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inventory Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-[#382320] bg-[#160f0e] p-6 shadow-2xl text-[#f5efe8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#281816]">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-red-400" />
                <h3 className="text-base font-bold text-white">Add Consumable / Inventory Stock</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#7d6c60] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Stock SKU *</label>
                  <input
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="e.g. CON-EET-FUSE-10A"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Item Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                  >
                    <option value="Consumable">Consumable</option>
                    <option value="Tooling">Tooling</option>
                    <option value="Capital Asset">Capital Asset</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#b8a89b] font-medium mb-1">Item Name &amp; Description *</label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Fast-Blow Ceramic Cartridge Fuses 10A 250V"
                  className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Facility Code</label>
                  <input
                    value={newLabCode}
                    onChange={(e) => setNewLabCode(e.target.value)}
                    placeholder="LAB-EET-204"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Min Threshold</label>
                  <input
                    type="number"
                    min="0"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#241715] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-[#382320] bg-[#1c1312] px-3.5 py-2 text-xs font-semibold text-stone-300 hover:bg-[#251917] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] transition"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
