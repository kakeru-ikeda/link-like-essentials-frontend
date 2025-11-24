import {
  signInAnonymously,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

export const signInAnonymous = async (): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('匿名ログインエラー:', error);
    throw error;
  }
};

export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const getIdToken = async (): Promise<string | null> => {
  const user = getCurrentUser();
  if (!user) return null;
  return await user.getIdToken();
};
