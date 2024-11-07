import { BookingData } from "../../types/booking";
import { ErrorObject } from "@/types/error";

export function validateBookingData(data: BookingData): [boolean, ErrorObject] {
  let errors: ErrorObject = {};

  if (!data.propertyId) {
    errors.propertyId = "Property ID is required.";
  }

  if (!data.customerId) { 
    errors.customerId = "Customer ID is required.";
  }

  const checkin = new Date(data.checkinDate);
  const checkout = new Date(data.checkoutDate);
  const numberOfNights = (checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24);

  if (isNaN(checkin.getTime()) || isNaN(checkout.getTime())) {
    errors.date = "Invalid date format.";
  }

  if (numberOfNights <= 0) {
    errors.dates = "Invalid check-in and check-out dates.";
  }

  const hasErrors = Object.keys(errors).length > 0;

  return [hasErrors, errors];
}
