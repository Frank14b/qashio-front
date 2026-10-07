export type MessageResponse = {
  message: string;
};

export type ChangePasswordRequestPayload = {
  email: string;
  currentPassword: string;
};

export type ConfirmChangePasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};
