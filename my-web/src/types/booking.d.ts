import { Booking } from "@prisma/client";

export type BookingData = Omit<Booking, "id" | "createdAt" | "updatedAt"> & {
  propertyId: string;
  customerId: string; 
};

export type BookingUpdateData = Partial<BookingData>;
