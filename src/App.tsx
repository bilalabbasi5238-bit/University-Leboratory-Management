/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
} from 'lucide-react';
import {
  User,
  UserRole,
  ActiveNavModule,
  Laboratory,
  Equipment,
  IssueRecord,
  Student,
  NotificationItem,
} from './types';
import {
  mockUsers,
  mockLaboratories,
  mockEquipment,
  mockIssueRecords,
  mockStudents,
  mockLabAssistants,
  mockMaintenanceRecords,
  mockActivityLogs,
  mockAuditLogs,
  mockNotifications,
} from './mock/data';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { LoginPage } from './components/auth/LoginPage';
import { AccessDenied } from './components/common/AccessDenied';
import { BackgroundEnergyField } from './components/common/LightningEffect';
import { UniversityLogo } from './components/common/UniversityLogo';

import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { LabAssistantDashboard } from './components/dashboard/LabAssistantDashboard';

import { LaboratoriesView } from './components/modules/LaboratoriesView';
import { EquipmentView } from './components/modules/EquipmentView';
import { InventoryView } from './components/modules/InventoryView';
import { StudentsView } from './components/modules/StudentsView';
import { LabAssistantsView } from './components/modules/LabAssistantsView';
import { IssueEquipmentView } from './components/modules/IssueEquipmentView';
import { ReturnEquipmentView } from './components/modules/ReturnEquipmentView';
import { OverdueItemsView } from './components/modules/OverdueItemsView';
import { MaintenanceView } from './components/modules/MaintenanceView';
import { ReportsView } from './components/modules/ReportsView';
import { ActivityLogsView } from './components/modules/ActivityLogsView';
import { AuditLogsView } from './components/modules/AuditLogsView';
import { NotificationsView } from './components/modules/NotificationsView';
import { SettingsView } from './components/modules/SettingsView';

import {
  saveIssueRecordToFirestore,
  recordReturnInFirestore,
  logActivityToFirestore,
  subscribeToEquipment,
  subscribeToIssueRecords,
  subscribeToLaboratories,
  subscribeToStudents,
  saveLaboratoryToFirestore,
  deleteLaboratoryFromFirestore,
  saveEquipmentToFirestore,
  saveStudentToFirestore,
  seedFirestoreIfEmpty,
} from './firebase/firestoreService';
import { testFirebaseConnection, FIREBASE_PROJECT_ALIAS } from './firebase/config';

