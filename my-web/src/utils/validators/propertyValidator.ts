import { PropertyCreateData, PropertyUpdateData } from "../../types/property";
import { ErrorObject } from "@/types/error";

export function validatePropertyCreateData(data: PropertyCreateData): [boolean, ErrorObject] {
  let errors: ErrorObject = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = "Invalid property name.";
  }
  if (!data.description || typeof data.description !== "string") {
    errors.description = "Invalid property description.";
  }
  if (typeof data.pricePerNight !== "number" || data.pricePerNight <= 0) {
    errors.pricePerNight = "Invalid price per night.";
  }
  if (typeof data.availability !== "boolean") {
    errors.availability = "Invalid availability status.";
  }

  const hasErrors = Object.keys(errors).length > 0;
  return [hasErrors, errors];
}

export function validatePropertyUpdateData(data: PropertyUpdateData): [boolean, ErrorObject] {
  let errors: ErrorObject = {};

  if (data.name && typeof data.name !== "string") {
    errors.name = "Invalid property name.";
  }
  if (data.description && typeof data.description !== "string") {
    errors.description = "Invalid property description.";
  }
  if (data.pricePerNight && (typeof data.pricePerNight !== "number" || data.pricePerNight <= 0)) {
    errors.pricePerNight = "Invalid price per night.";
  }
  if (data.availability !== undefined && typeof data.availability !== "boolean") {
    errors.availability = "Invalid availability status.";
  }

  const hasErrors = Object.keys(errors).length > 0;
  return [hasErrors, errors];
}
