
import React, { useState } from 'react';
import { Quote } from '../types';

interface ScheduleVisitModalProps {
    quote: Quote;
    onClose: () => void;
    onConfirmSchedule: (quoteId: string, visitDateTime: string) => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ quote, onClose, onConfirmSchedule }) => {
    const suggestedDate = quote.messages[quote.messages.length - 1].offerDetails?.visitDate || '';
    const [visitDate, setVisitDate] = useState(suggestedDate);
    const [visitTime, setVisitTime] = useState('09:00');
    const [isConfirming, setIsConfirming] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirming(true);

        const scheduledDateTime = `${new Date(visitDate + 'T00:00:00').toLocaleDateString()} às ${visitTime}`;

        setTimeout(() => {
            onConfirmSchedule(quote.id, scheduledDateTime);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-royal-blue mb-4 text-center">Agendar Visita Técnica</h2>
                <p className="text-center text-gray-600 mb-6">Confirme a data e hora para a visita de <span className="font-semibold">{quote.to.fullName}</span>.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="visit-date" className="block text-sm font-medium text-gray-700">Data</label>
                            <input
                                id="visit-date"
                                type="date"
                                value={visitDate}
                                onChange={(e) => setVisitDate(e.target.value)}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="visit-time" className="block text-sm font-medium text-gray-700">Hora</label>
                            <input
                                id="visit-time"
                                type="time"
                                value={visitTime}
                                onChange={(e) => setVisitTime(e.target.value)}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isConfirming} className="bg-royal-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400">
                            {isConfirming ? 'Confirmando...' : 'Confirmar Agendamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
