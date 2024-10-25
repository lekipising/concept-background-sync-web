"use client";

import React from "react";

import { sendToServer } from "../api/bookings";

export default function CreateBooking() {
  const [name, setName] = React.useState("");
  const [arrival, setArrival] = React.useState("");

  const queueBookingOnIndexDB = async () => {
    const dbRequest = indexedDB.open("bookingSyncDB", 1);

    dbRequest.onupgradeneeded = function (event) {
      // @ts-expect-error - result is not defined on EventTarget
      const db = event?.target?.result;
      db.createObjectStore("bookings", { keyPath: "id", autoIncrement: true });
    };

    dbRequest.onsuccess = function (event) {
      // @ts-expect-error - result is not defined on EventTarget
      const db = event?.target?.result;
      const transaction = db.transaction("bookings", "readwrite");
      const store = transaction.objectStore("bookings");
      store.add({ name, arrival });
    };
    window.alert("Booking queued for sync!");
  };

  function sendBookingToServer() {
    sendToServer(name, arrival)
      .then(() => {
        window.alert("Booking sent to server");
      })
      .catch((error) => {
        console.error("Failed to send booking to server", error);
        window.alert("Failed to send booking to server");
      });
  }

  const sendBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready
        .then(function (reg) {
          queueBookingOnIndexDB();
          // @ts-expect-error - sync is not defined on ServiceWorkerRegistration
          reg.sync
            .register("sync-new-booking")
            .then(() => {
              console.log("Sync registered");
              window.alert("Sync registered");
            })
            .catch((error) => {
              console.error("Failed to register sync", error);
              sendBookingToServer();
            });
        })
        .catch(function (error) {
          console.error("Failed to register sync", error);
          window.alert("Failed to register sync");
          sendBookingToServer();
        });
    } else {
      console.log("Sync not supported");
      window.alert("Sync not supported");
      sendBookingToServer();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-md">
      <h2 className="text-2xl text-gray-500 font-semibold mb-4">
        Create New Booking
      </h2>
      <form className="space-y-4" onSubmit={sendBooking}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date & Time
          </label>
          <input
            type="datetime-local"
            className="mt-1 block w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}
