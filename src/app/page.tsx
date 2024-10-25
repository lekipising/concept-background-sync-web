import CreateBooking from "./components/create.booking";
import prisma from "./lib/prisma";

export default async function BookingApp() {
  const bookings = await prisma.booking.findMany();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Simple Booking App
      </h1>

      <CreateBooking />

      <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
        {bookings.length > 0 ? (
          <ul className="space-y-3">
            {bookings.map((booking, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-md shadow">
                <p className="text-lg font-medium">{booking.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.arrival).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No bookings yet.</p>
        )}
      </div>

      {/* <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          Pending Bookings (Awaiting Sync)
        </h2>
        {[].length > 0 ? (
          <ul className="space-y-3">
            {[].map((booking, index) => (
              <li key={index} className="bg-yellow-50 p-4 rounded-md shadow">
                <p className="text-lg font-medium">{booking.name}</p>
                <p className="text-sm text-yellow-600">{booking.datetime}</p>
                <p className="text-sm text-yellow-500">Pending Sync...</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No pending bookings.</p>
        )}
      </div> */}
    </div>
  );
}
