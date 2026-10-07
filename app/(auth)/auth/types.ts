export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type RegisterPendingResponse = {
  email: string;
  message: string;
  requiresEmailVerification: true;
};

export type MessageResponse = {
  message: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  displayName: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

export type RefreshPayload = {
  refreshToken: string;
};
