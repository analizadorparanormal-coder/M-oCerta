import React, { useState } from 'react';
import { Quote } from '../types';
import { StarIcon } from './icons';

interface ReviewModalProps {
    quote: Quote;
    onClose: () => void;
    onSubmitReview: (quoteId: string, rating: number, comment: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ quote, onClose, onSubmitReview }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Por favor, selecione uma avaliação de 1 a 5 estrelas.');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => { // Simulate API call
            onSubmitReview(quote.id, rating, comment);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-royal-blue mb-2 text-center">Avaliar Profissional</h2>
                <p className="text-center text-gray-600 mb-6">Deixe sua avaliação para <span className="font-semibold">{quote.to.fullName}</span>.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Sua nota</label>
                        <div className="flex justify-center items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className={`w-10 h-10 cursor-pointer transition-colors ${
                                        (hoverRating || rating) >= star ? 'text-gold-yellow' : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comentário (opcional)</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
                            placeholder="Descreva sua experiência com o profissional..."
                        />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting || rating === 0} className="bg-royal-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400">
                            {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};