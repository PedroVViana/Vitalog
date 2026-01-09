import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

export interface AuthService {
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  onAuthStateChange: (callback: (user: User | null) => void) => () => void;
  getCurrentUser: () => User | null;
}

class FirebaseAuthService implements AuthService {
  signInWithEmail(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => userCredential.user);
  }

  signUpWithEmail(email: string, password: string): Promise<User> {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => userCredential.user);
  }

  signInWithGoogle(): Promise<User> {
    return signInWithPopup(auth, googleProvider)
      .then((result) => result.user);
  }

  signOut(): Promise<void> {
    return signOut(auth);
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export const authService: AuthService = new FirebaseAuthService();

