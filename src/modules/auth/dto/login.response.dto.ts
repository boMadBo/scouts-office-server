export class LoginResponse {
  id: number;

  name?: string;

  accessToken: string;

  refreshToken: string;

  expiresIn: number;
}
