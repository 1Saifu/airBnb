import { Booking } from "@prisma/client";

export type BookingData = Omit<Booking, "id" | "createdAt" | "updatedAt"> & {
  propertyId: string;
  customer: {
    id: string;
    createdById: string;
  };
};

export type BookingUpdateData = Partial<BookingData>;
