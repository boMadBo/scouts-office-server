export interface ICreateUserParams {
  email: string;
  password: string;
  name: string;
  country: string;
  birthDate: string;
  avatar?: Buffer;
}
