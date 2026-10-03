import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Equipment, IssueRecord, Laboratory, Student, ActivityLog } from '../types';
import { mockLaboratories } from '../mock/data';

// Collection references
export const COLLECTIONS = {
  LABORATORIES: 'laboratories',
  EQUIPMENT: 'equipment',
  ISSUE_RECORDS: 'issueRecords',
  STUDENTS: 'students',
  ACTIVITY_LOGS: 'activityLogs',
} as const;

/**
 * Fetch all laboratories from Firestore
 */
export async function fetchLaboratories(): Promise<Laboratory[]> {
  try {
    const colRef = collection(db, COLLECTIONS.LABORATORIES);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      return [];
    }
    return snap.docs.map((d) => d.data() as Laboratory);
  } catch (error) {
    console.warn('[Firestore] Error fetching laboratories:', error);
    return [];
  }
}

/**
 * Save new or updated Laboratory facility to Firestore
 */
export async function saveLaboratoryToFirestore(lab: Laboratory): Promise<void> {
  try {
    const labDocRef = doc(db, COLLECTIONS.LABORATORIES, lab.id);
    await setDoc(labDocRef, lab, { merge: true });
  } catch (error) {
    console.warn('[Firestore] Error saving laboratory:', error);
  }
}

/**
 * Subscribe to real-time laboratories updates
 */
export function subscribeToLaboratories(callback: (items: Laboratory[]) => void): () => void {
  const colRef = collection(db, COLLECTIONS.LABORATORIES);
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => d.data() as Laboratory);
        callback(items);
      }
    },
    (err) => {
      console.warn('[Firestore] Real-time laboratories subscription error:', err);
    }
  );
}

/**
 * Fetch all equipment assets from Firestore
 */
export async function fetchEquipment(): Promise<Equipment[]> {
  try {
    const colRef = collection(db, COLLECTIONS.EQUIPMENT);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      return [];
    }
    return snap.docs.map((d) => d.data() as Equipment);
  } catch (error) {
    console.warn('[Firestore] Error fetching equipment:', error);
    return [];
  }
}

/**
 * Save new or updated equipment asset in Firestore
 */
export async function saveEquipmentToFirestore(item: Equipment): Promise<void> {
  try {
    const eqDocRef = doc(db, COLLECTIONS.EQUIPMENT, item.id);
    await setDoc(eqDocRef, item, { merge: true });
  } catch (error) {
    console.warn('[Firestore] Error saving equipment:', error);
  }
}

/**
 * Subscribe to real-time equipment updates
 */
export function subscribeToEquipment(callback: (items: Equipment[]) => void): () => void {
  const colRef = collection(db, COLLECTIONS.EQUIPMENT);
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => d.data() as Equipment);
        callback(items);
      }
    },
    (err) => {
      console.warn('[Firestore] Real-time equipment subscription error:', err);
    }
  );
}

/**
 * Save new or updated student record
 */
export async function saveStudentToFirestore(student: Student): Promise<void> {
  try {
    const stDocRef = doc(db, COLLECTIONS.STUDENTS, student.id);
    await setDoc(stDocRef, student, { merge: true });
  } catch (error) {
    console.warn('[Firestore] Error saving student:', error);
  }
}

/**
 * Subscribe to real-time students updates
 */
export function subscribeToStudents(callback: (students: Student[]) => void): () => void {
  const colRef = collection(db, COLLECTIONS.STUDENTS);
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => d.data() as Student);
        callback(items);
      }
    },
    (err) => {
      console.warn('[Firestore] Real-time students subscription error:', err);
    }
  );
}

/**
 * Subscribe to real-time issue records
 */
export function subscribeToIssueRecords(callback: (records: IssueRecord[]) => void): () => void {
  const colRef = collection(db, COLLECTIONS.ISSUE_RECORDS);
  return onSnapshot(
    colRef,
    (snap) => {
      if (!snap.empty) {
        const records = snap.docs.map((d) => d.data() as IssueRecord);
        callback(records);
      }
    },
    (err) => {
      console.warn('[Firestore] Real-time issue records subscription error:', err);
    }
  );
}

/**
 * Save new Issue Record in Firestore and update equipment status
 */
export async function saveIssueRecordToFirestore(record: IssueRecord): Promise<void> {
  try {
    const recordDocRef = doc(db, COLLECTIONS.ISSUE_RECORDS, record.id);
    await setDoc(recordDocRef, {
      ...record,
      createdAt: serverTimestamp(),
    });

    // Update equipment status to issued
    const eqDocRef = doc(db, COLLECTIONS.EQUIPMENT, record.equipmentId);
    await updateDoc(eqDocRef, {
      status: 'issued',
      lastIssuedTo: record.studentName,
      lastIssuedRollNo: record.studentRollNo,
      lastIssuedDate: record.issueDate,
    }).catch(async () => {
      await setDoc(eqDocRef, { id: record.equipmentId, status: 'issued' }, { merge: true });
    });
  } catch (error) {
    console.warn('[Firestore] Error writing issue record:', error);
  }
}

/**
 * Record equipment check-in / return in Firestore
 */
export async function recordReturnInFirestore(
  issueId: string,
  equipmentId: string,
  condition: string,
  remarks: string
): Promise<void> {
  try {
    const recordDocRef = doc(db, COLLECTIONS.ISSUE_RECORDS, issueId);
    await updateDoc(recordDocRef, {
      status: 'returned',
      returnDate: new Date().toISOString().split('T')[0],
      conditionAtReturn: condition,
      remarks,
    });

    const eqDocRef = doc(db, COLLECTIONS.EQUIPMENT, equipmentId);
    await updateDoc(eqDocRef, {
      status: condition === 'damaged' ? 'damaged' : 'available',
      condition,
    });
  } catch (error) {
    console.warn('[Firestore] Error recording return:', error);
  }
}

/**
 * Append an activity audit log entry
 */
export async function logActivityToFirestore(log: ActivityLog): Promise<void> {
  try {
    const logDocRef = doc(db, COLLECTIONS.ACTIVITY_LOGS, log.id);
    await setDoc(logDocRef, {
      ...log,
      serverTime: serverTimestamp(),
    });
  } catch (error) {
    console.warn('[Firestore] Error logging activity:', error);
  }
}

/**
 * Initialize initial university facility in Firestore if collections are blank.
 * Does NOT seed dummy equipment, dummy students, or dummy issues.
 */
export async function seedFirestoreIfEmpty(): Promise<boolean> {
  try {
    const labSnap = await getDocs(collection(db, COLLECTIONS.LABORATORIES));
    if (!labSnap.empty) {
      return false; // Already populated
    }

    console.log('[Firestore] Initializing BBSUTSD laboratory facilities...');

    // Seed only the initial laboratory facility structure
    for (const lab of mockLaboratories) {
      await setDoc(doc(db, COLLECTIONS.LABORATORIES, lab.id), lab);
    }

    console.log('[Firestore] BBSUTSD laboratory initialization complete.');
    return true;
  } catch (error) {
    console.warn('[Firestore] Initialization warning:', error);
    return false;
  }
}
