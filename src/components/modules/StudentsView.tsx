import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  ShieldCheck,
  ShieldAlert,
  QrCode,
  X,
  User,
  Mail,
  Building2,
  Phone,
} from 'lucide-react';
import { Student } from '../../types';
import { UniversityLogo } from '../common/UniversityLogo';

interface StudentsViewProps {
  students: Student[];
  onAddStudent?: (student: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ students, onAddStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // New Student Form State
  const [newRollNo, setNewRollNo] = useState('');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('Department of Electrical Engineering Technology');
  const [newSemester, setNewSemester] = useState('5th Semester');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRollNo.trim() || !newName.trim()) return;

    const studentId = `usr-stud-${Date.now()}`;
    const cleanRoll = newRollNo.trim().toUpperCase();
    const cleanEmail = newEmail.trim() || `${cleanRoll.toLowerCase()}@student.bbsutsd.edu.pk`;

    const createdStudent: Student = {
      id: studentId,
      rollNumber: cleanRoll,
      name: newName.trim(),
      email: cleanEmail,
      department: newDept,
      semester: newSemester,
      phone: newPhone.trim() || '+92 300 0000000',
      activeIssuesCount: 0,
      hasOverdue: false,
      clearanceStatus: 'cleared',
      qrCode: `STUD-${cleanRoll}`,
    };

    onAddStudent?.(createdStudent);
    setShowEnrollModal(false);

    // Reset form
    setNewRollNo('');
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  return (
    <div className="space-y-6 text-[#f5efe8]">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-red-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student by roll number, name, or department..."
            className="w-full rounded-xl border border-[#36221f] bg-[#160f0e] py-2 pl-9 pr-4 text-xs text-[#f5efe8] placeholder:text-[#7d6c60] focus:border-red-600 focus:outline-none transition"
          />
        </div>

        <button
          onClick={() => setShowEnrollModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] hover:-translate-y-0.5 transition-all"
        >
          <Plus className="h-4 w-4 text-red-300" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Students Table */}
      <div className="rounded-2xl border border-[#2e1d1b] bg-[#160f0e] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#191110] text-[11px] font-semibold uppercase text-[#8a796e] border-b border-[#241715]">
              <tr>
                <th className="px-5 py-3">Roll Number & QR</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Department & Semester</th>
                <th className="px-4 py-3">Contact Email</th>
                <th className="px-4 py-3 text-center">Active Loans</th>
                <th className="px-4 py-3">Clearance Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#231614]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d1211] border border-[#382320] text-red-400">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-white">No Student Records Found</p>
                      <p className="text-xs text-[#8a796e] max-w-sm">
                        {students.length === 0
                          ? 'No student borrowers are currently enrolled. Enroll a student to allow equipment loans.'
                          : 'No students matched your search query.'}
                      </p>
                      {students.length === 0 && (
                        <button
                          onClick={() => setShowEnrollModal(true)}
                          className="mt-2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition"
                        >
                          <Plus className="h-3.5 w-3.5 text-red-300" />
                          <span>Enroll First Student</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((st) => (
                  <tr key={st.id} className="hover:bg-[#201514] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedStudent(st)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#382320] bg-[#1c1312] text-red-400 hover:border-red-900/60 hover:text-red-300 transition"
                          title="View Digital QR Pass"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                        <span className="font-mono text-xs font-bold text-red-400">
                          {st.rollNumber}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-white">{st.name}</td>

                    <td className="px-4 py-3.5 text-[#a39589]">
                      <div>{st.department}</div>
                      <div className="text-[11px] text-[#7d6c60]">{st.semester}</div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px] text-[#8a796e]">
                      {st.email}
                    </td>

                    <td className="px-4 py-3.5 text-center font-bold tabular-nums text-white font-mono">
                      {st.activeIssuesCount}
                    </td>

                    <td className="px-4 py-3.5">
                      {st.clearanceStatus === 'cleared' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                          <ShieldCheck className="h-3 w-3" />
                          Cleared
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
                          <ShieldAlert className="h-3 w-3" />
                          Hold Active
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="text-xs font-semibold text-red-400 hover:text-red-300 transition"
                      >
                        View ID Pass
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll New Student Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowEnrollModal(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-[#382320] bg-[#160f0e] p-6 shadow-2xl text-[#f5efe8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#281816]">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-red-400" />
                <h3 className="text-base font-bold text-white">Enroll New Student Borrower</h3>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-[#7d6c60] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">
                    University Roll Number *
                  </label>
                  <input
                    required
                    value={newRollNo}
                    onChange={(e) => setNewRollNo(e.target.value)}
                    placeholder="e.g. 23BBSUTSD-EET-012"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">
                    Student Full Name *
                  </label>
                  <input
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Ali Raza"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#b8a89b] font-medium mb-1">Academic Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                >
                  <option value="Department of Electrical Engineering Technology">
                    Department of Electrical Engineering Technology
                  </option>
                  <option value="Department of Electronics Engineering Technology">
                    Department of Electronics Engineering Technology
                  </option>
                  <option value="Department of Mechanical Engineering Technology">
                    Department of Mechanical Engineering Technology
                  </option>
                  <option value="Department of Civil Engineering Technology">
                    Department of Civil Engineering Technology
                  </option>
                  <option value="Department of Computer Science & IT">
                    Department of Computer Science &amp; IT
                  </option>
                  <option value="Department of Petroleum & Chemical Technology">
                    Department of Petroleum &amp; Chemical Technology
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Current Semester</label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Phone Number</label>
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#b8a89b] font-medium mb-1">
                  Institutional Email (Optional)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="rollno@student.bbsutsd.edu.pk"
                  className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                />
              </div>

              <div className="pt-3 border-t border-[#241715] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="rounded-xl border border-[#382320] bg-[#1c1312] px-3.5 py-2 text-xs font-semibold text-stone-300 hover:bg-[#251917] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] transition"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Identification Pass Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedStudent(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-[#382320] bg-[#160f0e] p-6 shadow-2xl text-center text-[#f5efe8]">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-4 top-4 text-[#7d6c60] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex justify-center mb-2">
              <UniversityLogo size="sm" showText={false} />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
              BBSUTSD Student Laboratory Pass
            </span>
            <p className="text-[10px] text-[#8a796e] mt-0.5">
              The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur
            </p>
            <h3 className="text-base font-bold text-white mt-1.5">{selectedStudent.name}</h3>
            <p className="font-mono text-sm font-bold text-red-400 mt-0.5">{selectedStudent.rollNumber}</p>

            <div className="my-5 flex justify-center">
              <div className="flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-red-900/60 bg-white p-3 shadow-2xl">
                <QrCode className="h-36 w-36 text-black" />
              </div>
            </div>

            <div className="text-xs text-[#9e8d80] space-y-1">
              <p>{selectedStudent.department}</p>
              <p>{selectedStudent.semester} · {selectedStudent.email}</p>
              <p className="font-mono text-[11px] text-[#7d6c60]">ID: {selectedStudent.qrCode}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#241715] flex gap-2">
              <button
                onClick={() => setSelectedStudent(null)}
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
