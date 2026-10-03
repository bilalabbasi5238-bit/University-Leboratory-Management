export type UserRole = 'HOD_ADMIN' | 'LAB_ASSISTANT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  staffId?: string;
  assignedLabIds?: string[];
  assignedLabName?: string;
}

export interface PhysicalLocation {
  building: string;
  floor: string;
  labId: string;
  room?: string;
  cabinet?: string;
  drawer?: string;
  shelf?: string;
}

export type EquipmentStatus = 'available' | 'issued' | 'maintenance' | 'damaged' | 'reserved';
export type EquipmentCondition = 'excellent' | 'good' | 'fair' | 'damaged';

export interface Equipment {
  id: string;
  assetTag: string;
  serialNumber: string;
  name: string;
  category: string;
  model: string;
  manufacturer: string;
  labId: string;
  location: PhysicalLocation;
  status: EquipmentStatus;
  condition: EquipmentCondition;
  purchaseDate: string;
  cost?: number;
  qrCode: string;
  specifications?: Record<string, string>;
  lastCalibrated?: string;
  notes?: string;
}

export interface Laboratory {
  id: string;
  code: string;
  name: string;
  department: string;
  building: string;
  floor: string;
  roomNumber: string;
  capacity: number;
  assignedAssistantId: string;
  assignedAssistantName: string;
  status: 'active' | 'maintenance' | 'closed';
  totalEquipmentCount: number;
  activeIssuesCount: number;
  contactExtension: string;
}

export type IssueStatus = 'active' | 'returned' | 'overdue' | 'damaged';

export interface IssueRecord {
  id: string;
  issueCode: string;
  equipmentId: string;
  equipmentName: string;
  assetTag: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentEmail: string;
  labId: string;
  labName: string;
  issuedByAssistantId: string;
  issuedByAssistantName: string;
  issueDate: string;
  dueDate: string;
  issueTime?: string;
  dueTime?: string;
  durationDays?: number;
  durationHours?: number;
  durationMinutes?: number;
  purpose?: string;
  returnDate?: string;
  status: IssueStatus;
  conditionAtIssue: EquipmentCondition;
  conditionAtReturn?: EquipmentCondition;
  remarks?: string;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  department: string;
  semester: string;
  phone: string;
  activeIssuesCount: number;
  hasOverdue: boolean;
  clearanceStatus: 'cleared' | 'hold' | 'pending';
  qrCode: string;
}

export interface LabAssistant {
  id: string;
  staffId: string;
  name: string;
  email: string;
  department: string;
  phone: string;
  assignedLabs: { id: string; name: string; code: string }[];
  activeSupervisionCount: number;
}

export interface Reservation {
  id: string;
  equipmentId: string;
  equipmentName: string;
  assetTag: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  labId: string;
  labName: string;
  reservedDate: string;
  timeSlot: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  assetTag: string;
  labId: string;
  labName: string;
  reportedBy: string;
  reportedDate: string;
  issueDescription: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'in_progress' | 'completed' | 'decommissioned';
  technicianName?: string;
  cost?: number;
  completionDate?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  target: string;
  details: string;
  type: 'issue' | 'return' | 'maintenance' | 'audit' | 'system';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  performedBy: string;
  userRole: UserRole;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'TRANSFER' | 'OVERDUE_FLAG';
  entity: string;
  entityId: string;
  ipAddress: string;
  changesSummary: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export type ActiveNavModule =
  | 'dashboard'
  | 'laboratories'
  | 'my_laboratory'
  | 'inventory'
  | 'equipment'
  | 'students'
  | 'lab_assistants'
  | 'issue_equipment'
  | 'return_equipment'
  | 'maintenance'
  | 'overdue_items'
  | 'reports'
  | 'activity_logs'
  | 'my_activity'
  | 'audit_logs'
  | 'notifications'
  | 'settings';
