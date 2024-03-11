export interface ITokenPayload {
  id: number;
  email: string;
}

export interface IGetTokens {
  refreshToken: string;
  accessToken: string;
  expiresIn: number;
}
