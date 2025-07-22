export type UserLoginType = {
  username: string;
  password: string;
  rememberMe?: boolean;
};

export type UserDeviceType = {
  deviceId: string;
  userAgent: string;
  ip: string;
};
