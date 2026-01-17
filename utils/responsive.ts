import { PC_MIN_WIDTH } from '@/config/responsive';

export type DeviceType = 'pc' | 'sp';

export function getDeviceTypeByWidth(width: number): DeviceType {
  return width >= PC_MIN_WIDTH ? 'pc' : 'sp';
}

export function isPcWidth(width: number): boolean {
  return width >= PC_MIN_WIDTH;
}
