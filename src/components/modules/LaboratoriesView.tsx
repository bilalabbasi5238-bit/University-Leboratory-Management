import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Filter,
  Users,
  Layers,
  Phone,
  MapPin,
  ChevronRight,
  X,
  Zap,
  Mail,
  KeyRound,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Laboratory, Equipment } from '../../types';

interface LaboratoriesViewProps {
  laboratories: Laboratory[];
  equipment: Equipment[];
  selectedLab: Laboratory | null;
  onSelectLab: (lab: Laboratory | null) => void;
  onAddLabClick: () => void;
  onDeleteLab?: (labId: string) => void;
  isHodAdmin?: boolean;
}

export const LaboratoriesView: React.FC<LaboratoriesViewProps> = ({
  laboratories,
  equipment,
  selectedLab,
  onSelectLab,
  onAddLabClick,
  onDeleteLab,
  isHodAdmin = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [labToDelete, setLabToDelete] = useState<Laboratory | null>(null);

  const departments = Array.from(new Set(laboratories.map((l) => l.department)));

  const filteredLabs = laboratories.filter((lab) => {
    const matchesSearch =
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || lab.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const labEquipment = selectedLab
    ? equipment.filter((e) => e.labId === selectedLab.id)
    : [];

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
              placeholder="Search by lab name, code, building..."
              className="w-full rounded-xl border border-[#36221f] bg-[#160f0e] py-2 pl-9 pr-4 text-xs text-[#f5efe8] placeholder:text-[#7d6c60] focus:border-red-600 focus:shadow-[0_0_12px_rgba(220,38,38,0.25)] focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-[#7d6c60]" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-[#36221f] bg-[#160f0e] px-3 py-2 text-xs font-medium text-[#c4b5a8] focus:border-red-600 focus:outline-none transition"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onAddLabClick}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <Plus className="h-4 w-4 text-red-300" />
          <span>Add New Laboratory</span>
        </button>
      </div>

      {/* Grid of Laboratories */}
      {filteredLabs.length === 0 ? (
        <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d1211] border border-[#382320] text-red-400 mb-3 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Building2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Laboratory Facilities Found</h3>
          <p className="text-xs text-[#8a796e] max-w-md mx-auto mt-1">
            {laboratories.length === 0
              ? 'No laboratories have been registered yet. Add your university facilities to begin cataloging equipment.'
              : 'No laboratories match your current search or department filter.'}
          </p>
          <div className="mt-4">
            <button
              onClick={onAddLabClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition"
            >
              <Plus className="h-3.5 w-3.5 text-red-300" />
              <span>Register First Laboratory</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredLabs.map((lab) => {
            const labEqCount = equipment.filter((e) => e.labId === lab.id).length;
            const labIssuedCount = equipment.filter(
              (e) => e.labId === lab.id && e.status === 'issued'
            ).length;

            return (
              <div
                key={lab.id}
                onClick={() => onSelectLab(lab)}
                className={`group rounded-2xl border p-5 transition-all duration-200 cursor-pointer shadow-lg ${
                  selectedLab?.id === lab.id
                    ? 'border-red-600 bg-[#201413] shadow-[0_0_20px_rgba(220,38,38,0.25)]'
                    : 'border-[#2e1d1b] bg-[#160f0e] hover:border-red-900/60 hover:bg-[#1c1312] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-red-300 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-800/50">
                      {lab.code}
                    </span>
                    <span className="ml-2 text-[11px] text-[#7d6c60] uppercase font-mono">
                      {lab.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {onDeleteLab && isHodAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLabToDelete(lab);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#382320] bg-[#1a1211] text-[#8a796e] hover:border-red-600 hover:bg-red-950 hover:text-red-300 transition shadow-xs"
                        title={`Delete ${lab.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <ChevronRight className="h-4 w-4 text-[#7d6c60] group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                <h3 className="mt-3 text-base font-bold text-white group-hover:text-red-200 transition">
                  {lab.name}
                </h3>
                <p className="text-xs text-[#9e8d80] mt-0.5 line-clamp-1">{lab.department}</p>

                <div className="mt-4 space-y-2 text-xs text-[#b8a89b]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                    <span className="truncate">
                      {lab.building} · {lab.floor} · Room {lab.roomNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-[#7d6c60] shrink-0" />
                    <span className="truncate">Lead: {lab.assignedAssistantName}</span>
                  </div>
                  {lab.assistantEmail && (
                    <div className="flex items-center gap-2 text-[11px] text-red-300/90 font-mono">
                      <Mail className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      <span className="truncate">{lab.assistantEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#7d6c60] shrink-0" />
                    <span className="font-mono text-[11px] text-[#8a796e]">{lab.contactExtension}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#231614] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#7d6c60]">Capacity: </span>
                    <span className="font-medium text-stone-300">{lab.capacity} seats</span>
                  </div>
                  <div>
                    <span className="text-[#7d6c60]">Equipment: </span>
                    <span className="font-medium text-stone-300 font-mono tabular-nums">{labEqCount}</span>
                  </div>
                  <div>
                    <span className="text-[#7d6c60]">Active Loans: </span>
                    <span className="font-semibold text-amber-400 font-mono tabular-nums">{labIssuedCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Lab Detail Slide-over / Inspector */}
      {selectedLab && (
        <div className="rounded-2xl border border-red-900/60 bg-[#160f0e] p-6 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-start justify-between border-b border-[#281816] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-red-300 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-800/50">
                  {selectedLab.code}
                </span>
                <span className="text-xs text-red-950">·</span>
                <span className="text-xs font-medium text-[#9e8d80]">{selectedLab.department}</span>
              </div>
              <h2 className="mt-1.5 text-lg font-bold text-white">{selectedLab.name}</h2>
              <p className="text-xs text-[#9e8d80]">
                Building: {selectedLab.building} · {selectedLab.floor} · Room {selectedLab.roomNumber} · Contact: {selectedLab.contactExtension}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onDeleteLab && isHodAdmin && (
                <button
                  type="button"
                  onClick={() => setLabToDelete(selectedLab)}
                  className="flex items-center gap-1.5 rounded-xl border border-red-800/80 bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/60 hover:text-white transition shadow-sm"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  <span>Delete Facility</span>
                </button>
              )}
              <button
                onClick={() => onSelectLab(null)}
                className="text-[#7d6c60] hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#2e1d1b] bg-[#1c1312] p-4">
              <span className="text-[11px] font-semibold text-red-400/90 uppercase tracking-wider">Supervising Assistant</span>
              <p className="text-sm font-bold text-white mt-1">{selectedLab.assignedAssistantName}</p>
              {selectedLab.assistantEmail && (
                <p className="text-xs text-red-300 font-mono mt-0.5 truncate">{selectedLab.assistantEmail}</p>
              )}
              <p className="text-xs text-[#7d6c60]">Lead Technical Operator</p>
            </div>

            <div className="rounded-xl border border-[#2e1d1b] bg-[#1c1312] p-4">
              <span className="text-[11px] font-semibold text-red-400/90 uppercase tracking-wider">Facility Capacity</span>
              <p className="text-sm font-bold text-white mt-1">{selectedLab.capacity} Workstations</p>
              <p className="text-xs text-[#7d6c60]">Room {selectedLab.roomNumber}</p>
            </div>

            <div className="rounded-xl border border-[#2e1d1b] bg-[#1c1312] p-4">
              <span className="text-[11px] font-semibold text-red-400/90 uppercase tracking-wider">Operational Status</span>
              <p className="text-sm font-bold text-emerald-400 mt-1 capitalize">
                {selectedLab.status} &amp; Verified
              </p>
              <p className="text-xs text-[#7d6c60]">BBSUTSD Khairpur</p>
            </div>
          </div>

          {/* Dedicated Assistant Login Credentials Information */}
          {selectedLab.assistantEmail && (
            <div className="mt-4 rounded-xl border border-red-900/60 bg-[#1e1312] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-red-400" />
                  Assigned Lab Assistant Portal Login Credentials
                </span>
                <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#8a796e]">Email: </span>
                    <span className="text-white font-semibold">{selectedLab.assistantEmail}</span>
                  </div>
                  {selectedLab.assistantPassword && (
                    <div>
                      <span className="text-[#8a796e]">Password: </span>
                      <span className="text-amber-300 font-semibold">{selectedLab.assistantPassword}</span>
                    </div>
                  )}
                  {selectedLab.assistantStaffId && (
                    <div>
                      <span className="text-[#8a796e]">Staff ID: </span>
                      <span className="text-red-300">{selectedLab.assistantStaffId}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/50 shrink-0">
                ✓ Portal Access Enabled
              </span>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-bold text-white mb-3">
              Equipment Assigned to this Facility ({labEquipment.length} units)
            </h3>
            {labEquipment.length === 0 ? (
              <div className="rounded-xl border border-[#281816] bg-[#181110] p-6 text-center text-xs text-[#8a796e]">
                No equipment units are currently cataloged in this laboratory.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {labEquipment.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between rounded-xl border border-[#2b1a18] bg-[#1c1312] p-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{eq.name}</div>
                      <div className="font-mono text-[11px] text-red-400">{eq.assetTag}</div>
                    </div>
                    <span
                      className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                        eq.status === 'available'
                          ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                          : 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                      }`}
                    >
                      {eq.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Laboratory Confirmation Modal */}
      {labToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setLabToDelete(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-red-900/80 bg-[#160f0e] p-6 shadow-2xl text-[#f5efe8]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-950/80 border border-red-800 text-red-400 mb-3 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white text-center">
              Confirm Laboratory Deletion
            </h3>
            <p className="text-xs text-[#a39589] text-center mt-1.5 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-white">{labToDelete.name}</span> (
              <span className="font-mono text-red-400 font-semibold">{labToDelete.code}</span>)?
            </p>

            <div className="mt-4 rounded-xl border border-[#30201d] bg-[#1a1211] p-3.5 text-xs text-[#a39589] space-y-1.5">
              <p className="text-[11px] text-amber-300 font-semibold">⚠️ Deletion consequences:</p>
              <ul className="list-disc list-inside text-[11px] space-y-1 text-[#8a796e]">
                <li>Removes this facility record permanently from Firebase Firestore</li>
                <li>Equipment assigned to this lab will be unassigned</li>
                <li>Revokes portal access credentials for {labToDelete.assignedAssistantName}</li>
              </ul>
            </div>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setLabToDelete(null)}
                className="flex-1 rounded-xl border border-[#382320] bg-[#1c1312] py-2.5 text-xs font-semibold text-stone-300 hover:bg-[#251917] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteLab) {
                    onDeleteLab(labToDelete.id);
                  }
                  setLabToDelete(null);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transition"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-300" />
                <span>Yes, Delete Facility</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
