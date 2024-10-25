self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("<https://your-website.com>"));
});

self.addEventListener("sync", function (event) {
  if (event.tag === "sync-new-booking") {
    event.waitUntil(syncBookingsToServer());
  }
});

// Function to sync bookings
async function syncBookingsToServer() {
  const dbRequest = indexedDB.open("bookingSyncDB", 1);

  dbRequest.onsuccess = async function (event) {
    const db = event.target.result;
    const transaction = db.transaction("bookings", "readwrite");
    const store = transaction.objectStore("bookings");

    const allBookingsRequest = store.getAll();

    allBookingsRequest.onsuccess = async function () {
      const bookings = allBookingsRequest.result;

      if (bookings.length > 0) {
        for (const booking of bookings) {
          try {
            // Send booking data to API
            const response = await fetch("/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(booking),
            });

            if (response.ok) {
              // Remove booking from IndexedDB if synced successfully
              store.delete(booking.id);
            }
          } catch (error) {
            console.error("Failed to sync booking:", error);
            // If one fails, exit loop to try again in the next sync attempt
            break;
          }
        }
      }
    };
  };
}
