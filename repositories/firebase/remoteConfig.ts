import { getRemoteConfig, fetchAndActivate, getValue, RemoteConfig } from 'firebase/remote-config';
import { app } from './config';

const REMOTE_CONFIG_FETCH_INTERVAL_MS = 60_000;
const REMOTE_CONFIG_FETCH_TIMEOUT_MS = 10_000;
const DEFAULT_MAINTENANCE_FLAG = false;

let remoteConfigInstance: RemoteConfig | null = null;

const isBrowser = () => typeof window !== 'undefined';

function getRemoteConfigInstance(): RemoteConfig | null {
  if (!isBrowser()) return null;

  // ブラウザ環境でこの時点で app が未初期化なのは想定外の状態とみなし、明示的にエラーとする
  if (!app) {
    throw new Error('Firebase app is not initialized. Ensure Firebase is initialized on the client before using Remote Config.');
  }

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
    return DEFAULT_MAINTENANCE_FLAG;
  }
}
