import React, { useState, useRef, useEffect } from 'react';
import { Quote, User, QuoteMessage, UserRole } from '../types';

interface ChatDialogProps {
    quote: Quote;
    currentUser: User;
    onClose: () => void;
    onSendMessage: (quoteId: string, message: QuoteMessage) => void;
    onCompleteService?: (quoteId: string) => void;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({ quote, currentUser, onClose, onSendMessage, onCompleteService }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const otherUser = currentUser.role === UserRole.CLIENT ? quote.to : quote.from;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [quote.messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message: QuoteMessage = {
                sender: currentUser.role === UserRole.CLIENT ? 'client' : 'professional',
                text: newMessage,
                timestamp: new Date(),
            };
            onSendMessage(quote.id, message);
            setNewMessage('');
        }
    };

    const handleComplete = () => {
        if (onCompleteService) {
            onCompleteService(quote.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg h-[80vh] flex flex-col p-6">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <div>
                        <h2 className="text-xl font-bold text-royal-blue">Conversa com</h2>
                        <p className="font-semibold">{otherUser.fullName}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-3xl hover:text-gray-800">&times;</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-2">
                    {quote.messages.map((msg, index) => {
                        const isCurrentUser = (currentUser.role === UserRole.CLIENT && msg.sender === 'client') || (currentUser.role === UserRole.PROFESSIONAL && msg.sender === 'professional');
                        
                        if (msg.isOffer && msg.offerDetails) {
                            return (
                                <div key={index} className="my-4 text-center">
                                    <div className="inline-block bg-gold-yellow/20 border border-gold-yellow text-royal-blue p-3 rounded-lg max-w-sm shadow-sm">
                                        <p className="font-bold text-center">📝 Proposta de Orçamento</p>
                                        <p className="text-sm mt-1">{msg.text}</p>
                                        <div className="mt-2 pt-2 border-t border-gold-yellow/50 text-left">
                                            <p><strong>Valor do Serviço:</strong> R$ {msg.offerDetails.value.toFixed(2)}</p>
                                            {msg.offerDetails.visitFee && msg.offerDetails.visitFee > 0 && (
                                                <p className="font-semibold text-red-700">
                                                    <strong>Taxa de Visita:</strong> R$ {msg.offerDetails.visitFee.toFixed(2)}
                                                </p>
                                            )}
                                            <p><strong>Data Sugerida:</strong> {new Date(msg.offerDetails.visitDate + 'T00:00:00').toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow-sm ${isCurrentUser ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 border-t pt-4">
                    {currentUser.role === UserRole.PROFESSIONAL && quote.status === 'scheduled' && onCompleteService && (
                        <div className="mb-4">
                            <button
                                onClick={handleComplete}
                                className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Marcar Serviço como Concluído
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSend} className="flex">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                        />
                        <button type="submit" className="bg-royal-blue text-white font-bold px-6 rounded-r-lg hover:bg-blue-800 transition-colors">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};