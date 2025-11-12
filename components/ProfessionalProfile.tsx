import React, { useState } from 'react';
import { Professional, Quote, Client } from '../types';
import { StarIcon, MapPinIcon } from './icons';

interface ChatModalProps {
    professional: Professional;
    client: Client;
    onClose: () => void;
    onSubmitQuote: (quote: Quote) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ professional, client, onClose, onSubmitQuote }) => {
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In real app, this would initiate a chat. Here we just simulate submission.
        console.log(`Sending message to ${professional.fullName}: ${message}`);
        setIsSent(true);
        // Simulate adding to a list of quotes after a delay
        setTimeout(() => {
            const newQuote: Quote = {
                id: `quote-${Date.now()}`,
                from: client,
                to: professional,
                messages: [{ sender: 'client', text: message, timestamp: new Date() }],
                status: 'pending'
            };
            onSubmitQuote(newQuote);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 relative transform transition-all animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <div className="text-center">
                    <img src={professional.profilePictureUrl} alt={professional.fullName} className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-royal-blue"/>
                    <h2 className="text-2xl font-bold mt-4 text-royal-blue">Solicitar Orçamento</h2>
                    <p className="text-gray-600">para <span className="font-semibold">{professional.fullName}</span></p>
                </div>
                {isSent ? (
                    <div className="text-center py-10">
                        <h3 className="text-xl font-semibold text-green-600">Solicitação Enviada!</h3>
                        <p className="text-gray-600 mt-2">{professional.fullName} responderá em breve. Você será notificado.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Descreva o serviço que você precisa:</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
                                placeholder="Ex: Preciso instalar uma tomada nova na cozinha e verificar um disjuntor que está caindo."
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-royal-blue text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors">
                            Enviar Solicitação
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

interface ProfessionalProfileProps {
  professional: Professional;
  client: Client;
  onBack: () => void;
  onSubmitQuote: (quote: Quote) => void;
}

export const ProfessionalProfile: React.FC<ProfessionalProfileProps> = ({ professional, client, onBack, onSubmitQuote }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="relative h-48 bg-royal-blue">
            <img src={`https://picsum.photos/seed/${professional.id}/1200/400`} alt="Banner" className="w-full h-full object-cover opacity-30"/>
            <button onClick={onBack} className="absolute top-6 left-6 text-white bg-black/30 px-4 py-2 rounded-full hover:bg-black/50 transition-colors">
                &larr; Voltar para a busca
            </button>
        </div>

        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="transform -translate-y-20">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                        <img src={professional.profilePictureUrl} alt={professional.fullName} className="w-32 h-32 rounded-full object-cover border-8 border-white shadow-lg"/>
                        <div className="sm:ml-6 mt-4 sm:mt-0">
                            <h1 className="text-3xl font-bold text-royal-blue">{professional.fullName}</h1>
                            <p className="text-lg text-gray-600 font-medium">{professional.profession}</p>
                            <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2 text-gray-500">
                                <div className="flex items-center">
                                    <StarIcon className="w-5 h-5 text-gold-yellow mr-1" />
                                    <span>{professional.rating.toFixed(1)} ({professional.reviewsCount} avaliações)</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPinIcon className="w-5 h-5 text-gray-400 mr-1" />
                                    <span>{professional.distance.toFixed(1)} km de você</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 sm:mt-0 sm:ml-auto">
                             <button onClick={() => setIsChatOpen(true)} className="bg-gold-yellow text-royal-blue font-bold py-3 px-8 rounded-lg text-lg shadow-md hover:bg-yellow-500 transition-transform transform hover:scale-105">
                                Solicitar Orçamento
                            </button>
                        </div>
                    </div>
                
                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Sobre o Profissional</h2>
                        <p className="text-gray-600 leading-relaxed">{professional.experience}</p>
                        <div className="mt-4 flex items-center">
                            <span className="font-semibold mr-2">Status:</span>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${professional.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {professional.isAvailable ? 'Disponível para novos serviços' : 'Ocupado no momento'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Avaliações de Clientes ({professional.reviewsCount})</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {professional.reviews.length > 0 ? professional.reviews.map((review, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-md border-l-4 border-gold-yellow">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800">{review.clientName}</p>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-gold-yellow' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    {review.comment && <p className="text-gray-600 mt-2 italic">"{review.comment}"</p>}
                                    <p className="text-xs text-gray-400 mt-2 text-right">{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                            )) : (
                                <p className="text-gray-500">Este profissional ainda não recebeu avaliações.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {isChatOpen && <ChatModal professional={professional} client={client} onClose={() => setIsChatOpen(false)} onSubmitQuote={onSubmitQuote} />}
    </div>
  );
};