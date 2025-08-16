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

export enum GENDER {
  MALE = "male",
  FEMALE = "female",
}

export enum ROLE {
  USER = "resident",
  ADMIN = "admin",
}
export type UserType = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  apartNumber: string;
  isVerified?: boolean;
  phone?: string;
  gender: GENDER;
  dob: string;
  role?: ROLE;
  permissions?: PERMISSION;
  isActive?: boolean;
};

export enum PERMISSION {
  NONE = "0",
  READ = "1",
  WRITE = "2",
}
