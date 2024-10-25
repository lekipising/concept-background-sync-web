"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma";

export const sendToServer = async (name: string, arrival: string) => {
  const newBooking = await prisma.booking.create({
    data: {
      name,
      arrival: new Date(arrival),
    },
  });
  console.log("New booking created:", newBooking);
  revalidatePath("/");
};
