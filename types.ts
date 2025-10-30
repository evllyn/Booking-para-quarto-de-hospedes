export interface Booking {
  id: string;
  checkIn: string; // Stored as 'YYYY-MM-DD'
  checkOut: string; // Stored as 'YYYY-MM-DD'
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string; // Optional field for additional details
  status: 'active' | 'cancelled';
}