export default function App() {
  // Login page is the main entry point of the application
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('HOD_ADMIN');
  const [activeModule, setActiveModule] = useState<ActiveNavModule>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Application Data States
  const [laboratories, setLaboratories] = useState<Laboratory[]>(mockLaboratories);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(mockEquipment);
  const [issueRecords, setIssueRecords] = useState<IssueRecord[]>(mockIssueRecords);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [activityLogs, setActivityLogs] = useState(mockActivityLogs);

  // Inspector Selection states
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // Modal dialog states for adding records
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);

  // Form states for Add Laboratory
  const [newLabName, setNewLabName] = useState('');
  const [newLabCode, setNewLabCode] = useState('');
  const [newLabDept, setNewLabDept] = useState('Department of Electrical & Electronics Engineering Technology');
  const [newLabBuilding, setNewLabBuilding] = useState('Engineering Technology Complex');
  const [newLabFloor, setNewLabFloor] = useState('Floor 1');
  const [newLabRoom, setNewLabRoom] = useState('');
  const [newLabCapacity, setNewLabCapacity] = useState(30);
  const [newLabExt, setNewLabExt] = useState('Ext. 1000');

  // Dedicated Assistant Login Credentials for this new facility
  const [newLabAssistantName, setNewLabAssistantName] = useState('');
  const [newLabAssistantEmail, setNewLabAssistantEmail] = useState('');
  const [newLabAssistantPassword, setNewLabAssistantPassword] = useState('');
  const [newLabAssistantPhone, setNewLabAssistantPhone] = useState('');
  const [showNewAssistantPassword, setShowNewAssistantPassword] = useState(false);

  // Form states for Add Equipment
  const [newEqName, setNewEqName] = useState('');
  const [newEqAssetTag, setNewEqAssetTag] = useState('');
  const [newEqSerial, setNewEqSerial] = useState('');
  const [newEqCategory, setNewEqCategory] = useState('Electronic Test & Measurement');
  const [newEqModel, setNewEqModel] = useState('');
  const [newEqManufacturer, setNewEqManufacturer] = useState('');
  const [newEqLabId, setNewEqLabId] = useState('');
  const [newEqCabinet, setNewEqCabinet] = useState('Cabinet C-01');
  const [newEqShelf, setNewEqShelf] = useState('Shelf S-01');

  // Firebase connection state
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);

  // Custom logged-in user profile (for newly created lab assistants)
  const [customLoggedInUser, setCustomLoggedInUser] = useState<User | null>(null);

  // Initialize and synchronize with Firebase Firestore
  useEffect(() => {
    let isMounted = true;

    testFirebaseConnection()
      .then((res) => {
        if (isMounted && res.success) {
          setIsFirebaseLive(true);
          // Seed initial data if database is fresh
          seedFirestoreIfEmpty().catch(() => {});
        }
      })
      .catch(() => {});

    // Real-time synchronization listeners
    const unsubLabs = subscribeToLaboratories((labs) => {
      if (isMounted && labs && labs.length > 0) {
        setLaboratories(labs);
      }
    });

    const unsubStuds = subscribeToStudents((studs) => {
      if (isMounted && studs) {
        setStudents(studs);
      }
    });

    const unsubEquipment = subscribeToEquipment((items) => {
      if (isMounted && items) {
        setEquipmentList(items);
      }
    });

    const unsubIssues = subscribeToIssueRecords((records) => {
      if (isMounted && records) {
        setIssueRecords(records);
      }
    });

    return () => {
      isMounted = false;
      unsubLabs();
      unsubStuds();
      unsubEquipment();
      unsubIssues();
    };
  }, []);

  // Current active user object (strictly HOD_ADMIN or custom/default LAB_ASSISTANT)
  const currentUser: User =
    customLoggedInUser
      ? customLoggedInUser
      : currentUserRole === 'HOD_ADMIN'
      ? mockUsers.admin
      : mockUsers.lab_assistant;

  // Compute all lab assistants dynamically including new laboratory in-charges
  const allLabAssistants = useMemo(() => {
    const dynamicAssistants = laboratories
      .filter((lab) => Boolean(lab.assistantEmail))
      .map((lab) => ({
        id: lab.assignedAssistantId || `ast-${lab.id}`,
        staffId:
          lab.assistantStaffId ||
          `BBSUTSD-STF-${lab.code.replace(/[^A-Z0-9]/g, '').slice(0, 6)}`,
        name: lab.assistantName || lab.assignedAssistantName || 'Lab Assistant',
        email: lab.assistantEmail!,
        department: lab.department,
        phone: lab.assistantPhone || lab.contactExtension || '+92 300 0000000',
        assignedLabs: [
          {
            id: lab.id,
            name: lab.name,
            code: lab.code,
          },
        ],
        activeSupervisionCount: lab.activeIssuesCount || 0,
      }));
    return [...mockLabAssistants, ...dynamicAssistants];
  }, [laboratories]);

  // Add Laboratory Submit Handler
  const handleAddLaboratorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabName.trim() || !newLabCode.trim()) return;

    const assistantName = newLabAssistantName.trim() || 'Assigned Lab Assistant';
    const assistantEmail = newLabAssistantEmail.trim().toLowerCase();
    const assistantPassword = newLabAssistantPassword.trim();
    const assistantStaffId = `BBSUTSD-STF-${Math.floor(1000 + Math.random() * 9000)}`;
    const assistantPhone = newLabAssistantPhone.trim() || '+92 300 1234567';

    const newLab: Laboratory = {
      id: `lab-${Date.now()}`,
      code: newLabCode.trim().toUpperCase(),
      name: newLabName.trim(),
      department: newLabDept,
      building: newLabBuilding.trim(),
      floor: newLabFloor.trim(),
      roomNumber: newLabRoom.trim() || 'Room 101',
      capacity: Number(newLabCapacity) || 30,
      assignedAssistantId: `usr-asst-${Date.now()}`,
      assignedAssistantName: assistantName,
      assistantName: assistantName,
      assistantEmail: assistantEmail || undefined,
      assistantPassword: assistantPassword || undefined,
      assistantStaffId: assistantStaffId,
      assistantPhone: assistantPhone,
      status: 'active',
      totalEquipmentCount: 0,
      activeIssuesCount: 0,
      contactExtension: newLabExt.trim() || 'Ext. 1000',
    };

    setLaboratories((prev) => [...prev, newLab]);
    saveLaboratoryToFirestore(newLab).catch(() => {});

    const logEntry = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Facility Registered' as const,
      target: `${newLab.code} (${newLab.name})`,
      details: `Registered facility in ${newLab.building}. Assistant: ${assistantName}${assistantEmail ? ` (${assistantEmail})` : ''}`,
      type: 'system' as const,
    };
    setActivityLogs((prev) => [logEntry, ...prev]);
    logActivityToFirestore(logEntry).catch(() => {});

    // Add alert notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Facility & Assistant Account Created',
      message: `${newLab.name} registered. ${assistantEmail ? `Login ready for assistant ${assistantEmail}.` : ''}`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    setShowAddLabModal(false);
    setNewLabName('');
    setNewLabCode('');
    setNewLabRoom('');
    setNewLabAssistantName('');
    setNewLabAssistantEmail('');
    setNewLabAssistantPassword('');
    setNewLabAssistantPhone('');
  };

  // Delete Laboratory Handler for HOD Portal
  const handleDeleteLaboratory = (labId: string) => {
    const labToDelete = laboratories.find((l) => l.id === labId);

    // 1. Remove from local React state
    setLaboratories((prev) => prev.filter((l) => l.id !== labId));
    if (selectedLab?.id === labId) {
      setSelectedLab(null);
    }

    // 2. Remove from Firebase Firestore
    deleteLaboratoryFromFirestore(labId).catch(() => {});

    // 3. Unassign any equipment assigned to this lab
    setEquipmentList((prev) =>
      prev.map((e) => (e.labId === labId ? { ...e, labId: '' } : e))
    );

    // 4. Log in Institutional Activity Stream
    const logEntry = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Facility Deleted' as const,
      target: labToDelete ? `${labToDelete.code} (${labToDelete.name})` : labId,
      details: `Facility record and associated credentials permanently removed by HOD.`,
      type: 'system' as const,
    };
    setActivityLogs((prev) => [logEntry, ...prev]);
    logActivityToFirestore(logEntry).catch(() => {});

    // 5. System Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Facility Record Deleted',
      message: `${labToDelete?.name || 'Laboratory'} (${labToDelete?.code || 'Code'}) was deleted by HOD.`,
      type: 'warning',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Add Equipment Submit Handler
  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName.trim() || !newEqAssetTag.trim()) return;

    const chosenLab = laboratories.find((l) => l.id === newEqLabId) || laboratories[0];
    const newEq: Equipment = {
      id: `eq-${Date.now()}`,
      assetTag: newEqAssetTag.trim().toUpperCase(),
      serialNumber: newEqSerial.trim() || `SN-${Date.now()}`,
      name: newEqName.trim(),
      category: newEqCategory,
      model: newEqModel.trim() || 'Standard Model',
      manufacturer: newEqManufacturer.trim() || 'BBSUTSD Standard Equipment',
      labId: chosenLab ? chosenLab.id : 'lab-01',
      location: {
        building: chosenLab ? chosenLab.building : 'Engineering Technology Complex',
        floor: chosenLab ? chosenLab.floor : 'Floor 1',
        labId: chosenLab ? chosenLab.code : 'LAB-EET-204',
        cabinet: newEqCabinet.trim() || 'Cabinet C-01',
        shelf: newEqShelf.trim() || 'Shelf S-01',
      },
      status: 'available',
      condition: 'good',
      purchaseDate: new Date().toISOString().split('T')[0],
      qrCode: `QR-${newEqAssetTag.trim().toUpperCase()}`,
      specifications: {},
    };

    setEquipmentList((prev) => [newEq, ...prev]);
    saveEquipmentToFirestore(newEq).catch(() => {});

    const logEntry = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Equipment Registered' as const,
      target: `${newEq.assetTag} (${newEq.name})`,
      details: `Cataloged in ${chosenLab ? chosenLab.code : 'Laboratory'} · ${newEq.location.cabinet}`,
      type: 'maintenance' as const,
    };
    setActivityLogs((prev) => [logEntry, ...prev]);
    logActivityToFirestore(logEntry).catch(() => {});

    setShowAddEquipmentModal(false);
    setNewEqName('');
    setNewEqAssetTag('');
    setNewEqSerial('');
    setNewEqModel('');
    setNewEqManufacturer('');
  };

  // Add Student Handler
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    saveStudentToFirestore(newStudent).catch(() => {});

    const logEntry = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Student Enrolled' as const,
      target: `${newStudent.rollNumber} (${newStudent.name})`,
      details: `Enrolled in ${newStudent.department} · Clearance active`,
      type: 'system' as const,
    };
    setActivityLogs((prev) => [logEntry, ...prev]);
    logActivityToFirestore(logEntry).catch(() => {});
  };

  // Handles successful authentication and role redirection
  const handleLoginSuccess = (role: UserRole, customUser?: User) => {
    setCurrentUserRole(role);
    setCustomLoggedInUser(customUser || null);
    setIsAuthenticated(true);
    setActiveModule('dashboard');
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentUserRole(newRole);
    setCustomLoggedInUser(null);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCustomLoggedInUser(null);
    setCurrentUserRole('HOD_ADMIN');
    setActiveModule('dashboard');
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Circulation issue handler
  const handleIssueSuccess = (data: any) => {
    const studentName = data.student?.name || 'Student Borrower';
    const studentRollNo = data.student?.rollNumber || data.student?.rollNo || 'N/A';
    const studentEmail = data.student?.email || 'borrower@bbsutsd.edu.pk';
    const targetLab = laboratories.find((l) => l.id === data.equipment?.labId);

    const newRecord: IssueRecord = {
      id: `iss-${Date.now()}`,
      issueCode: `ISS-${Math.floor(1000 + Math.random() * 9000)}`,
      equipmentId: data.equipment.id,
      equipmentName: data.equipment.name,
      assetTag: data.equipment.assetTag,
      studentId: data.student?.id || `stu-${Date.now()}`,
      studentName,
      studentRollNo,
      studentEmail,
      labId: data.equipment.labId,
      labName: targetLab ? targetLab.name : 'Engineering Laboratory',
      issuedByAssistantId: currentUser.id,
      issuedByAssistantName: currentUser.name,
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate,
      issueTime: data.issueTime,
      dueTime: data.dueTime,
      durationDays: data.durationDays,
      durationHours: data.durationHours,
      durationMinutes: data.durationMinutes,
      purpose: data.purpose || data.remarks || '',
      status: 'active',
      conditionAtIssue: data.equipment.condition,
      remarks: data.purpose || data.remarks || '',
    };

    setIssueRecords((prev) => [newRecord, ...prev]);

    setEquipmentList((prev) =>
      prev.map((e) => (e.id === data.equipment.id ? { ...e, status: 'issued' } : e))
    );

    const logEntry = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Equipment Issued' as const,
      target: `${data.equipment.assetTag} (${data.equipment.name})`,
      details: `Issued to ${studentName} (${studentRollNo})${data.purpose ? ` · Purpose: ${data.purpose}` : ''}`,
      type: 'issue' as const,
    };

    setActivityLogs((prev) => [logEntry, ...prev]);

    // Persist to Firestore database
    saveIssueRecordToFirestore(newRecord).catch(() => {});
    logActivityToFirestore(logEntry).catch(() => {});
  };

  // Circulation return handler
  const handleReturnSuccess = (issueId: string, condition: any, remarks: string) => {
    setIssueRecords((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? {
              ...i,
              status: 'returned',
              returnDate: new Date().toISOString().split('T')[0],
              conditionAtReturn: condition,
              remarks: remarks || i.remarks,
            }
          : i
      )
    );

    const issue = issueRecords.find((i) => i.id === issueId);
    if (issue) {
      setEquipmentList((prev) =>
        prev.map((e) =>
          e.id === issue.equipmentId
            ? {
                ...e,
                status: condition === 'damaged' ? 'damaged' : 'available',
                condition,
              }
            : e
        )
      );

      const logEntry = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Equipment Returned' as const,
        target: `${issue.assetTag} (${issue.equipmentName})`,
        details: `Checked in condition: ${condition}`,
        type: 'return' as const,
      };

      setActivityLogs((prev) => [logEntry, ...prev]);

      // Persist return in Firestore
      recordReturnInFirestore(issueId, issue.equipmentId, condition, remarks || '').catch(() => {});
      logActivityToFirestore(logEntry).catch(() => {});
    }
  };

  // Route permission verification
  const isModuleAllowed = (module: ActiveNavModule, role: UserRole): boolean => {
    const adminOnlyModules: ActiveNavModule[] = [
      'laboratories',
      'inventory',
      'lab_assistants',
      'reports',
      'audit_logs',
      'settings',
    ];
    if (role === 'LAB_ASSISTANT' && adminOnlyModules.includes(module)) {
      return false;
    }
    return true;
  };

  // Main Entry Point: Login Page
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} laboratories={laboratories} />;
  }

  // Count active overdue items
  const overdueCount = issueRecords.filter((i) => i.status === 'overdue').length;
  const maintenanceCount = equipmentList.filter(
    (e) => e.status === 'maintenance' || e.status === 'damaged'
  ).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0c0908] text-[#f5efe8] flex relative overflow-x-hidden selection:bg-red-950 selection:text-red-200">
      {/* Background Energy Glow & Geometry */}
      <BackgroundEnergyField />

      {/* Shared Persistent Sidebar with strict role-based navigation */}
      <Sidebar
        activeModule={activeModule}
        onNavigate={setActiveModule}
        userRole={currentUserRole}
        overdueCount={overdueCount}
        maintenanceCount={maintenanceCount}
        unreadNotificationsCount={unreadNotificationsCount}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        assignedLabName={currentUser.assignedLabName}
      />

      {/* Main Viewport Container */}
      <div className="relative z-10 flex flex-1 flex-col md:pl-64 min-w-0">
        <Header
          currentUser={currentUser}
          onRoleChange={handleRoleChange}
          activeModule={activeModule}
          onNavigate={setActiveModule}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onOpenSearch={() => setIsSearchOpen(true)}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Dynamic Module Router View with Protected Access Enforcement */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {!isModuleAllowed(activeModule, currentUserRole) ? (
            <AccessDenied
              onBackToDashboard={() => setActiveModule('dashboard')}
              requiredRole="HOD / Admin"
            />
          ) : (
            <>
              {activeModule === 'dashboard' && (
                <>
                  {currentUserRole === 'HOD_ADMIN' ? (
                    <AdminDashboard
                      laboratories={laboratories}
                      equipment={equipmentList}
                      issues={issueRecords}
                      activityLogs={activityLogs}
                      notifications={notifications}
                      onNavigate={setActiveModule}
                      onSelectEquipment={(eq) => {
                        setSelectedEquipment(eq);
                        setActiveModule('equipment');
                      }}
                      onSelectLaboratory={(lab) => {
                        setSelectedLab(lab);
                        setActiveModule('laboratories');
                      }}
                    />
                  ) : (
                    <LabAssistantDashboard
                      currentUser={currentUser}
                      laboratories={laboratories}
                      equipment={equipmentList}
                      issues={issueRecords}
                      onNavigate={setActiveModule}
                      onSelectEquipment={(eq) => {
                        setSelectedEquipment(eq);
                        setActiveModule('equipment');
                      }}
                    />
                  )}
                </>
              )}

              {activeModule === 'laboratories' && (
                <LaboratoriesView
                  laboratories={laboratories}
                  equipment={equipmentList}
                  selectedLab={selectedLab}
                  onSelectLab={setSelectedLab}
                  onAddLabClick={() => setShowAddLabModal(true)}
                  onDeleteLab={handleDeleteLaboratory}
                  isHodAdmin={currentUserRole === 'HOD_ADMIN'}
                />
              )}

              {activeModule === 'my_laboratory' && (
                <LaboratoriesView
                  laboratories={laboratories.filter((l) =>
                    (currentUser.assignedLabIds || ['lab-01']).includes(l.id)
                  )}
                  equipment={equipmentList}
                  selectedLab={selectedLab}
                  onSelectLab={setSelectedLab}
                  onAddLabClick={() => setShowAddLabModal(true)}
                />
              )}

              {activeModule === 'equipment' && (
                <EquipmentView
                  equipment={
                    currentUserRole === 'LAB_ASSISTANT'
                      ? equipmentList.filter((e) =>
                          (currentUser.assignedLabIds || ['lab-01']).includes(e.labId)
                        )
                      : equipmentList
                  }
                  laboratories={laboratories}
                  selectedEquipment={selectedEquipment}
                  onSelectEquipment={setSelectedEquipment}
                  onAddEquipmentClick={() => {
                    if (laboratories.length > 0 && !newEqLabId) {
                      setNewEqLabId(laboratories[0].id);
                    }
                    setShowAddEquipmentModal(true);
                  }}
                />
              )}

              {activeModule === 'inventory' && <InventoryView />}

              {activeModule === 'students' && (
                <StudentsView students={students} onAddStudent={handleAddStudent} />
              )}

              {activeModule === 'lab_assistants' && (
                <LabAssistantsView assistants={allLabAssistants} />
              )}

              {activeModule === 'issue_equipment' && (
                <IssueEquipmentView
                  equipment={equipmentList}
                  students={students}
                  laboratories={laboratories}
                  onIssueSuccess={handleIssueSuccess}
                />
              )}

              {activeModule === 'return_equipment' && (
                <ReturnEquipmentView
                  issues={issueRecords}
                  onReturnProcessed={handleReturnSuccess}
                />
              )}

              {activeModule === 'overdue_items' && (
                <OverdueItemsView issues={issueRecords} />
              )}

              {activeModule === 'maintenance' && (
                <MaintenanceView
                  records={mockMaintenanceRecords}
                  equipment={equipmentList}
                />
              )}

              {activeModule === 'reports' && <ReportsView />}

              {activeModule === 'activity_logs' && (
                <ActivityLogsView logs={activityLogs} />
              )}

              {activeModule === 'my_activity' && (
                <ActivityLogsView
                  logs={activityLogs.filter(
                    (l) => l.userRole === 'LAB_ASSISTANT' || l.userName === currentUser.name
                  )}
                />
              )}

              {activeModule === 'audit_logs' && (
                <AuditLogsView auditLogs={mockAuditLogs} />
              )}

              {activeModule === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onMarkRead={handleMarkNotificationRead}
                  onMarkAllRead={handleMarkAllNotificationsRead}
                />
              )}

              {activeModule === 'settings' && <SettingsView />}
            </>
          )}
        </main>

        {/* Official Institutional Footer */}
        <footer className="mt-auto border-t border-[#251816] bg-[#100a09] py-5 px-4 sm:px-6 lg:px-8 text-xs text-[#8a796e]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <UniversityLogo size="xs" showText={false} />
              <div>
                <p className="font-semibold text-stone-300">
                  The Benazir Bhutto Shaheed University of Technology and Skill Development, Khairpur
                </p>
                <p className="text-[10px] text-[#78675b]">
                  Central Laboratory Directorate &amp; Asset Management System
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] text-[#7d6c60]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/60 bg-emerald-950/40 px-2.5 py-0.5 text-emerald-400 font-sans">
                <span className={`h-1.5 w-1.5 rounded-full ${isFirebaseLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                Firebase: {FIREBASE_PROJECT_ALIAS}
              </span>
              <span>·</span>
              <span className="text-red-400 font-semibold">BBSUTSD Portal</span>
              <span>·</span>
              <span>Khairpur Mirs, Sindh</span>
              <span>·</span>
              <span>© 2026 All Rights Reserved</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Universal Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        equipment={equipmentList}
        laboratories={laboratories}
        students={students}
        onSelectEquipment={(eq) => {
          setSelectedEquipment(eq);
          setActiveModule('equipment');
        }}
        onSelectLaboratory={(lab) => {
          setSelectedLab(lab);
          setActiveModule(currentUserRole === 'HOD_ADMIN' ? 'laboratories' : 'my_laboratory');
        }}
        onSelectStudent={() => {
          setActiveModule('students');
        }}
        onNavigate={setActiveModule}
      />

      {/* Add Laboratory Modal with Dark Red Theme */}
      {showAddLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddLabModal(false)}
          />
          <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[#382320] bg-[#160f0e] p-6 shadow-2xl text-[#f5efe8]">
            <div className="flex items-start justify-between border-b border-[#281816] pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Register New Laboratory Facility</h3>
                <p className="text-xs text-[#a39589] mt-0.5">
                  Configure university facility specs and set up an independent Lab Assistant login account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLabModal(false)}
                className="text-[#7d6c60] hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLaboratorySubmit} className="mt-4 space-y-4 text-xs">
              {/* Section 1: Facility Specifications */}
              <div>
                <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider block mb-2">
                  1. Laboratory Facility Specifications
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[#b8a89b] font-medium mb-1">Laboratory Name *</label>
                    <input
                      required
                      value={newLabName}
                      onChange={(e) => setNewLabName(e.target.value)}
                      placeholder="e.g. Nanomaterials & Cleanroom Facility"
                      className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1">Facility Code *</label>
                      <input
                        required
                        value={newLabCode}
                        onChange={(e) => setNewLabCode(e.target.value)}
                        placeholder="LAB-NANO-101"
                        className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1">Building *</label>
                      <input
                        required
                        value={newLabBuilding}
                        onChange={(e) => setNewLabBuilding(e.target.value)}
                        placeholder="Science Complex B"
                        className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1">Floor</label>
                      <input
                        value={newLabFloor}
                        onChange={(e) => setNewLabFloor(e.target.value)}
                        placeholder="Floor 1"
                        className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1">Room No.</label>
                      <input
                        value={newLabRoom}
                        onChange={(e) => setNewLabRoom(e.target.value)}
                        placeholder="SCB-102"
                        className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1">Capacity</label>
                      <input
                        type="number"
                        min="1"
                        value={newLabCapacity}
                        onChange={(e) => setNewLabCapacity(Number(e.target.value))}
                        className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1">Department</label>
                      <select
                        value={newLabDept}
                        onChange={(e) => setNewLabDept(e.target.value)}
                        className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                      >
                        <option value="Department of Electrical & Electronics Engineering Technology">
                          Department of Electrical &amp; Electronics Engineering Technology
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
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1">Contact Extension</label>
                      <input
                        value={newLabExt}
                        onChange={(e) => setNewLabExt(e.target.value)}
                        placeholder="Ext. 2040"
                        className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Dedicated Lab Assistant & Login Credentials */}
              <div className="pt-3 border-t border-[#261715]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                    2. Assigned Lab Assistant &amp; Login Credentials
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    Separate Login
                  </span>
                </div>
                <p className="text-[11px] text-[#8a796e] mb-3">
                  Provide an institutional email and password so this lab assistant can independently sign into this facility portal terminal.
                </p>

                <div className="space-y-3 rounded-xl border border-[#30201d] bg-[#1b1211] p-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1">Assistant Full Name *</label>
                      <input
                        required
                        value={newLabAssistantName}
                        onChange={(e) => setNewLabAssistantName(e.target.value)}
                        placeholder="e.g. Engr. Noman Ali Abbasi"
                        className="w-full rounded-xl border border-[#382320] bg-[#140d0c] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1">Assistant Mobile / Phone</label>
                      <input
                        value={newLabAssistantPhone}
                        onChange={(e) => setNewLabAssistantPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full rounded-xl border border-[#382320] bg-[#140d0c] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1 flex items-center gap-1">
                        <Mail className="h-3 w-3 text-red-400" />
                        Login Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={newLabAssistantEmail}
                        onChange={(e) => setNewLabAssistantEmail(e.target.value)}
                        placeholder="noman.nano@bbsutsd.edu.pk"
                        className="w-full rounded-xl border border-[#382320] bg-[#140d0c] px-3 py-2 text-xs text-white font-mono placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[#b8a89b] font-medium mb-1 flex items-center gap-1">
                        <Lock className="h-3 w-3 text-red-400" />
                        Login Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewAssistantPassword ? 'text' : 'password'}
                          required
                          value={newLabAssistantPassword}
                          onChange={(e) => setNewLabAssistantPassword(e.target.value)}
                          placeholder="Password for this assistant"
                          className="w-full rounded-xl border border-[#382320] bg-[#140d0c] pl-3 pr-8 py-2 text-xs text-white font-mono placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewAssistantPassword(!showNewAssistantPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#7d6c60] hover:text-white"
                        >
                          {showNewAssistantPassword ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-[#8a796e] pt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Credentials will be saved in Firestore and will immediately allow signing in with this email and password.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#241715] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLabModal(false)}
                  className="rounded-xl border border-[#382320] bg-[#1c1312] px-3.5 py-2 text-xs font-semibold text-stone-300 hover:bg-[#251917] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] transition"
                >
                  Save Facility &amp; Create Assistant Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Equipment Modal with Dark Red Theme */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddEquipmentModal(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-[#382320] bg-[#160f0e] p-6 shadow-2xl text-[#f5efe8]">
            <h3 className="text-base font-bold text-white">Register New Equipment Asset Tag</h3>
            <p className="text-xs text-[#a39589] mt-1">
              Add individual asset with serial number and full physical location hierarchy.
            </p>

            <form onSubmit={handleAddEquipmentSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#b8a89b] font-medium mb-1">Equipment Name *</label>
                <input
                  required
                  value={newEqName}
                  onChange={(e) => setNewEqName(e.target.value)}
                  placeholder="e.g. Rohde & Schwarz Spectrum Analyzer 3GHz"
                  className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Asset Tag *</label>
                  <input
                    required
                    value={newEqAssetTag}
                    onChange={(e) => setNewEqAssetTag(e.target.value)}
                    placeholder="BBSUTSD-EET-1044"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Serial Number</label>
                  <input
                    value={newEqSerial}
                    onChange={(e) => setNewEqSerial(e.target.value)}
                    placeholder="RS-FPC1000-8812"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Model</label>
                  <input
                    value={newEqModel}
                    onChange={(e) => setNewEqModel(e.target.value)}
                    placeholder="FPC1000"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Category</label>
                  <select
                    value={newEqCategory}
                    onChange={(e) => setNewEqCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                  >
                    <option value="Electronic Test & Measurement">Electronic Test &amp; Measurement</option>
                    <option value="Robotics & Automation">Robotics &amp; Automation</option>
                    <option value="Optics & Photonics">Optics &amp; Photonics</option>
                    <option value="Computing & Microcontrollers">Computing &amp; Microcontrollers</option>
                    <option value="Civil & Material Testing">Civil &amp; Material Testing</option>
                    <option value="Chemical & Petrochemical Testing">Chemical &amp; Petrochemical Testing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Assigned Laboratory</label>
                  <select
                    value={newEqLabId || (laboratories[0]?.id || '')}
                    onChange={(e) => setNewEqLabId(e.target.value)}
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 transition"
                  >
                    {laboratories.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.code} ({l.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#b8a89b] font-medium mb-1">Cabinet &amp; Shelf</label>
                  <input
                    value={newEqCabinet}
                    onChange={(e) => setNewEqCabinet(e.target.value)}
                    placeholder="Cabinet C-01 · Shelf 02"
                    className="w-full rounded-xl border border-[#382320] bg-[#1c1312] px-3 py-2 text-xs text-white placeholder:text-[#6e5d52] focus:outline-none focus:border-red-600 transition"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#241715] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEquipmentModal(false)}
                  className="rounded-xl border border-[#382320] bg-[#1c1312] px-3.5 py-2 text-xs font-semibold text-stone-300 hover:bg-[#251917] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-700/60 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] transition"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
