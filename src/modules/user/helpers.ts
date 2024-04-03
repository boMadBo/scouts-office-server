import { IUtcZone } from '@app/modules/user/types';

export const defaultUtcZones: IUtcZone[] = [
  { id: 1, city: 'Europe/London', order: 0, isActive: true },
  { id: 2, city: 'Europe/Madrid', order: 1, isActive: true },
  { id: 3, city: 'Europe/Moscow', order: 2, isActive: true },
  { id: 4, city: 'Europe/Paris', order: 3, isActive: true },
  { id: 5, city: 'Asia/Tokyo', order: 4, isActive: true },
  { id: 6, city: 'Asia/Hong_Kong', order: 5, isActive: true },
  { id: 7, city: 'America/New_York', order: 6, isActive: true },
  { id: 8, city: 'America/Los_Angeles', order: 7, isActive: true },
  { id: 9, city: 'My location', order: 8, isActive: true },
];
