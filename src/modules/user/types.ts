export interface ICreateUserParams {
  email: string;
  password: string;
  name: string;
  country: string;
  birthDate: string;
  avatarUrl?: string;
}

export interface IUser {
  id: number;
  email: string;
  name: string;
  country: string;
  birthDate: Date;
  avatar?: string | undefined;
}

export interface IUpdateUserParams {
  email?: string;
  name?: string;
  password?: string;
  avatarUrl?: string;
}
