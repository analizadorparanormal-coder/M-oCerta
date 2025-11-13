import React, { useState } from 'react';
import { Quote } from '../types';

interface PreliminaryVisitModalProps {
    quote: Quote;
    onClose: () => void;
    onSubmit: (quoteId: string, visitDetails: { date: string; time: string; fee: number; message: string }) => void;
}

export const PreliminaryVisitModal: React.FC<PreliminaryVisitModalProps> = ({ quote, onClose, onSubmit }) => {
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
    const [visitTime, setVisitTime] = useState('09:00');
    const [chargeFee, setChargeFee] = useState(false);
    const [visitFee, setVisitFee] = useState(50);
    const [message, setMessage] = useState('Gostaria de agendar uma visita técnica para avaliar o serviço e fornecer um orçamento preciso.');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(quote.id, {
            date: visitDate,
            time: visitTime,
            fee: chargeFee ? visitFee : 0,
            message,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-royal-blue text-center">Agendar Visita Técnica</h2>
                    <p className="text-center text-gray-600">Para: <span className="font-semibold">{quote.from.fullName}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Data da Visita</label>
                            <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Horário</label>
                            <input type="time" value={visitTime} onChange={e => setVisitTime(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                    </div>
                    
                    <div>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={chargeFee} onChange={e => setChargeFee(e.target.checked)} className="h-4 w-4 rounded text-royal-blue focus:ring-royal-blue"/>
                            <span className="text-sm font-medium text-gray-700">Cobrar taxa de visita?</span>
                        </label>
                         {chargeFee && (
                            <div className="mt-2 ml-6">
                                <label className="block text-sm font-medium text-gray-700">Valor da Taxa (R$)</label>
                                <input type="number" value={visitFee} onChange={e => setVisitFee(parseFloat(e.target.value) || 0)} className="mt-1 block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm"/>
                                <p className="text-xs text-gray-500 mt-1">Este valor será cobrado apenas se o orçamento for recusado após a visita.</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mensagem para o cliente</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue" placeholder="Escreva uma breve mensagem..."/>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
                        <button type="submit" className="bg-royal-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors">Enviar Proposta de Visita</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
