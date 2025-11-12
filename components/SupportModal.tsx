import React, { useState } from 'react';
import { User } from '../types';

interface SupportModalProps {
    user: User;
    onClose: () => void;
    onSubmit: (subject: string, message: string) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ user, onClose, onSubmit }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message) {
            alert('Por favor, preencha o assunto e a mensagem.');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => { // Simulate API call
            onSubmit(subject, message);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h2 className="text-2xl font-bold text-royal-blue mb-4 text-center">Contato com Suporte</h2>
                <p className="text-center text-gray-600 mb-6">Nossa equipe responderá o mais breve possível.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Assunto</label>
                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-royal-blue"
                            placeholder="Ex: Dúvida sobre cobrança"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Sua mensagem</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-royal-blue"
                            placeholder="Descreva sua dúvida ou problema..."
                            required
                        />
                    </div>
                    <div className="pt-2 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="bg-royal-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400">
                            {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};