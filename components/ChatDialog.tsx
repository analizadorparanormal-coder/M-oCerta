import React, { useState, useRef, useEffect } from 'react';
import { Quote, User, QuoteMessage, UserRole } from '../types';
import { CheckCircleIcon } from './icons';

interface ChatDialogProps {
    quote: Quote;
    currentUser: User;
    onClose: () => void;
    onSendMessage: (quoteId: string, message: QuoteMessage) => void;
    onCompleteService?: (quoteId: string) => void;
    onMarkAsRead: (quoteId: string) => void;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({ quote, currentUser, onClose, onSendMessage, onCompleteService, onMarkAsRead }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const otherUser = currentUser.role === UserRole.CLIENT ? quote.to : quote.from;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [quote.messages, isTyping]);

    // Effect for simulating typing and reading by the other user
    useEffect(() => {
        const lastMessage = quote.messages[quote.messages.length - 1];
        if (!lastMessage) return;

        const isLastMessageFromCurrentUser = (currentUser.role === UserRole.CLIENT && lastMessage.sender === 'client') || (currentUser.role === UserRole.PROFESSIONAL && lastMessage.sender === 'professional');

        if (isLastMessageFromCurrentUser && !lastMessage.isRead) {
            // Simulate other user seeing and typing
            const typingTimer = setTimeout(() => {
                setIsTyping(true);
            }, 1500);

            // Simulate other user finishing typing
            const stopTypingTimer = setTimeout(() => {
                setIsTyping(false);
            }, 4500); // Typing for 3s

            // Simulate other user reading the message
            const readTimer = setTimeout(() => {
                onMarkAsRead(quote.id);
            }, 2000); // Mark as read after 2s

            return () => {
                clearTimeout(typingTimer);
                clearTimeout(stopTypingTimer);
                clearTimeout(readTimer);
            };
        } else {
            // If last message is from other user, make sure typing indicator is off
            setIsTyping(false);
        }
    }, [quote.messages, quote.id, currentUser.role, onMarkAsRead]);


    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message: QuoteMessage = {
                sender: currentUser.role === UserRole.CLIENT ? 'client' : 'professional',
                text: newMessage,
                timestamp: new Date(),
                isRead: false,
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
            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .typing-dot {
                    width: 6px;
                    height: 6px;
                    background-color: #9ca3af;
                    border-radius: 50%;
                    animation: bounce 1.2s infinite ease-in-out;
                }
                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-400 { animation-delay: 0.4s; }
            `}</style>
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
                        const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        
                        if (msg.isOffer && msg.offerDetails) {
                            return (
                                <div key={index} className="my-4 text-center">
                                    <div className="inline-block bg-gold-yellow/20 border border-gold-yellow text-royal-blue p-3 rounded-lg max-w-md shadow-sm text-left">
                                        <p className="font-bold text-center mb-2">📝 Proposta de Orçamento</p>
                                        <p className="text-sm text-gray-800 italic mb-2">"{msg.text}"</p>
                                        
                                        <div className="text-sm space-y-1 text-gray-800">
                                            <div className="flex justify-between">
                                                <span>Mão de Obra:</span>
                                                <span>{formatCurrency(msg.offerDetails.laborCost)}</span>
                                            </div>

                                            {msg.offerDetails.materials.length > 0 && (
                                            <div>
                                                <span className="font-semibold">Materiais:</span>
                                                <ul className="list-disc list-inside pl-2 text-xs">
                                                {msg.offerDetails.materials.map((item, i) => (
                                                    <li key={i} className="flex justify-between">
                                                    <span>{item.name}</span>
                                                    <span>{formatCurrency(item.price)}</span>
                                                    </li>
                                                ))}
                                                </ul>
                                            </div>
                                            )}

                                            {msg.offerDetails.visitFee > 0 && (
                                            <div className="flex justify-between text-red-700">
                                                <span className="font-semibold">Taxa de Visita:</span>
                                                <span className="font-semibold">{formatCurrency(msg.offerDetails.visitFee)}</span>
                                            </div>
                                            )}

                                            <div className="flex justify-between font-bold border-t border-gold-yellow/50 pt-1 mt-1">
                                                <span>TOTAL:</span>
                                                <span>{formatCurrency(msg.offerDetails.total)}</span>
                                            </div>
                                        </div>
                                         <p className="text-sm text-gray-800 mt-2">
                                            <strong>Data Sugerida:</strong> {new Date(msg.offerDetails.visitDate + 'T00:00:00').toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow-sm ${isCurrentUser ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p>{msg.text}</p>
                                    <div className={`text-xs mt-1 flex items-center justify-end ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        {isCurrentUser && <CheckCircleIcon className={`w-4 h-4 ml-1 ${msg.isRead ? 'text-blue-300' : 'text-gray-400'}`} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="max-w-xs lg:max-w-md p-3 rounded-lg shadow-sm bg-gray-200 text-gray-800">
                                <div className="flex items-center space-x-1 h-5">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot animation-delay-200"></span>
                                    <span className="typing-dot animation-delay-400"></span>
                                </div>
                            </div>
                        </div>
                    )}
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