import { getRemoteConfig, fetchAndActivate, getValue, RemoteConfig } from 'firebase/remote-config';
import { app } from './config';

const REMOTE_CONFIG_FETCH_INTERVAL_MS = 60_000;
const REMOTE_CONFIG_FETCH_TIMEOUT_MS = 10_000;
const DEFAULT_MAINTENANCE_FLAG = false;

let remoteConfigInstance: RemoteConfig | null = null;

const isBrowser = () => typeof window !== 'undefined';

function getRemoteConfigInstance(): RemoteConfig | null {
  if (!isBrowser()) return null;

  // Firebase app はクライアントでのみ初期化されるため、未初期化の場合は無視
  if (!app) return null;

  if (!remoteConfigInstance) {
    remoteConfigInstance = getRemoteConfig(app);
    remoteConfigInstance.settings = {
      minimumFetchIntervalMillis: REMOTE_CONFIG_FETCH_INTERVAL_MS,
      fetchTimeoutMillis: REMOTE_CONFIG_FETCH_TIMEOUT_MS,
    };
    remoteConfigInstance.defaultConfig = {
      maintenance_enabled: DEFAULT_MAINTENANCE_FLAG,
    };
  }

  return remoteConfigInstance;
}

export async function getMaintenanceFlag(): Promise<boolean> {
  const remoteConfig = getRemoteConfigInstance();
  if (!remoteConfig) return DEFAULT_MAINTENANCE_FLAG;

  try {
    await fetchAndActivate(remoteConfig);
    return getValue(remoteConfig, 'maintenance_enabled').asBoolean();
  } catch (error) {
    console.error('Remote Config fetch error:', error);
    return DEFAULT_MAINTENANCE_FLAG;
  }
}
