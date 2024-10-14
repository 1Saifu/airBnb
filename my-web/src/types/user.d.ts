import { User } from "@prisma/client";


export type UserRegistrationData = Omit<User, "id" | "createdAt" | "updatedAt">;

export type UserLoginData = Omit<User, "id" | "createdAt" | "updatedAt" | "name">;

export type UserResetPasswordData = {
  email: string;      
  newPassword: string; 
  uuid: string;      
}

export type SafeUser = Omit<User, "password" | "passwordResetUUID">;
