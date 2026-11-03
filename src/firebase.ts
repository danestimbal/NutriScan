/**
 * Firebase Client Initialization & Firestore Error Handling
 */
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signInAnonymously,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// CRITICAL: Must pass firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Strict Undefined-Stripping Utility to guarantee zero-crash payload hygiene
 */
export function sanitizePayload<T extends Record<string, any>>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) => (value === undefined ? null : value))
  );
}

// Test initial connection as required by Firebase skill
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or network constrained. Local caching active.');
    }
  }
}

testFirestoreConnection();

/**
 * Google SSO Sign-in
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

/**
 * Facebook SSO Sign-in
 */
export async function loginWithFacebook() {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  } catch (error: any) {
    console.error('Facebook Sign-in failed:', error);
    throw error;
  }
}

/**
 * Email & Password Sign-in
 */
export async function loginWithEmail(email: string, pass: string) {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

/**
 * Email & Password User Registration
 */
export async function registerWithEmail(email: string, pass: string, displayName?: string) {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
}

/**
 * Password Reset
 */
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Anonymous / Guest Sign-in
 */
export async function loginAnonymouslyUser() {
  const result = await signInAnonymously(auth);
  return result.user;
}

/**
 * Sign Out
 */
export async function logoutUser() {
  await signOut(auth);
}
