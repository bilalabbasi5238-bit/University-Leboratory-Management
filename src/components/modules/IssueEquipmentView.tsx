import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Clock,
  Layers,
  GraduationCap,
  Search,
  User,
  Mail,
  FileText,
  Building2,
  Printer,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Tag,
  Check,
  X,
  ChevronDown,
} from 'lucide-react';
import { Equipment, Student, Laboratory } from '../../types';
import { LightningFilament } from '../common/LightningEffect';
import { UniversityLogo } from '../common/UniversityLogo';

interface IssueEquipmentViewProps {
  equipment: Equipment[];
  students: Student[];
  laboratories: Laboratory[];
  onIssueSuccess?: (data: any) => void;
}

export const IssueEquipmentView: React.FC<IssueEquipmentViewProps> = ({
  equipment,
  students,
  laboratories,
  onIssueSuccess,
}) => {
  // --- Manual Student / Borrower Fields ---
  const [studentRollNo, setStudentRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  // --- Equipment Search & Selection ---
  const [equipmentSearchQuery, setEquipmentSearchQuery] = useState('');
  const [selectedLabFilter, setSelectedLabFilter] = useState('ALL');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');

  // --- Time, Date & Duration Fields ---
  const getNowFormattedDate = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getNowFormattedTime = () => {
    const d = new Date();
    const hrs = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${hrs}:${mins}`;
  };

  const [issueDate, setIssueDate] = useState(getNowFormattedDate());
  const [issueTime, setIssueTime] = useState(getNowFormattedTime());

  // Duration in Days, Hours, Minutes
  const [durationDays, setDurationDays] = useState<number>(7);
  const [durationHours, setDurationHours] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);

  // Return Due Date & Time
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  // Recalculate dueDate and dueTime when issueDate, issueTime, or duration changes
  useEffect(() => {
    try {
      const [year, month, day] = issueDate.split('-').map(Number);
      const [hours, minutes] = issueTime.split(':').map(Number);
      
      const issueDateTime = new Date(year, month - 1, day, hours || 0, minutes || 0);
      
      const totalMinutesToAdd =
        (Number(durationDays) || 0) * 24 * 60 +
        (Number(durationHours) || 0) * 60 +
        (Number(durationMinutes) || 0);

      const computedDue = new Date(issueDateTime.getTime() + totalMinutesToAdd * 60 * 1000);
      
      const dueYear = computedDue.getFullYear();
      const dueMonth = String(computedDue.getMonth() + 1).padStart(2, '0');
      const dueDay = String(computedDue.getDate()).padStart(2, '0');
      const dueHours = String(computedDue.getHours()).padStart(2, '0');
      const dueMins = String(computedDue.getMinutes()).padStart(2, '0');

      setDueDate(`${dueYear}-${dueMonth}-${dueDay}`);
      setDueTime(`${dueHours}:${dueMins}`);
    } catch {
      // fallback
    }
  }, [issueDate, issueTime, durationDays, durationHours, durationMinutes]);

  // Handle manual due date change
  const handleManualDueDateChange = (newDate: string) => {
    setDueDate(newDate);
    // update duration in days approximately
    try {
      const issueDT = new Date(`${issueDate}T${issueTime || '00:00'}`);
      const dueDT = new Date(`${newDate}T${dueTime || '00:00'}`);
      const diffMs = dueDT.getTime() - issueDT.getTime();
      if (diffMs > 0) {
        const totalMins = Math.floor(diffMs / (60 * 1000));
        const days = Math.floor(totalMins / (24 * 60));
        const hrs = Math.floor((totalMins % (24 * 60)) / 60);
        const mins = totalMins % 60;
        setDurationDays(days);
        setDurationHours(hrs);
        setDurationMinutes(mins);
      }
    } catch {
      // ignore
    }
  };

  const handleManualDueTimeChange = (newTime: string) => {
    setDueTime(newTime);
    try {
      const issueDT = new Date(`${issueDate}T${issueTime || '00:00'}`);
      const dueDT = new Date(`${dueDate}T${newTime || '00:00'}`);
      const diffMs = dueDT.getTime() - issueDT.getTime();
      if (diffMs > 0) {
        const totalMins = Math.floor(diffMs / (60 * 1000));
        const days = Math.floor(totalMins / (24 * 60));
        const hrs = Math.floor((totalMins % (24 * 60)) / 60);
        const mins = totalMins % 60;
        setDurationDays(days);
        setDurationHours(hrs);
        setDurationMinutes(mins);
      }
    } catch {
      // ignore
    }
  };

  // --- Purpose (Only One Box) ---
  const [purpose, setPurpose] = useState('');

  // --- Submission & Receipt State ---
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  // Available equipment list
  const availableEquipment = useMemo(() => {
    return equipment.filter((e) => e.status === 'available');
  }, [equipment]);

  // Filtered equipment by search query and lab filter
  const filteredEquipment = useMemo(() => {
    const q = equipmentSearchQuery.toLowerCase().trim();
    return availableEquipment.filter((item) => {
      const matchesLab =
        selectedLabFilter === 'ALL' || item.labId === selectedLabFilter;
      if (!matchesLab) return false;

      if (!q) return true;

      const tagMatch = item.assetTag?.toLowerCase().includes(q);
      const nameMatch = item.name?.toLowerCase().includes(q);
      const modelMatch = item.model?.toLowerCase().includes(q);
      const catMatch = item.category?.toLowerCase().includes(q);
      const serialMatch = item.serialNumber?.toLowerCase().includes(q);
      const locMatch =
        item.location.building?.toLowerCase().includes(q) ||
        item.location.room?.toLowerCase().includes(q) ||
        item.location.cabinet?.toLowerCase().includes(q);

      return tagMatch || nameMatch || modelMatch || catMatch || serialMatch || locMatch;
    });
  }, [availableEquipment, equipmentSearchQuery, selectedLabFilter]);

  const selectedEq = useMemo(() => {
    return equipment.find((e) => e.id === selectedEquipmentId);
  }, [equipment, selectedEquipmentId]);

  // Auto-match student when roll number is entered
  const matchedStudentFromList = useMemo(() => {
    if (!studentRollNo.trim()) return null;
    const cleanRoll = studentRollNo.trim().toLowerCase();
    return students.find(
      (s) => s.rollNumber.toLowerCase() === cleanRoll || s.rollNumber.toLowerCase().includes(cleanRoll)
    );
  }, [studentRollNo, students]);

  // Autofill student from existing records
  const handleSelectExistingStudent = (st: Student) => {
    setStudentRollNo(st.rollNumber);
    setStudentName(st.name);
    setStudentEmail(st.email);
    setStudentDept(st.department);
    setShowStudentPicker(false);
  };

  // Append university domain if not present
  const handleAppendUniversityDomain = () => {
    if (!studentEmail.includes('@')) {
      setStudentEmail(`${studentEmail.trim()}@bbsutsd.edu.pk`);
    } else {
      const userPart = studentEmail.split('@')[0];
      setStudentEmail(`${userPart}@bbsutsd.edu.pk`);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setStudentRollNo('');
    setStudentName('');
    setStudentEmail('');
    setStudentDept('');
    setSelectedEquipmentId('');
    setEquipmentSearchQuery('');
    setDurationDays(7);
    setDurationHours(0);
    setDurationMinutes(0);
    setIssueDate(getNowFormattedDate());
    setIssueTime(getNowFormattedTime());
    setPurpose('');
    setSubmittedData(null);
  };

  // Form submission
  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEq) return;
    if (!studentRollNo.trim() || !studentName.trim() || !studentEmail.trim()) return;

    const payload = {
      student: {
        id: matchedStudentFromList?.id || `stu-manual-${Date.now()}`,
        name: studentName.trim(),
        rollNumber: studentRollNo.trim(),
        email: studentEmail.trim(),
        department: studentDept.trim() || 'Engineering & Technology',
      },
      equipment: selectedEq,
      issueDate,
      issueTime,
      dueDate,
      dueTime,
      durationDays: Number(durationDays) || 0,
      durationHours: Number(durationHours) || 0,
      durationMinutes: Number(durationMinutes) || 0,
      purpose: purpose.trim() || 'Standard Academic Lab Loan',
      remarks: purpose.trim() || 'Standard Academic Lab Loan',
      voucherId: `BBSUTSD-ISS-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setSubmittedData(payload);
    onIssueSuccess?.(payload);
  };

  const isEmailValidDomain =
    studentEmail.toLowerCase().endsWith('@bbsutsd.edu.pk') ||
    studentEmail.toLowerCase().includes('.edu.pk');

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-[#f5efe8]">
      {/* Top Institutional Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#382320] bg-gradient-to-r from-[#1c1211] via-[#221514] to-[#170e0d] p-6 shadow-xl">
        <LightningFilament className="top-0 opacity-40" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="hidden sm:block">
              <UniversityLogo size="md" showText={false} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
                <ArrowUpRight className="h-4 w-4" />
                <span>Central Laboratory Directorate · Equipment Circulation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Issue Laboratory Equipment (Circulation Checkout)
              </h2>
              <p className="text-xs text-[#a39589] mt-0.5 max-w-2xl">
                Manually record student borrower data with university domain email, search and select available laboratory units, configure custom loan duration (days, hours, minutes), and state issuance purpose.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-[#3a2522] bg-[#140e0d]/90 px-3.5 py-2 text-right">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#9c8c7f]">Available Stock</div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {availableEquipment.length} <span className="text-xs text-[#9c8c7f] font-normal">units ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {submittedData ? (
        /* --- Official Loan Receipt / Voucher View --- */
        <div className="rounded-2xl border border-red-700/60 bg-gradient-to-b from-[#1c1211] to-[#130d0c] p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30201e] pb-5">
            <div className="flex items-center gap-3.5">
              <UniversityLogo size="md" showText={false} />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-red-400">Official Checkout Voucher</span>
                <h3 className="text-xl font-bold text-white tracking-tight">Equipment Issuance Receipt</h3>
                <p className="text-xs text-[#9c8c7f]">The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur</p>
              </div>
            </div>
            <div className="rounded-xl border border-red-800/80 bg-red-950/40 px-4 py-2 text-right">
              <div className="text-[10px] font-mono uppercase text-red-300">Voucher Serial</div>
              <div className="text-base font-mono font-bold text-white">{submittedData.voucherId}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Card */}
            <div className="rounded-xl border border-[#2e1d1b] bg-[#170f0e] p-4 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Borrower Identification
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-[#251816]">
                  <span className="text-[#8a796e]">Student Name:</span>
                  <span className="font-semibold text-white">{submittedData.student.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#251816]">
                  <span className="text-[#8a796e]">Roll Number:</span>
                  <span className="font-mono font-bold text-red-400">{submittedData.student.rollNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#251816]">
                  <span className="text-[#8a796e]">University Email:</span>
                  <span className="font-mono text-[#c4b5a8]">{submittedData.student.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8a796e]">Department:</span>
                  <span className="text-[#f5efe8]">{submittedData.student.department}</span>
                </div>
              </div>
            </div>

            {/* Equipment Card */}
            <div className="rounded-xl border border-[#2e1d1b] bg-[#170f0e] p-4 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Issued Asset Specification
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-[#251816]">
                  <span className="text-[#8a796e]">Asset Tag:</span>
                  <span className="font-mono font-bold text-red-400">{submittedData.equipment.assetTag}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#251816]">
                  <span className="text-[#8a796e]">Equipment Name:</span>
                  <span className="font-semibold text-white">{submittedData.equipment.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#251816]">
                  <span className="text-[#8a796e]">Model & Spec:</span>
                  <span className="text-[#c4b5a8]">{submittedData.equipment.model}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8a796e]">Assigned Lab:</span>
                  <span className="text-emerald-400 font-semibold">{submittedData.equipment.location?.building} · {submittedData.equipment.location?.room}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule & Duration Breakdown */}
          <div className="rounded-xl border border-[#2e1d1b] bg-[#170f0e] p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#8a796e] block text-[11px]">Issue Date & Time:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {submittedData.issueDate} at {submittedData.issueTime}
                </span>
              </div>
              <div>
                <span className="text-[#8a796e] block text-[11px]">Authorized Loan Duration:</span>
                <span className="font-mono font-bold text-red-300 text-sm">
                  {submittedData.durationDays}d {submittedData.durationHours}h {submittedData.durationMinutes}m
                </span>
              </div>
              <div>
                <span className="text-[#8a796e] block text-[11px]">Return Due Date & Time:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {submittedData.dueDate} at {submittedData.dueTime}
                </span>
              </div>
            </div>
          </div>

          {/* Purpose Box in Voucher */}
          <div className="rounded-xl border border-[#2e1d1b] bg-[#170f0e] p-4 space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a39589] flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-red-400" />
              Recorded Issuance Purpose
            </span>
            <p className="text-xs text-[#f5efe8] bg-[#120b0a] p-3 rounded-lg border border-[#251816] font-medium leading-relaxed">
              {submittedData.purpose}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#3a2522] bg-[#1c1312] px-5 py-2.5 text-xs font-semibold text-[#f5efe8] hover:bg-[#251917] transition"
            >
              <Printer className="h-4 w-4 text-red-400" />
              <span>Print Loan Slip</span>
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-6 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] transition"
            >
              <RotateCcw className="h-4 w-4 text-red-300" />
              <span>Issue Another Equipment</span>
            </button>
          </div>
        </div>
      ) : (
        /* --- Main Issue Form --- */
        <form onSubmit={handleIssueSubmit} className="space-y-6">
          {/* SECTION 1: Manually Enter Borrower Data (Roll No, Name, University Domain Email) */}
          <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#281816] pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  1. Borrower Details (Manual Data Entry)
                </span>
                <p className="text-[11px] text-[#8a796e] mt-0.5">
                  Manually enter student roll number, full name, and official university domain email (@bbsutsd.edu.pk).
                </p>
              </div>

              {/* Fast Picker Toggle for convenience */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStudentPicker(!showStudentPicker)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#3a2522] bg-[#1c1312] px-3 py-1.5 text-[11px] font-medium text-[#c4b5a8] hover:text-white hover:border-red-800 transition"
                >
                  <Sparkles className="h-3 w-3 text-red-400" />
                  <span>Autofill from Registered Students</span>
                  <ChevronDown className="h-3 w-3 text-[#7d6c60]" />
                </button>

                {showStudentPicker && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-[#3a2522] bg-[#1c1211] p-2 shadow-2xl z-30 space-y-1">
                    <div className="text-[10px] font-semibold text-[#8a796e] uppercase px-2 py-1">
                      Registered BBSUTSD Students:
                    </div>
                    <div className="max-h-52 overflow-y-auto space-y-1">
                      {students.map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleSelectExistingStudent(st)}
                          className="w-full text-left rounded-lg p-2 text-xs hover:bg-[#281816] transition flex flex-col"
                        >
                          <span className="font-semibold text-white">{st.name}</span>
                          <span className="font-mono text-[10px] text-red-400">{st.rollNumber} · {st.department}</span>
                          <span className="text-[10px] text-[#8a796e]">{st.email}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Data Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Roll Number */}
              <div>
                <label className="block text-xs font-medium text-[#b8a89b] mb-1.5">
                  Roll Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={studentRollNo}
                    onChange={(e) => setStudentRollNo(e.target.value)}
                    placeholder="e.g. 21CS042 or 22EET105"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3.5 py-2.5 text-xs font-mono font-semibold text-[#f5efe8] placeholder:text-[#6a5b51] focus:border-red-600 focus:outline-none transition uppercase"
                  />
                  <Tag className="absolute right-3 top-3 h-3.5 w-3.5 text-[#6a5b51]" />
                </div>
                {matchedStudentFromList && (
                  <div className="mt-1 flex items-center justify-between text-[11px] text-emerald-400">
                    <span>Matched: {matchedStudentFromList.name}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectExistingStudent(matchedStudentFromList)}
                      className="underline text-red-400 hover:text-red-300 ml-1 font-semibold"
                    >
                      Autofill all
                    </button>
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-[#b8a89b] mb-1.5">
                  Student Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Zubair Ahmed Shaikh"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3.5 py-2.5 text-xs text-[#f5efe8] placeholder:text-[#6a5b51] focus:border-red-600 focus:outline-none transition"
                  />
                  <User className="absolute right-3 top-3 h-3.5 w-3.5 text-[#6a5b51]" />
                </div>
              </div>

              {/* University Domain Email */}
              <div>
                <label className="block text-xs font-medium text-[#b8a89b] mb-1.5 flex items-center justify-between">
                  <span>University Domain Email <span className="text-red-400">*</span></span>
                  <button
                    type="button"
                    onClick={handleAppendUniversityDomain}
                    className="text-[10px] font-mono text-red-400 hover:text-red-300 hover:underline"
                    title="Append @bbsutsd.edu.pk domain"
                  >
                    + @bbsutsd.edu.pk
                  </button>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="e.g. zubair.ahmed@bbsutsd.edu.pk"
                    className={`w-full rounded-xl border bg-[#1c1312] px-3.5 py-2.5 text-xs text-[#f5efe8] placeholder:text-[#6a5b51] focus:outline-none transition ${
                      studentEmail && !isEmailValidDomain
                        ? 'border-amber-600/70 focus:border-amber-500'
                        : 'border-[#382320] focus:border-red-600'
                    }`}
                  />
                  <Mail className="absolute right-3 top-3 h-3.5 w-3.5 text-[#6a5b51]" />
                </div>
                {studentEmail && !isEmailValidDomain && (
                  <p className="mt-1 text-[10px] text-amber-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Please enter official university domain email (@bbsutsd.edu.pk).
                  </p>
                )}
              </div>
            </div>

            {/* Optional Department selection */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-[#7d6c60]">Quick Department:</span>
              {[
                'Electrical & Electronics (EET)',
                'Computer Systems (CSE)',
                'Mechanical (MET)',
                'Civil Engineering (CET)',
                'Petroleum Technology',
              ].map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setStudentDept(dept)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                    studentDept === dept
                      ? 'bg-red-950 border border-red-700 text-white'
                      : 'bg-[#1c1312] border border-[#2e1d1b] text-[#9c8c7f] hover:text-white'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: Search What You Want to Issue */}
          <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#281816] pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <Search className="h-4 w-4" />
                  2. Search What You Want to Issue
                </span>
                <p className="text-[11px] text-[#8a796e] mt-0.5">
                  Search equipment catalog by Asset Tag, Name, Model number, or Laboratory room.
                </p>
              </div>

              {/* Lab Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#7d6c60]">Lab Filter:</span>
                <select
                  value={selectedLabFilter}
                  onChange={(e) => setSelectedLabFilter(e.target.value)}
                  className="rounded-lg border border-[#382320] bg-[#1c1312] px-2.5 py-1 text-xs text-[#c4b5a8] focus:border-red-600 focus:outline-none"
                >
                  <option value="ALL">All Laboratories</option>
                  {laboratories.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name} ({lab.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Search Input Box */}
            <div className="relative">
              <input
                type="text"
                value={equipmentSearchQuery}
                onChange={(e) => setEquipmentSearchQuery(e.target.value)}
                placeholder="Search equipment: Type Asset Tag (e.g. BBSUTSD-EET-1044), Name (Oscilloscope, Multimeter, Lathe), Model, or Room..."
                className="w-full rounded-xl border border-[#382320] bg-[#1c1312] pl-10 pr-10 py-3 text-xs text-[#f5efe8] placeholder:text-[#6a5b51] focus:border-red-600 focus:outline-none transition shadow-inner"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#8a796e]" />
              {equipmentSearchQuery && (
                <button
                  type="button"
                  onClick={() => setEquipmentSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-[#8a796e] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Currently Selected Equipment Card (If Chosen) */}
            {selectedEq && (
              <div className="rounded-xl border border-red-700/70 bg-gradient-to-r from-[#221312] to-[#180e0d] p-4 shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-900/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-red-950 border border-red-700 px-2 py-0.5 font-mono text-xs font-bold text-red-300">
                      {selectedEq.assetTag}
                    </span>
                    <h4 className="font-bold text-sm text-white">{selectedEq.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-950 border border-emerald-700/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 capitalize">
                      {selectedEq.condition} Condition
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedEquipmentId('')}
                      className="rounded-lg border border-[#3a2522] bg-[#140e0d] px-2.5 py-1 text-[11px] text-[#9c8c7f] hover:text-white hover:border-red-800 transition"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[#8a796e] block text-[10px]">Model & Specs:</span>
                    <span className="text-[#e6dcce] font-medium">{selectedEq.model}</span>
                  </div>
                  <div>
                    <span className="text-[#8a796e] block text-[10px]">Serial Number:</span>
                    <span className="font-mono text-[#c4b5a8]">{selectedEq.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#8a796e] block text-[10px]">Lab Location:</span>
                    <span className="text-[#e6dcce] font-medium">{selectedEq.location?.room || 'Main Hall'}</span>
                  </div>
                  <div>
                    <span className="text-[#8a796e] block text-[10px]">Storage Cabinet / Shelf:</span>
                    <span className="text-red-300 font-medium">{selectedEq.location?.cabinet || 'Main Bay'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#8a796e]">
                <span>
                  Found <span className="text-white font-semibold font-mono">{filteredEquipment.length}</span> available items
                </span>
                {selectedEquipmentId && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" /> 1 item selected
                  </span>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredEquipment.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#382320] p-6 text-center text-xs text-[#7d6c60]">
                    No available equipment found matching "{equipmentSearchQuery}". Try another keyword or lab filter.
                  </div>
                ) : (
                  filteredEquipment.map((eq) => {
                    const isSelected = selectedEquipmentId === eq.id;
                    return (
                      <div
                        key={eq.id}
                        onClick={() => setSelectedEquipmentId(eq.id)}
                        className={`cursor-pointer rounded-xl border p-3 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-red-600 bg-[#251514] shadow-[0_0_15px_rgba(220,38,38,0.25)]'
                            : 'border-[#2d1e1c] bg-[#191110] hover:border-red-900/60 hover:bg-[#1e1413]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-900/60">
                              {eq.assetTag}
                            </span>
                            <span className="font-semibold text-xs text-white">{eq.name}</span>
                            <span className="text-[10px] text-[#8a796e]">({eq.model})</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#a39589]">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-[#7d6c60]" />
                              {eq.location?.room || 'Main Lab'} · {eq.location?.cabinet || 'Bay A'}
                            </span>
                            <span className="text-[#6a5b51]">|</span>
                            <span>Category: {eq.category}</span>
                            <span className="text-[#6a5b51]">|</span>
                            <span className="capitalize text-emerald-400">{eq.condition}</span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEquipmentId(eq.id);
                            }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                              isSelected
                                ? 'bg-red-700 text-white font-semibold'
                                : 'bg-[#221615] border border-[#3a2522] text-[#c4b5a8] hover:text-white hover:border-red-800'
                            }`}
                          >
                            {isSelected ? '✓ Selected' : 'Select Asset'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Days, Hours, Minutes & Manually Enter Date and Time */}
          <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 sm:p-6 space-y-5 shadow-xl">
            <div className="border-b border-[#281816] pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                3. Loan Duration & Manual Date / Time Scheduling
              </span>
              <p className="text-[11px] text-[#8a796e] mt-0.5">
                Manually enter issue timestamp, specify custom duration breakdown in days, hours, and minutes, or manually enter return due date and time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 3A: Issue Date & Time (Manual Entry) */}
              <div className="space-y-3 rounded-xl border border-[#2d1e1c] bg-[#191110] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-red-400" />
                    Issue Date & Time (Start)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIssueDate(getNowFormattedDate());
                      setIssueTime(getNowFormattedTime());
                    }}
                    className="text-[10px] text-red-400 hover:text-red-300 font-mono hover:underline"
                  >
                    Reset to Now
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-[#8a796e] mb-1">Issue Date</label>
                    <input
                      type="date"
                      required
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full rounded-lg border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs font-mono text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#8a796e] mb-1">Issue Time</label>
                    <input
                      type="time"
                      required
                      value={issueTime}
                      onChange={(e) => setIssueTime(e.target.value)}
                      className="w-full rounded-lg border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs font-mono text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3B: Duration Breakdown (Days, Hours, Minutes Manual Entry) */}
              <div className="space-y-3 rounded-xl border border-[#2d1e1c] bg-[#191110] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-red-400" />
                    Loan Duration Breakdown
                  </span>
                  <span className="text-[10px] text-[#8a796e] font-mono">Custom Span</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Days */}
                  <div>
                    <label className="block text-[11px] text-[#8a796e] mb-1">Days</label>
                    <input
                      type="number"
                      min="0"
                      max="180"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-lg border border-[#382320] bg-[#1c1312] px-2 py-2 text-center text-xs font-mono font-bold text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  {/* Hours */}
                  <div>
                    <label className="block text-[11px] text-[#8a796e] mb-1">Hours</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={durationHours}
                      onChange={(e) => setDurationHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-lg border border-[#382320] bg-[#1c1312] px-2 py-2 text-center text-xs font-mono font-bold text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  {/* Minutes */}
                  <div>
                    <label className="block text-[11px] text-[#8a796e] mb-1">Minutes</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-lg border border-[#382320] bg-[#1c1312] px-2 py-2 text-center text-xs font-mono font-bold text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick Presets for convenience */}
                <div className="pt-1">
                  <div className="text-[10px] text-[#7d6c60] mb-1.5">Quick Duration Presets:</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: '2 Hours', d: 0, h: 2, m: 0 },
                      { label: '4 Hours', d: 0, h: 4, m: 0 },
                      { label: '1 Day', d: 1, h: 0, m: 0 },
                      { label: '3 Days', d: 3, h: 0, m: 0 },
                      { label: '7 Days', d: 7, h: 0, m: 0 },
                      { label: '14 Days', d: 14, h: 0, m: 0 },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setDurationDays(p.d);
                          setDurationHours(p.h);
                          setDurationMinutes(p.m);
                        }}
                        className={`rounded px-1.5 py-1 text-[10px] font-medium border transition ${
                          durationDays === p.d && durationHours === p.h && durationMinutes === p.m
                            ? 'border-red-700 bg-red-950 text-white'
                            : 'border-[#30201e] bg-[#150f0e] text-[#9c8c7f] hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3C: Return Due Date & Time (Manual Entry or Auto-Computed) */}
              <div className="space-y-3 rounded-xl border border-[#2d1e1c] bg-[#191110] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                    Return Due Date & Time
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Calculated / Editable</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-[#8a796e] mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => handleManualDueDateChange(e.target.value)}
                      className="w-full rounded-lg border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs font-mono text-emerald-400 font-bold focus:border-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#8a796e] mb-1">Due Time</label>
                    <input
                      type="time"
                      required
                      value={dueTime}
                      onChange={(e) => handleManualDueTimeChange(e.target.value)}
                      className="w-full rounded-lg border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs font-mono text-emerald-400 font-bold focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Computed Schedule Bar */}
            <div className="rounded-xl border border-[#30201e] bg-[#130b0a] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#8a796e]">Total Loan Duration:</span>
                <span className="font-mono font-bold text-red-300">
                  {durationDays} Day{durationDays !== 1 ? 's' : ''}, {durationHours} Hour{durationHours !== 1 ? 's' : ''}, {durationMinutes} Minute{durationMinutes !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8a796e]">Scheduled Due:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {dueDate || '---'} at {dueTime || '--:--'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Purpose (Only One Box) */}
          <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 sm:p-6 space-y-3 shadow-xl">
            <div className="border-b border-[#281816] pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                4. Purpose of Issuance (Single Box)
              </span>
              <p className="text-[11px] text-[#8a796e] mt-0.5">
                Enter the exact purpose for issuing this equipment in the single dedicated box below.
              </p>
            </div>

            {/* ONLY ONE BOX */}
            <div>
              <label className="block text-xs font-medium text-[#b8a89b] mb-1.5">
                Purpose / Reason for Issuance <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="What is the purpose of issuing this equipment? (e.g. Senior Capstone Project - Hardware Prototype Testing under Dr. Abdul Qadir Memon, Practical Lab 5 Circuit Analysis, Thesis Data Collection)..."
                className="w-full rounded-xl border border-[#382320] bg-[#1c1312] p-3 text-xs text-[#f5efe8] placeholder:text-[#6a5b51] focus:border-red-600 focus:outline-none transition resize-none leading-relaxed"
              />
            </div>

            {/* Quick 1-click Purpose Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-[#7d6c60]">Quick Fill Suggestions:</span>
              {[
                'Final Year Capstone Project (FYP) Laboratory Testing',
                'Course Practical Lab Analysis & Experimentation',
                'Master Thesis Research & Experimental Setup',
                'Robotics & Embedded Systems Hardware Workshop',
                'Faculty-Approved Technical Competition Prototype',
              ].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setPurpose(sug)}
                  className="rounded-lg border border-[#30201e] bg-[#170f0e] px-2.5 py-1 text-[11px] text-[#9c8c7f] hover:text-white hover:border-red-900 transition"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Submission Bar */}
          <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="text-xs text-[#8a796e]">
              {!selectedEq ? (
                <span className="text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  Please search and select an equipment item above.
                </span>
              ) : !studentRollNo || !studentName || !studentEmail ? (
                <span className="text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  Please complete student Roll No, Name, and Email.
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Ready to issue <strong className="text-white font-mono">{selectedEq.assetTag}</strong> to <strong className="text-white">{studentName}</strong> ({studentRollNo}).
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-1/2 sm:w-auto rounded-xl border border-[#382320] bg-[#1c1312] px-4 py-2.5 text-xs font-semibold text-[#a39589] hover:text-white hover:bg-[#251917] transition"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={!selectedEq || !studentRollNo.trim() || !studentName.trim() || !studentEmail.trim()}
                className="w-1/2 sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-6 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <CheckCircle2 className="h-4 w-4 text-red-300" />
                <span>Confirm & Issue Equipment</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
