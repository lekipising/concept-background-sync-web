"use client";

import { Booking } from "@prisma/client";
import React from "react";

export default function PendingBookings() {
  // get pending bookings from indexedDB
  const [bookings, setBookings] = React.useState<Booking[]>([]);

  React.useEffect(() => {
    const dbRequest = indexedDB.open("bookingSyncDB", 1);

    dbRequest.onsuccess = function (event) {
      // @ts-expect-error - result is not defined on EventTarget
      const db = event?.target?.result;
      const transaction = db.transaction("bookings", "readonly");
      const store = transaction.objectStore("bookings");
      const request = store.getAll();

      request.onsuccess = function () {
        setBookings(request.result);
      };
    };
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-md">
      <h2 className="text-2xl text-gray-500 font-semibold mb-4">
        Pending Bookings
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
  );
}
