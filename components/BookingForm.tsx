import React, { useState, FormEvent } from 'react';
import { Booking } from '../types';

interface BookingFormProps {
  onAddBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  existingBookings: Booking[];
}

export const BookingForm: React.FC<BookingFormProps> = ({ onAddBooking, existingBookings }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearForm = () => {
    setCheckIn('');
    setCheckOut('');
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setNotes('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!checkIn || !checkOut || !guestName || !guestEmail || !guestPhone) {
      setError('Todos os campos, exceto observações, são obrigatórios.');
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      setError('A data de check-out deve ser posterior à data de check-in.');
      return;
    }

    // Check for overlapping bookings, ignoring cancelled ones
    const isOverlapping = existingBookings
      .filter(booking => booking.status === 'active')
      .some(booking => {
        const existingStart = new Date(booking.checkIn);
        const existingEnd = new Date(booking.checkOut);
        // New booking starts during an existing booking
        if (checkInDate >= existingStart && checkInDate < existingEnd) return true;
        // New booking ends during an existing booking
        if (checkOutDate > existingStart && checkOutDate <= existingEnd) return true;
        // New booking encapsulates an existing booking
        if (checkInDate <= existingStart && checkOutDate >= existingEnd) return true;
        return false;
    });

    if (isOverlapping) {
      setError('Estas datas entram em conflito com uma reserva existente.');
      return;
    }

    onAddBooking({ checkIn, checkOut, guestName, guestEmail, guestPhone, notes });
    setSuccess('Reserva efetuada com sucesso!');
    clearForm();
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Adicionar Nova Reserva</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkin" className="block text-sm font-medium text-gray-600">Check-in</label>
            <input type="date" id="checkin" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="checkout" className="block text-sm font-medium text-gray-600">Check-out</label>
            <input type="date" id="checkout" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-600">Nome do Hóspede</label>
          <input type="text" id="guestName" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="João da Silva" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-600">Email</label>
          <input type="email" id="guestEmail" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="joao.silva@exemplo.com" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-600">Telefone</label>
          <input type="tel" id="guestPhone" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="(XX) XXXXX-XXXX" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-600">Observações (Opcional)</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ex: Alergia a gatos, chega tarde da noite..." rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        
        {error && <div className="text-red-600 bg-red-100 p-3 rounded-md text-sm">{error}</div>}
        {success && <div className="text-green-600 bg-green-100 p-3 rounded-md text-sm">{success}</div>}
        
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out">
          Confirmar Reserva
        </button>
      </form>
    </div>
  );
};
