import { logEvent as firebaseLogEvent } from 'firebase/analytics';
import { analytics } from './config';

export const logAnalyticsEvent = (eventName: string, params?: Record<string, unknown>): void => {
  if (!analytics) return;
  firebaseLogEvent(analytics, eventName, params);
};
