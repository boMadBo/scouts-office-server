export interface IUpdateUserParams {
  email?: string;
  name?: string;
  password?: string;
  avatarUrl?: string;
}

export interface IUtcZone {
  id: number;
  city: string;
  order: number;
  isActive: boolean;
}
