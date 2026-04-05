import { EntityIdPrefix } from '@/models/shared/enums';

export const getEntityIdPrefix = (entityIdPrefix: EntityIdPrefix): string => `${entityIdPrefix}-`;

export const ensureEntityIdPrefix = (
  entityIdPrefix: EntityIdPrefix,
  rawId: number | string
): string => {
  const prefix = getEntityIdPrefix(entityIdPrefix);

  if (typeof rawId === 'string') {
    const normalizedRawId = rawId.trim();
    if (normalizedRawId.startsWith(prefix)) {
      return normalizedRawId;
    }
    return `${prefix}${normalizedRawId}`;
  }

  return `${prefix}${rawId}`;
};
