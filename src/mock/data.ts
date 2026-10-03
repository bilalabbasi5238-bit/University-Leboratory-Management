import {
  User,
  Laboratory,
  Equipment,
  IssueRecord,
  Student,
  LabAssistant,
  MaintenanceRecord,
  ActivityLog,
  AuditLog,
  NotificationItem,
} from '../types';

// Exactly one user account for each separate institutional portal
export const mockUsers: Record<string, User> = {
  admin: {
    id: 'usr-admin-01',
    name: 'Prof. Dr. Abdul Qadir Memon',
    email: 'admin@bbsutsd.edu.pk',
    role: 'HOD_ADMIN',
    department: 'Central Laboratory Directorate & Faculty of Engineering Technology',
    staffId: 'BBSUTSD-FAC-1088',
    assignedLabIds: ['lab-01'],
    assignedLabName: 'All University Facilities (Khairpur Campus)',
  },
  lab_assistant: {
    id: 'usr-asst-01',
    name: 'Engr. Tarique Hussain Soomro',
    email: 'assistant@bbsutsd.edu.pk',
    role: 'LAB_ASSISTANT',
    department: 'Department of Electrical & Electronics Engineering Technology',
    staffId: 'BBSUTSD-STF-4290',
    assignedLabIds: ['lab-01'],
    assignedLabName: 'Power Systems & Microelectronics Lab (ETC-204)',
  },
};

// Initial university laboratory facility (clean initial record without dummy counts)
export const mockLaboratories: Laboratory[] = [
  {
    id: 'lab-01',
    code: 'LAB-EET-204',
    name: 'Power Systems & Microelectronics Lab',
    department: 'Department of Electrical & Electronics Engineering Technology',
    building: 'Engineering Technology Complex',
    floor: 'Floor 2',
    roomNumber: 'ETC-204',
    capacity: 35,
    assignedAssistantId: 'usr-asst-01',
    assignedAssistantName: 'Engr. Tarique Hussain Soomro',
    status: 'active',
    totalEquipmentCount: 0,
    activeIssuesCount: 0,
    contactExtension: 'Ext. 3404',
  },
];

// Single authorized lab assistant user matching the Lab Assistant portal
export const mockLabAssistants: LabAssistant[] = [
  {
    id: 'usr-asst-01',
    staffId: 'BBSUTSD-STF-4290',
    name: 'Engr. Tarique Hussain Soomro',
    email: 'assistant@bbsutsd.edu.pk',
    department: 'Department of Electrical & Electronics Engineering Technology',
    phone: '+92 243 928001 Ext. 101',
    assignedLabs: [
      { id: 'lab-01', name: 'Power Systems & Microelectronics Lab', code: 'LAB-EET-204' },
    ],
    activeSupervisionCount: 0,
  },
];

// Clean state: all dummy equipment removed
export const mockEquipment: Equipment[] = [];

// Clean state: all dummy issues removed
export const mockIssueRecords: IssueRecord[] = [];

// Clean state: all dummy students removed
export const mockStudents: Student[] = [];

// Clean state: all dummy maintenance tickets removed
export const mockMaintenanceRecords: MaintenanceRecord[] = [];

// Clean state: all dummy activity logs removed
export const mockActivityLogs: ActivityLog[] = [];

// Clean state: all dummy audit logs removed
export const mockAuditLogs: AuditLog[] = [];

// Clean state: all dummy notifications removed
export const mockNotifications: NotificationItem[] = [];
