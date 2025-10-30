import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { NotificationBanner } from './components/NotificationBanner';
import { useBookings } from './hooks/useBookings';
import { Booking } from './types';

const App: React.FC = () => {
  const { bookings, addBooking, updateBookingStatus } = useBookings();
  const [notificationBooking, setNotificationBooking] = useState<Booking | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const NOTIFICATION_DISMISSED_KEY_PREFIX = 'notificationDismissed_';

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to the beginning of the day

    const upcomingBookings = bookings
      .filter(b => new Date(b.checkOut) >= today && b.status === 'active') // Filter out past & cancelled bookings
      .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

    if (upcomingBookings.length > 0) {
      const nextBooking = upcomingBookings[0];
      const checkInDate = new Date(nextBooking.checkIn);
      
      const diffTime = checkInDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Check if the booking is within the next 7 days (and is not in the past)
      if (diffDays >= 0 && diffDays <= 7) {
        const dismissedKey = `${NOTIFICATION_DISMISSED_KEY_PREFIX}${nextBooking.id}`;
        if (!sessionStorage.getItem(dismissedKey)) {
          setNotificationBooking(nextBooking);
          setShowNotification(true);
        }
      }
    }
  }, [bookings]);
  
  const handleDismissNotification = () => {
    if (notificationBooking) {
      sessionStorage.setItem(`notificationDismissed_${notificationBooking.id}`, 'true');
    }
    setShowNotification(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header />
      {showNotification && notificationBooking && (
        <NotificationBanner booking={notificationBooking} onClose={handleDismissNotification} />
      )}
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <BookingForm existingBookings={bookings} onAddBooking={addBooking} />
          </div>
          <div className="lg:col-span-2">
            <BookingList bookings={bookings} onUpdateBookingStatus={updateBookingStatus} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
