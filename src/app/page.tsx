import CreateBooking from "./components/create.booking";
import PendingBookings from "./components/pending";
import prisma from "./lib/prisma";

export default async function BookingApp() {
  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Simple Booking App
      </h1>

      <CreateBooking />

      <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-md">
        <h2 className="text-2xl text-gray-500 font-semibold mb-4">
          Your Bookings
        </h2>
        {bookings.length > 0 ? (
          <ul className="space-y-3">
            {bookings.map((booking, index) => (
              <li key={index} className="bg-gray-500 p-4 rounded-md shadow">
                <p className="text-lg font-medium">{booking.name}</p>
                <p className="text-sm text-gray-200">
                  {new Date(booking.arrival).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No bookings yet.</p>
        )}
      </div>

      <PendingBookings />
    </div>
  );
}
