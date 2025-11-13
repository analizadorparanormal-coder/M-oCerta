import React, { useState } from 'react';
import { Quote } from '../types';
import { MapPinIcon } from './icons';

interface NavigationModalProps {
    quote: Quote;
    onClose: () => void;
    onSendUpdate: (quoteId: string, message: string) => void;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({ quote, onClose, onSendUpdate }) => {
    const [updateMessage, setUpdateMessage] = useState('');
    const [updateSent, setUpdateSent] = useState(false);

    const handleSend = () => {
        if (updateMessage.trim()) {
            onSendUpdate(quote.id, updateMessage);
            setUpdateMessage('');
            setUpdateSent(true);
            setTimeout(() => setUpdateSent(false), 3000); // Reset after 3s
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-royal-blue">Navegando para o Cliente</h2>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-800">&times;</button>
                </div>
                <div className="mb-4">
                    <p><strong>Destino:</strong> {quote.from.fullName}</p>
                    <p><strong>Endereço:</strong> {quote.from.address}</p>
                </div>
                <div className="bg-gray-200 h-80 w-full rounded-lg relative overflow-hidden shadow-inner">
                    <img 
                        src="https://www.medjugorje-news.com/wp-content/uploads/2021/08/google-maps.jpg" 
                        alt="Mapa simulado" 
                        className="w-full h-full object-cover opacity-80"
                    />
                    {/* Start Pin */}
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <MapPinIcon className="w-8 h-8 text-blue-600 drop-shadow-lg" />
                        <span className="text-xs font-bold bg-white text-blue-600 px-2 py-0.5 rounded-full shadow-md">Você</span>
                    </div>
                    {/* End Pin */}
                     <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <MapPinIcon className="w-8 h-8 text-red-600 drop-shadow-lg" />
                        <span className="text-xs font-bold bg-white text-red-600 px-2 py-0.5 rounded-full shadow-md">Cliente</span>
                    </div>
                     {/* Route Line (SVG) */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path 
                            d="M 25 25 Q 50 5, 75 75" 
                            stroke="rgba(0, 51, 160, 0.7)" 
                            strokeWidth="1" 
                            fill="none" 
                            strokeDasharray="2 1"
                        />
                    </svg>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold text-gray-700 mb-2">Enviar atualização para o cliente</h3>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={updateMessage}
                            onChange={(e) => setUpdateMessage(e.target.value)}
                            placeholder="Ex: Chego em 5 minutos!"
                            className="flex-1 p-2 border rounded-md focus:ring-royal-blue focus:border-royal-blue"
                        />
                        <button
                            onClick={handleSend}
                            disabled={updateSent}
                            className="bg-gold-yellow text-royal-blue font-bold px-4 rounded-lg hover:bg-yellow-500 disabled:bg-gray-400"
                        >
                            {updateSent ? 'Enviado!' : 'Enviar'}
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-right">
                     <button onClick={onClose} className="bg-royal-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-800">
                        Fechar Navegação
                    </button>
                </div>
            </div>
        </div>
    );
};