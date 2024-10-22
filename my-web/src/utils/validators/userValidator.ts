import { UserRegistrationData, UserLoginData, UserResetPasswordData } from "@/types/user";
import { ErrorObject } from "@/types/error";

export function userRegistrationValidator(
  data: UserRegistrationData
): [boolean, ErrorObject] {
  let errors: ErrorObject = {};
  if (!data.email) {
    errors.email = "Email is required";
  }
  if (!data.password) {
    errors.password = "Password is required";
  }
  if (!data.name) {
    errors.name = "Name is required";
  }
  if (data.isAdmin !== undefined && typeof data.isAdmin !== 'boolean') {
    errors.isAdmin = "isAdmin must be a boolean value";
  }
  const hasErrors = Object.keys(errors).length !== 0;

  return [hasErrors, errors];
}

export function userLoginValidator(
  data: UserLoginData
): [boolean, ErrorObject] {
  let errors: ErrorObject = {};
  if (!data.email) {
    errors.email = "Email is required";
  }
  if (!data.password) {
    errors.password = "Password is required";
  }
  const hasErrors = Object.keys(errors).length !== 0;

  return [hasErrors, errors];
}

export function userResetPasswordValidator(
  data: UserResetPasswordData
): [boolean, ErrorObject] {
  let errors: ErrorObject = {};
  if (!data.email) {
    errors.email = "Email is required";
  }
  if (!data.newPassword) {
    errors.newPassword = "New password is required";
  }
  if (!data.uuid) {
    errors.uuid = "UUID is missing or incorrect";
  }
  const hasErrors = Object.keys(errors).length !== 0;

  return [hasErrors, errors];
}
