import { Property } from "@prisma/client";

export type PropertyData = Omit<Property, "id" | "createdById" | "bookings">;

export type PropertyCreateData = Omit<PropertyData, "createdBy"> & {
  createdById: string;
};

export type PropertyUpdateData = Partial<PropertyData>;
