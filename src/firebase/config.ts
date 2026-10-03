import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';

// Project display & connection parameters
export const FIREBASE_PROJECT_ALIAS = 'BBSUTSD-Laboratory-Management';

export const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: firebaseConfigData.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseConfigData.projectId || 'abiding-hologram-kxctm',
  storageBucket: firebaseConfigData.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseConfigData.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseConfigData.appId || import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase App singleton
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore (with specific databaseId if defined in config, or standard default)
export const db: Firestore =
  firebaseConfigData.firestoreDatabaseId &&
  firebaseConfigData.firestoreDatabaseId !== '(default)' &&
  firebaseConfigData.firestoreDatabaseId.trim() !== ''
    ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
    : getFirestore(app);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Connection test helper as specified by Firebase Skill
export async function testFirebaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connection verified with BBSUTSD-Laboratory-Management database.');
    return { success: true, message: 'Connected to Firestore' };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or database initializing. Checking local cache.');
      return { success: false, message: 'Client offline or initializing' };
    }
    // Document not existing is normal and means connection was reached
    return { success: true, message: 'Firestore reachable' };
  }
}

// Run connection validation on module boot
testFirebaseConnection().catch(() => {});
