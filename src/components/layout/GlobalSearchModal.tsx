import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Layers,
  Building2,
  GraduationCap,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Equipment, Laboratory, Student, ActiveNavModule } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment[];
  laboratories: Laboratory[];
  students: Student[];
  onSelectEquipment: (eq: Equipment) => void;
  onSelectLaboratory: (lab: Laboratory) => void;
  onSelectStudent: (stud: Student) => void;
  onNavigate: (module: ActiveNavModule) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  equipment,
  laboratories,
  students,
  onSelectEquipment,
  onSelectLaboratory,
  onSelectStudent,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        equipment: equipment.slice(0, 3),
        laboratories: laboratories.slice(0, 3),
        students: students.slice(0, 2),
      };
    }

    return {
      equipment: equipment.filter(
        (eq) =>
          eq.name.toLowerCase().includes(q) ||
          eq.assetTag.toLowerCase().includes(q) ||
          eq.serialNumber.toLowerCase().includes(q) ||
          eq.category.toLowerCase().includes(q)
      ),
      laboratories: laboratories.filter(
        (lab) =>
          lab.name.toLowerCase().includes(q) ||
          lab.code.toLowerCase().includes(q) ||
          lab.building.toLowerCase().includes(q) ||
          lab.roomNumber.toLowerCase().includes(q)
      ),
      students: students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      ),
    };
  }, [query, equipment, laboratories, students]);

  if (!isOpen) return null;

  const totalMatches =
    filtered.equipment.length + filtered.laboratories.length + filtered.students.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24 animate-in fade-in duration-200">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#3b2320] bg-[#160f0e] shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden animate-in zoom-in-95 duration-150 text-[#f5efe8]">
        {/* Search Input Bar with subtle red electric glow */}
        <div className="flex items-center border-b border-[#2d1b19] px-4 py-3.5 bg-[#1b1211]">
          <Search className="h-5 w-5 text-red-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Universal search: Asset Tag (BBSUTSD-EET), Lab code, Roll no..."
            className="w-full bg-transparent text-sm text-[#f5efe8] placeholder:text-[#8a796e] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mr-2 text-[#8a796e] hover:text-[#f5efe8]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded border border-[#3d2724] bg-[#221614] px-2 py-0.5 font-mono text-[11px] text-[#9e8d80]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {totalMatches === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#c4b5a8]">No matching records found</p>
              <p className="text-xs text-[#8a796e] mt-1">
                Try searching for "Oscilloscope", "LAB-EET-204", or roll number "22BBSUTSD"
              </p>
            </div>
          ) : (
            <>
              {/* Equipment Matches */}
              {filtered.equipment.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 pb-1.5">
                    <span className="text-[11px] font-semibold text-[#8a796e] uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-red-400" />
                      Equipment Assets ({filtered.equipment.length})
                    </span>
                    <button
                      onClick={() => {
                        onNavigate('equipment');
                        onClose();
                      }}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                    >
                      View in registry <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {filtered.equipment.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectEquipment(item);
                          onClose();
                        }}
                        className="group flex items-center justify-between rounded-xl p-2.5 hover:bg-[#201514] border border-transparent hover:border-[#382320] transition cursor-pointer"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded border border-red-900/50">
                              {item.assetTag}
                            </span>
                            <span className="text-xs font-medium text-[#f5efe8] truncate group-hover:text-red-200 transition">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#9e8d80] mt-0.5">
                            <span>{item.model}</span>
                            <span aria-hidden="true" className="text-red-950">·</span>
                            <span>{item.location.building}</span>
                            {item.location.cabinet && (
                              <>
                                <span aria-hidden="true" className="text-red-950">·</span>
                                <span>{item.location.cabinet}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-medium capitalize text-stone-400 shrink-0">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Laboratories Matches */}
              {filtered.laboratories.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 pb-1.5">
                    <span className="text-[11px] font-semibold text-[#8a796e] uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-amber-400" />
                      Laboratories ({filtered.laboratories.length})
                    </span>
                    <button
                      onClick={() => {
                        onNavigate('laboratories');
                        onClose();
                      }}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                    >
                      View all labs <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {filtered.laboratories.map((lab) => (
                      <div
                        key={lab.id}
                        onClick={() => {
                          onSelectLaboratory(lab);
                          onClose();
                        }}
                        className="group flex items-center justify-between rounded-xl p-2.5 hover:bg-[#201514] border border-transparent hover:border-[#382320] transition cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/50">
                              {lab.code}
                            </span>
                            <span className="text-xs font-medium text-[#f5efe8] truncate group-hover:text-amber-200 transition">
                              {lab.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9e8d80] mt-0.5">
                            {lab.building} · Room {lab.roomNumber} · Lead: {lab.assignedAssistantName}
                          </p>
                        </div>
                        <span className="text-xs text-[#9e8d80] tabular-nums font-mono">
                          {lab.totalEquipmentCount} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Students Matches */}
              {filtered.students.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 pb-1.5">
                    <span className="text-[11px] font-semibold text-[#8a796e] uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-stone-400" />
                      Students ({filtered.students.length})
                    </span>
                    <button
                      onClick={() => {
                        onNavigate('students');
                        onClose();
                      }}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                    >
                      View registry <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {filtered.students.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => {
                          onSelectStudent(student);
                          onClose();
                        }}
                        className="group flex items-center justify-between rounded-xl p-2.5 hover:bg-[#201514] border border-transparent hover:border-[#382320] transition cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-stone-200 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-700">
                              {student.rollNumber}
                            </span>
                            <span className="text-xs font-medium text-[#f5efe8]">
                              {student.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9e8d80] mt-0.5">
                            {student.department} · {student.semester}
                          </p>
                        </div>
                        <span className="text-[11px] text-red-300 tabular-nums">
                          {student.activeIssuesCount} loans
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-[#2d1b19] bg-[#140e0d] px-4 py-2.5 text-[11px] text-[#8a796e]">
          <span>Universal laboratory indexing system</span>
          <span className="font-mono text-[10px] text-red-400">Building → Floor → Lab → Cabinet → Shelf</span>
        </div>
      </div>
    </div>
  );
};
