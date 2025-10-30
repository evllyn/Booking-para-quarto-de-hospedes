import React from 'react';
import { Booking } from '../types';

interface NotificationBannerProps {
  booking: Booking;
  onClose: () => void;
}

const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    // Add T00:00:00 to ensure the date is parsed in the local timezone, not UTC
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', options);
};

const getDaysUntil = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(dateString);
    const diffTime = checkInDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getDayMessage = (days: number): string => {
    if (days < 0) return "iniciou"; // Should not happen with current logic, but for safety
    if (days === 0) return "hoje";
    if (days === 1) return "amanhã";
    return `em ${days} dias`;
};

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ booking, onClose }) => {
    const daysUntil = getDaysUntil(booking.checkIn);

    return (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800" role="alert">
            <div className="container mx-auto p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <div>
                        <p className="font-bold">Lembrete de Reserva Próxima</p>
                        <p className="text-sm">A reserva de <strong>{booking.guestName}</strong> começa {getDayMessage(daysUntil)} ({formatDate(booking.checkIn)}).</p>
                    </div>
                </div>
                <button onClick={onClose} aria-label="Dispensar notificação" className="p-1 rounded-full hover:bg-blue-200 transition-colors">
                    <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Fechar</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </button>
            </div>
        </div>
    );
};
