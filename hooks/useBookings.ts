
import { useState, useEffect, useCallback } from 'react';
import { Booking } from '../types';

const BOOKINGS_STORAGE_KEY = 'guestRoomBookings';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (storedBookings) {
        const parsedBookings: any[] = JSON.parse(storedBookings);
        // Basic validation & migration for older bookings without status
        if (Array.isArray(parsedBookings)) {
           const migratedBookings = parsedBookings.map(b => ({
               ...b,
               status: b.status || 'active', // Add status if it's missing
           }));
           setBookings(migratedBookings);
        }
      }
    } catch (error) {
      console.error("Failed to load bookings from localStorage", error);
      localStorage.removeItem(BOOKINGS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
       console.error("Failed to save bookings to localStorage", error);
    }
  }, [bookings]);

  const addBooking = useCallback((newBooking: Omit<Booking, 'id' | 'status'>) => {
    const bookingWithId: Booking = {
      ...newBooking,
      id: new Date().toISOString() + Math.random(),
      status: 'active',
    };
    setBookings(prevBookings => [...prevBookings, bookingWithId]);
  }, []);

  const updateBookingStatus = useCallback((bookingId: string, status: 'active' | 'cancelled') => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  }, []);


  return { bookings, addBooking, updateBookingStatus };
};
