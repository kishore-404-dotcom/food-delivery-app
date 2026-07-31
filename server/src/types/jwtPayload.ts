export interface JwtPayload {
  id: string;
  iat?: number;
  authVersion?: number;
}
