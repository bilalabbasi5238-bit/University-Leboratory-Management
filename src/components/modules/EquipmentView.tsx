import React, { useState } from 'react';
import {
  Search,
  Plus,
  Layers,
  QrCode,
  MapPin,
  X,
  Zap,
} from 'lucide-react';
import { Equipment, Laboratory } from '../../types';
import { UniversityLogo } from '../common/UniversityLogo';

interface EquipmentViewProps {
  equipment: Equipment[];
  laboratories: Laboratory[];
  selectedEquipment: Equipment | null;
  onSelectEquipment: (eq: Equipment | null) => void;
  onAddEquipmentClick: () => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  equipment,
  laboratories,
  selectedEquipment,
  onSelectEquipment,
  onAddEquipmentClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [labFilter, setLabFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [qrModalItem, setQrModalItem] = useState<Equipment | null>(null);

  const filteredEquipment = equipment.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.assetTag.toLowerCase().includes(q) ||
      item.serialNumber.toLowerCase().includes(q) ||
      item.model.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    const matchesLab = labFilter === 'all' || item.labId === labFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesLab && matchesStatus;
  });

  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'available':
        return <span className="text-emerald-400 font-medium">Available</span>;
      case 'issued':
        return <span className="text-amber-400 font-medium">Issued on Loan</span>;
      case 'maintenance':
        return <span className="text-rose-400 font-medium">In Maintenance</span>;
      case 'damaged':
        return <span className="text-red-500 font-bold">Damaged</span>;
      default:
        return <span className="text-stone-400 capitalize">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-red-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Asset Tag, Serial No, Model, or Name..."
              className="w-full rounded-xl border border-[#36221f] bg-[#160f0e] py-2 pl-9 pr-4 text-xs text-[#f5efe8] placeholder:text-[#7d6c60] focus:border-red-600 focus:shadow-[0_0_12px_rgba(220,38,38,0.25)] focus:outline-none transition-all"
            />
          </div>

          {/* Facility Filter */}
          <select
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
            className="rounded-xl border border-[#36221f] bg-[#160f0e] px-3 py-2 text-xs font-medium text-[#c4b5a8] focus:border-red-600 focus:outline-none transition"
          >
            <option value="all">All Facilities ({equipment.length})</option>
            {laboratories.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.code} — {lab.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#36221f] bg-[#160f0e] px-3 py-2 text-xs font-medium text-[#c4b5a8] focus:border-red-600 focus:outline-none transition"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="issued">Issued</option>
            <option value="maintenance">Maintenance</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>

        <button
          onClick={onAddEquipmentClick}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0"
        >
          <Plus className="h-4 w-4 text-red-300" />
          <span>Register New Asset</span>
        </button>
      </div>

      {/* Equipment Table */}
      <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#191110] text-[11px] font-semibold uppercase text-[#8a796e] border-b border-[#241715]">
              <tr>
                <th className="px-5 py-3">Asset Tag & QR</th>
                <th className="px-4 py-3">Equipment Name & Model</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Physical Hierarchy Location</th>
                <th className="px-4 py-3">Serial Number</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#231614]">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d1211] border border-[#382320] text-red-400">
                        <Layers className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-white">No Equipment Assets Found</p>
                      <p className="text-xs text-[#8a796e] max-w-sm">
                        {equipment.length === 0
                          ? 'No equipment assets cataloged yet. Register an equipment item to start tracking loans and calibrations.'
                          : 'No equipment items matched your search and filter criteria.'}
                      </p>
                      {equipment.length === 0 && (
                        <button
                          onClick={onAddEquipmentClick}
                          className="mt-2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition"
                        >
                          <Plus className="h-3.5 w-3.5 text-red-300" />
                          <span>Register First Asset</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectEquipment(item)}
                    className="hover:bg-[#201514] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQrModalItem(item);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#382320] bg-[#1c1312] text-red-400 hover:border-red-900/60 hover:text-red-300 transition"
                          title="View QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                        <span className="font-mono text-xs font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
                          {item.assetTag}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[11px] text-[#8a796e]">
                        {item.manufacturer} · {item.model}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-[#a39589]">
                      <span>{item.category}</span>
                    </td>

                    <td className="px-4 py-3.5 text-[#a39589]">
                      <div className="flex items-center gap-1 font-semibold text-white">
                        <MapPin className="h-3 w-3 text-red-400" />
                        <span>{item.location.labId}</span>
                      </div>
                      <div className="text-[11px] text-[#7d6c60]">
                        {item.location.building} · {item.location.cabinet || 'Main Bay'}{' '}
                        {item.location.shelf ? `· ${item.location.shelf}` : ''}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px] text-[#8a796e]">
                      {item.serialNumber}
                    </td>

                    <td className="px-4 py-3.5 capitalize">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEquipment(item);
                        }}
                        className="text-xs font-semibold text-red-400 hover:text-red-300 transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#241715] bg-[#140e0d] px-5 py-3 text-xs text-[#8a796e]">
          <span>Showing {filteredEquipment.length} registered equipment units</span>
          <span className="font-mono text-[11px] text-red-400">QR Asset Tag Scan Ready</span>
        </div>
      </div>

      {/* Selected Equipment Detailed Inspector Drawer */}
      {selectedEquipment && (
        <div className="rounded-2xl border border-red-900/60 bg-[#160f0e] p-6 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-start justify-between border-b border-[#281816] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-red-300 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-800/50">
                  {selectedEquipment.assetTag}
                </span>
                <span className="text-xs text-red-950">·</span>
                <span className="text-xs font-mono text-[#8a796e]">SN: {selectedEquipment.serialNumber}</span>
                <span className="text-xs text-red-950">·</span>
                <span className="text-xs font-medium capitalize">{getStatusBadge(selectedEquipment.status)}</span>
              </div>
              <h2 className="mt-1.5 text-lg font-bold text-white">{selectedEquipment.name}</h2>
              <p className="text-xs text-[#9e8d80]">
                {selectedEquipment.manufacturer} — Model: {selectedEquipment.model} ({selectedEquipment.category})
              </p>
            </div>
            <button
              onClick={() => onSelectEquipment(null)}
              className="text-[#7d6c60] hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 6-Level Physical Hierarchy Display with Dark Chocolate Layered Cards */}
          <div className="mt-5 rounded-xl border border-[#2e1d1b] bg-[#1c1312] p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-2.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>Physical Location Hierarchy (Building → Floor → Lab → Cabinet → Drawer → Shelf)</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 text-xs">
              <div className="rounded-lg bg-[#140e0d] p-2.5 border border-[#2b1a18]">
                <span className="text-[10px] text-[#7d6c60] uppercase font-semibold">1. Building</span>
                <p className="font-medium text-white mt-0.5">{selectedEquipment.location.building}</p>
              </div>
              <div className="rounded-lg bg-[#140e0d] p-2.5 border border-[#2b1a18]">
                <span className="text-[10px] text-[#7d6c60] uppercase font-semibold">2. Floor</span>
                <p className="font-medium text-white mt-0.5">{selectedEquipment.location.floor}</p>
              </div>
              <div className="rounded-lg bg-[#140e0d] p-2.5 border border-[#2b1a18]">
                <span className="text-[10px] text-[#7d6c60] uppercase font-semibold">3. Laboratory</span>
                <p className="font-medium text-white mt-0.5">{selectedEquipment.location.labId}</p>
              </div>
              <div className="rounded-lg bg-[#140e0d] p-2.5 border border-[#2b1a18]">
                <span className="text-[10px] text-[#7d6c60] uppercase font-semibold">4. Cabinet</span>
                <p className="font-medium text-white mt-0.5">{selectedEquipment.location.cabinet || 'Main Bay'}</p>
              </div>
              <div className="rounded-lg bg-[#140e0d] p-2.5 border border-[#2b1a18]">
                <span className="text-[10px] text-[#7d6c60] uppercase font-semibold">5. Drawer</span>
                <p className="font-medium text-white mt-0.5">{selectedEquipment.location.drawer || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-[#140e0d] p-2.5 border border-[#2b1a18]">
                <span className="text-[10px] text-[#7d6c60] uppercase font-semibold">6. Shelf</span>
                <p className="font-medium text-white mt-0.5">{selectedEquipment.location.shelf || 'Bench Top'}</p>
              </div>
            </div>
          </div>

          {/* Specifications & Acquisition Details */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#2e1d1b] bg-[#1c1312] p-4">
              <span className="text-[11px] font-semibold text-red-400/90 uppercase tracking-wider">Technical Specs</span>
              {selectedEquipment.specifications ? (
                <div className="mt-1.5 space-y-1 text-xs">
                  {Object.entries(selectedEquipment.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-[#8a796e]">{key}:</span>
                      <span className="font-medium text-white">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#7d6c60] mt-1">Standard laboratory specifications</p>
              )}
            </div>

            <div className="rounded-xl border border-[#2e1d1b] bg-[#1c1312] p-4">
              <span className="text-[11px] font-semibold text-red-400/90 uppercase tracking-wider">Asset Acquisition</span>
              <div className="mt-1.5 space-y-1 text-xs text-[#a39589]">
                <div className="flex justify-between">
                  <span>Purchased:</span>
                  <span className="font-mono text-white">{selectedEquipment.purchaseDate}</span>
                </div>
                {selectedEquipment.cost && (
                  <div className="flex justify-between">
                    <span>Valuation:</span>
                    <span className="font-medium text-white tabular-nums">${selectedEquipment.cost.toLocaleString()}</span>
                  </div>
                )}
                {selectedEquipment.lastCalibrated && (
                  <div className="flex justify-between">
                    <span>Calibration:</span>
                    <span className="font-mono text-white">{selectedEquipment.lastCalibrated}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[#2e1d1b] bg-[#1c1312] p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-red-400/90 uppercase tracking-wider">Asset QR Identifier</span>
                <p className="font-mono text-xs text-red-300 mt-1">{selectedEquipment.qrCode}</p>
              </div>
              <button
                onClick={() => setQrModalItem(selectedEquipment)}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-[#382320] bg-[#140e0d] py-2 text-xs font-semibold text-white hover:border-red-900/60 hover:bg-[#221614] transition"
              >
                <QrCode className="h-3.5 w-3.5 text-red-400" />
                <span>Enlarge Printable QR Tag</span>
              </button>
            </div>
          </div>

          {selectedEquipment.notes && (
            <div className="mt-4 rounded-xl bg-[#201413] border border-red-950/70 p-3 text-xs text-[#d1c2b5]">
              <span className="font-bold text-red-400">Operator Note: </span>
              {selectedEquipment.notes}
            </div>
          )}
        </div>
      )}

      {/* QR Code Printable Modal Dialog */}
      {qrModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setQrModalItem(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-[#382320] bg-[#160f0e] p-6 shadow-2xl text-center text-[#f5efe8]">
            <button
              onClick={() => setQrModalItem(null)}
              className="absolute right-4 top-4 text-[#7d6c60] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex justify-center mb-2">
              <UniversityLogo size="sm" showText={false} />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
              BBSUTSD Official Equipment Asset Tag
            </span>
            <p className="text-[10px] text-[#8a796e] mt-0.5">
              The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur
            </p>
            <h3 className="text-base font-bold text-white mt-1.5">{qrModalItem.name}</h3>
            <p className="font-mono text-sm font-bold text-red-400 mt-0.5">{qrModalItem.assetTag}</p>

            <div className="my-5 flex justify-center">
              <div className="flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-red-900/60 bg-white p-3 shadow-2xl">
                <QrCode className="h-36 w-36 text-black" />
              </div>
            </div>

            <div className="text-xs text-[#9e8d80] space-y-1">
              <p>Model: {qrModalItem.model}</p>
              <p>Location: {qrModalItem.location.labId} · {qrModalItem.location.cabinet || 'Main'}</p>
              <p className="font-mono text-[11px] text-[#7d6c60]">QR: {qrModalItem.qrCode}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#241715] flex gap-2">
              <button
                onClick={() => setQrModalItem(null)}
                className="w-full rounded-xl border border-[#382320] bg-[#1c1312] py-2 text-xs font-semibold text-white hover:bg-[#251917] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
