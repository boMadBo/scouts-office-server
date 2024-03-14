export class LoginResponseDto {
  id: number;
  name?: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
