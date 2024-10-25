import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  const res = (await request.json()) as { name: string; arrival: string };
  const newBooking = await prisma.booking.create({
    data: {
      name: res.name,
      arrival: new Date(res.arrival),
    },
  });
  console.log("New booking created:", newBooking);
  return Response.json(newBooking);
}
