import React, { useState } from 'react';
// FIX: Import Client type to correctly type uniqueClients array.
import { Professional, Quote, QuoteMessage, Client } from '../types';
import { StarIcon, UserCircleIcon, PhoneIcon, QuestionMarkCircleIcon, PaperAirplaneIcon } from './icons';

interface QuoteResponseModalProps {
    quote: Quote;
    onClose: () => void;
    onRespond: (quoteId: string, response: QuoteMessage) => void;
}

const QuoteResponseModal: React.FC<QuoteResponseModalProps> = ({ quote, onClose, onRespond }) => {
    const [responseText, setResponseText] = useState('');
    const [offerValue, setOfferValue] = useState('');
    const [visitDate, setVisitDate] = useState('');
    const [chargeForVisit, setChargeForVisit] = useState(false);
    const [visitFeeValue, setVisitFeeValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const newResponse: QuoteMessage = {
            sender: 'professional',
            text: responseText,
            timestamp: new Date(),
            isOffer: true,
            offerDetails: {
                value: Number(offerValue),
                visitDate: visitDate,
                ...(chargeForVisit && { visitFee: Number(visitFeeValue) })
            }
        };
        
        // Simulate API call delay
        setTimeout(() => {
            onRespond(quote.id, newResponse);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-royal-blue">Responder Orçamento</h2>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-800">&times;</button>
                </div>
                <div className="mb-4 bg-gray-50 p-3 rounded-md">
                    <p className="font-semibold">Cliente: {quote.from.fullName}</p>
                    <p className="text-sm text-gray-600 italic">"{quote.messages[0].text}"</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sua Resposta / Mensagem Adicional</label>
                        <textarea
                            value={responseText}
                            onChange={e => setResponseText(e.target.value)}
                            rows={3}
                            className="w-full p-2 border rounded-md"
                            placeholder="Ex: Olá! O valor para este serviço é..."
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Valor do Serviço (R$)</label>
                            <input
                                type="number"
                                value={offerValue}
                                onChange={e => setOfferValue(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="150,00"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Data Sugerida para Visita</label>
                            <input
                                type="date"
                                value={visitDate}
                                onChange={e => setVisitDate(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md border">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={chargeForVisit}
                                onChange={e => setChargeForVisit(e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-royal-blue focus:ring-royal-blue"
                            />
                            <span className="font-medium text-gray-700">Cobrar pela visita?</span>
                        </label>
                        {chargeForVisit && (
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700">Valor da Visita (R$)</label>
                                <input
                                    type="number"
                                    value={visitFeeValue}
                                    onChange={e => setVisitFeeValue(e.target.value)}
                                    className="w-full p-2 border rounded-md mt-1"
                                    placeholder="50,00"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Este valor será cobrado apenas pela visita técnica, caso o orçamento do serviço não seja aprovado.</p>
                            </div>
                        )}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-gold-yellow text-royal-blue font-bold py-3 rounded-lg hover:bg-yellow-500 disabled:bg-gray-300">
                        {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
                    </button>
                </form>
            </div>
        </div>
    );
};

interface ProfessionalDashboardProps {
  professional: Professional;
  quotes: Quote[];
  onLogout: () => void;
  onRespondToQuote: (quoteId: string, response: QuoteMessage) => void;
  onOpenChat: (quote: Quote) => void;
  onCompleteService: (quoteId: string) => void;
  onOpenSupport: () => void;
  onStartNavigation: (quoteId: string) => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ professional, quotes, onLogout, onRespondToQuote, onOpenChat, onCompleteService, onOpenSupport, onStartNavigation }) => {
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    const pendingQuotes = quotes.filter(q => q.to.id === professional.id && q.status === 'pending');
    const answeredQuotes = quotes.filter(q => q.to.id === professional.id && q.status !== 'pending');
    
    const activeClientsQuotes = quotes.filter(q => 
        q.to.id === professional.id && 
        ['accepted', 'scheduled', 'completed'].includes(q.status)
    );

    // FIX: Explicitly typed the `Map` constructor to ensure correct type inference for `uniqueClients`, resolving the TypeScript error.
    const uniqueClients: Client[] = Array.from(
        new Map<string, Client>(activeClientsQuotes.map(q => [q.from.id, q.from])).values()
    );


  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
            <div className="w-10 h-10 bg-gold-yellow text-royal-blue rounded-full flex items-center justify-center font-bold text-xl">M</div>
            <h1 className="text-2xl font-bold text-royal-blue ml-3">Painel do Profissional</h1>
        </div>
        <div className="flex items-center space-x-4">
            <span className="font-semibold hidden sm:block">Olá, {professional.fullName.split(' ')[0]}!</span>
            <button onClick={onOpenSupport} className="text-royal-blue font-semibold hover:underline px-2 py-1 flex items-center space-x-1">
                <QuestionMarkCircleIcon className="w-5 h-5" />
                <span className="hidden md:inline">Suporte</span>
            </button>
            <button onClick={onLogout} className="bg-royal-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors">Sair</button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col items-center text-center">
                    <img src={professional.profilePictureUrl} alt={professional.fullName} className="w-24 h-24 rounded-full object-cover border-4 border-gold-yellow"/>
                    <h2 className="text-2xl font-bold mt-4 text-royal-blue">{professional.fullName}</h2>
                    <p className="text-gray-600">{professional.profession}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                        <StarIcon className="w-5 h-5 text-gold-yellow mr-1" />
                        <span>{professional.rating.toFixed(1)} ({professional.reviewsCount} avaliações)</span>
                    </div>
                     <div className="mt-4 w-full text-left space-y-2">
                        <p className="flex justify-between"><strong>Clientes Ativos:</strong> <span>{uniqueClients.length}</span></p>
                        <p className="flex justify-between"><strong>Status:</strong> <span className={`font-semibold ${professional.isAvailable ? 'text-green-600' : 'text-red-600'}`}>{professional.isAvailable ? 'Disponível' : 'Ocupado'}</span></p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Novas Solicitações de Orçamento ({pendingQuotes.length})</h3>
                    <div className="space-y-4">
                        {pendingQuotes.length > 0 ? pendingQuotes.map(quote => (
                            <div key={quote.id} className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <UserCircleIcon className="w-6 h-6 text-gray-400 mr-2"/>
                                            <p className="font-bold text-royal-blue">{quote.from.fullName}</p>
                                        </div>
                                        <p className="text-gray-700 italic">"{quote.messages[0].text}"</p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <button onClick={() => setSelectedQuote(quote)} className="bg-gold-yellow text-royal-blue font-semibold px-4 py-2 rounded-md whitespace-nowrap hover:bg-yellow-500 w-full text-center">
                                            Responder com Oferta
                                        </button>
                                        <button onClick={() => onOpenChat(quote)} className="bg-gray-200 text-gray-700 font-semibold px-4 py-1 rounded-md text-sm hover:bg-gray-300 w-full text-center">
                                            Ver Conversa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="bg-white p-4 rounded-lg shadow-md text-gray-500">Nenhuma nova solicitação no momento.</p>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Carteira de Clientes Ativos</h3>
                     <div className="space-y-4">
                        {uniqueClients.length > 0 ? uniqueClients.map(client => (
                            <div key={client.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <p className="font-bold text-gray-800">{client.fullName}</p>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <PhoneIcon className="w-5 h-5"/>
                                    <span>{client.phone}</span>
                                </div>
                            </div>
                        )) : (
                             <p className="bg-white p-4 rounded-lg shadow-md text-gray-500">Nenhum cliente ativo na sua carteira no momento.</p>
                        )}
                    </div>
                </div>

                 <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Histórico de Orçamentos</h3>
                     <div className="space-y-4">
                        {answeredQuotes.length > 0 ? answeredQuotes.map(quote => (
                            <div key={quote.id} className="bg-white p-4 rounded-lg shadow-md opacity-90">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-gray-700">{quote.from.fullName}</p>
                                        <p className="text-sm text-gray-500 italic">"{quote.messages[0].text}"</p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2 text-right">
                                        {quote.status === 'scheduled' && !quote.professionalEnRoute ? (
                                             <button 
                                                onClick={() => onStartNavigation(quote.id)}
                                                className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md whitespace-nowrap hover:bg-blue-600 w-full text-center flex items-center justify-center space-x-2"
                                            >
                                                <PaperAirplaneIcon className="w-5 h-5" />
                                                <span>Iniciar Deslocamento</span>
                                            </button>
                                        ) : quote.professionalEnRoute ? (
                                            <span className="font-semibold text-green-600 animate-pulse">A CAMINHO</span>
                                        ) : (
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                                quote.status === 'answered' ? 'bg-blue-100 text-blue-800' :
                                                quote.status === 'accepted' ? 'bg-yellow-100 text-yellow-800' :
                                                quote.status === 'scheduled' ? 'bg-teal-100 text-teal-800' :
                                                quote.status === 'completed' ? 'bg-gray-200 text-gray-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {
                                                    {
                                                        answered: 'Respondido',
                                                        accepted: 'Aceito',
                                                        rejected: 'Rejeitado',
                                                        scheduled: 'Agendado',
                                                        completed: 'Concluído',
                                                        pending: ''
                                                    }[quote.status]
                                                }
                                            </span>
                                        )}
                                        <button onClick={() => onOpenChat(quote)} className="bg-gray-200 text-gray-700 font-semibold px-4 py-1 rounded-md text-sm hover:bg-gray-300 w-full text-center">
                                            Ver Conversa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                             <p className="bg-white p-4 rounded-lg shadow-md text-gray-500">Nenhum orçamento respondido ainda.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>
      {selectedQuote && (
        <QuoteResponseModal
            quote={selectedQuote}
            onClose={() => setSelectedQuote(null)}
            onRespond={onRespondToQuote}
        />
      )}
    </div>
  );
};