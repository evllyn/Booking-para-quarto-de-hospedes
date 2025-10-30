import React, { useState } from 'react';
import { Booking } from '../types';

interface BookingListProps {
  bookings: Booking[];
  onUpdateBookingStatus: (id: string, status: 'active' | 'cancelled') => void;
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', options);
};

const BookingCard: React.FC<{ booking: Booking; onUpdateStatus: (status: 'active' | 'cancelled') => void }> = ({ booking, onUpdateStatus }) => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const duration = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const handleCancel = () => {
        if (window.confirm('Tem certeza de que deseja cancelar esta reserva?')) {
            onUpdateStatus('cancelled');
        }
    };

    const handleReactivate = () => {
        if (window.confirm('Tem certeza de que deseja reativar esta reserva?')) {
            onUpdateStatus('active');
        }
    };

    const isCancelled = booking.status === 'cancelled';

    return (
        <div className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 relative ${isCancelled ? 'bg-gray-100 opacity-70' : 'bg-white hover:shadow-xl'}`}>
            <div className="p-5">
                 {isCancelled && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        CANCELADA
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4">
                    <div className={isCancelled ? 'text-gray-500' : ''}>
                        <h3 className={`text-xl font-bold ${isCancelled ? 'text-gray-600' : 'text-blue-800'}`}>{booking.guestName}</h3>
                        <p className="text-sm">{booking.guestEmail}</p>
                        <p className="text-sm">{booking.guestPhone}</p>
                    </div>
                     <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                        {booking.status === 'active' ? (
                            <button onClick={handleCancel} className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors" aria-label="Cancelar reserva">
                                Cancelar
                            </button>
                        ) : (
                             <button onClick={handleReactivate} className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors" aria-label="Reativar reserva">
                                Reativar
                            </button>
                        )}
                    </div>
                </div>
                
                {booking.notes && (
                    <div className="mb-4 pt-3 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-600">Observações:</p>
                        <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{booking.notes}</p>
                    </div>
                )}

                <div className={`border rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between text-center md:text-left ${isCancelled ? 'bg-gray-200 border-gray-300' : 'bg-gray-50 border-gray-200'}`}>
                    <div>
                        <p className="text-sm font-semibold text-gray-600">Check-in</p>
                        <p className={`text-lg font-bold ${isCancelled ? 'text-gray-600' : 'text-gray-800'}`}>{formatDate(booking.checkIn)}</p>
                    </div>
                    <div className="my-2 md:my-0 md:mx-4 text-gray-400 font-light">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto md:transform md:-rotate-90">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600">Check-out</p>
                        <p className={`text-lg font-bold ${isCancelled ? 'text-gray-600' : 'text-gray-800'}`}>{formatDate(booking.checkOut)}</p>
                    </div>
                    <div className="mt-3 md:mt-0 md:ml-6 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-6">
                        <p className="text-sm font-semibold text-gray-600">Duração</p>
                        <p className={`text-lg font-bold ${isCancelled ? 'text-gray-600' : 'text-blue-600'}`}>{duration} noite{duration > 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const BookingList: React.FC<BookingListProps> = ({ bookings, onUpdateBookingStatus }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, status: 'active' | 'cancelled') => {
    onUpdateBookingStatus(id, status);
    const message = status === 'cancelled' ? 'Reserva cancelada com sucesso.' : 'Reserva reativada com sucesso.';
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };
  
  const sortedBookings = [...bookings].sort((a, b) => {
    // Active bookings come before cancelled bookings
    if (a.status === 'active' && b.status === 'cancelled') return -1;
    if (a.status === 'cancelled' && b.status === 'active') return 1;
    // For bookings with the same status, sort by check-in date
    return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Todas as Reservas</h2>
      {successMessage && <div className="mb-4 text-green-600 bg-green-100 p-3 rounded-md text-sm">{successMessage}</div>}
      {sortedBookings.length > 0 ? (
        <div className="space-y-4">
          {sortedBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} onUpdateStatus={(status) => handleUpdateStatus(booking.id, status)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p className="text-gray-500">Nenhuma reserva encontrada. O quarto de hóspedes está disponível!</p>
        </div>
      )}
    </div>
  );
};
