import React, { useState, useMemo } from 'react';
import { Client, Quote, Denunciation, Professional } from '../types';
import { DENUNCIATION_REASONS } from '../constants';

interface DenunciationModalProps {
    client: Client;
    quotes: Quote[];
    onClose: () => void;
    onSubmit: (denunciationData: { professional: Professional; reason: string; description: string; }) => void;
}

const DenunciationModal: React.FC<DenunciationModalProps> = ({ client, quotes, onClose, onSubmit }) => {
    const [professionalId, setProfessionalId] = useState('');
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const professionalsWorkedWith = useMemo(() => {
        const professionalMap = new Map<string, Professional>();
        quotes.forEach(quote => {
            if (!professionalMap.has(quote.to.id)) {
                professionalMap.set(quote.to.id, quote.to);
            }
        });
        return Array.from(professionalMap.values());
    }, [quotes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!professionalId || !reason || !description) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        
        const professional = professionalsWorkedWith.find(p => p.id === professionalId);
        if (!professional) {
            setError('Profissional selecionado inválido.');
            setIsSubmitting(false);
            return;
        }
        
        setTimeout(() => { // Simulate API call
            onSubmit({
                professional,
                reason,
                description,
            });
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">Registrar Denúncia</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profissional a ser denunciado</label>
                        <select value={professionalId} onChange={e => setProfessionalId(e.target.value)} className="w-full p-2 border border-gray-300 bg-white rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-royal-blue" required>
                            <option value="" disabled>Selecione um profissional</option>
                            {professionalsWorkedWith.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Motivo</label>
                        <select value={reason} onChange={e => setReason(e.target.value)} className="w-full p-2 border border-gray-300 bg-white rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-royal-blue" required>
                            <option value="" disabled>Selecione um motivo</option>
                            {DENUNCIATION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descrição do ocorrido</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-royal-blue" placeholder="Descreva detalhadamente o que aconteceu..." required />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="pt-2 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400">
                            {isSubmitting ? 'Enviando...' : 'Enviar Denúncia'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface ClientPanelProps {
  client: Client;
  quotes: Quote[];
  denunciations: Denunciation[];
  onClose: () => void;
  onAcceptOffer: (quoteId: string) => void;
  onRejectOffer: (quoteId: string) => void;
  onScheduleVisit: (quote: Quote) => void;
  onOpenChat: (quote: Quote) => void;
  onReviewService: (quote: Quote) => void;
  onAddDenunciation: (denunciationData: { professional: Professional; reason: string; description: string; }) => void;
  onTrackProfessional: (quote: Quote) => void;
}

export const ClientPanel: React.FC<ClientPanelProps> = ({ client, quotes, denunciations, onClose, onAcceptOffer, onRejectOffer, onScheduleVisit, onOpenChat, onReviewService, onAddDenunciation, onTrackProfessional }) => {
  const clientQuotes = quotes.filter(q => q.from.id === client.id);
  const [isDenunciationModalOpen, setIsDenunciationModalOpen] = useState(false);

  const renderQuoteStatus = (quote: Quote) => {
    const lastMessage = quote.messages[quote.messages.length - 1];
    
    switch (quote.status) {
      case 'pending':
        return <span className="text-sm text-gray-500">Aguardando resposta...</span>;
      case 'answered':
        if (lastMessage?.isOffer) {
          return (
            <div className="flex items-center space-x-2">
              <button onClick={() => onAcceptOffer(quote.id)} className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded hover:bg-green-600">Aceitar</button>
              <button onClick={() => onRejectOffer(quote.id)} className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded hover:bg-red-600">Rejeitar</button>
            </div>
          );
        }
        return <span className="text-sm text-blue-500">Respondido</span>;
       case 'accepted':
         return (
             <div className="flex flex-col items-end">
                 <span className="text-sm font-semibold text-green-600 mb-2">Proposta Aceita!</span>
                 <button onClick={() => onScheduleVisit(quote)} className="bg-royal-blue text-white text-xs font-bold px-3 py-1 rounded hover:bg-blue-800">
                    Agendar Visita
                 </button>
             </div>
         );
       case 'scheduled':
         if (quote.professionalEnRoute) {
             return (
                 <div className="flex flex-col items-end text-right">
                      <span className="text-sm font-semibold text-green-600 animate-pulse">Profissional a caminho!</span>
                      <span className="text-xs text-gray-600">Chegada prevista: {quote.eta}</span>
                      <button onClick={() => onTrackProfessional(quote)} className="text-xs text-royal-blue hover:underline mt-1 font-semibold">
                          Acompanhar no mapa
                      </button>
                 </div>
             );
         }
         return <span className="text-sm font-semibold text-teal-600">Visita Agendada: {quote.scheduledVisit}</span>;
      case 'rejected':
        return <span className="text-sm font-semibold text-red-600">Proposta Rejeitada</span>;
      default:
        return null;
    }
  };


  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 flex justify-end animate-fade-in">
        <div className="w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-y-auto transform transition-transform translate-x-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-royal-blue">Meu Painel</h2>
            <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-800">&times;</button>
          </div>

          {/* Quotes Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Meus Orçamentos</h3>
            <div className="space-y-4">
              {clientQuotes.length > 0 ? clientQuotes.map(quote => {
                const lastMessage = quote.messages[quote.messages.length - 1];
                return (
                  <div key={quote.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-700">Profissional: {quote.to.fullName}</p>
                        <p className="text-sm text-gray-500 italic mt-1">"{quote.messages[0].text}"</p>
                        <button onClick={() => onOpenChat(quote)} className="text-xs text-royal-blue hover:underline mt-2 font-semibold">
                          Ver/Enviar Mensagem
                        </button>
                      </div>
                      {renderQuoteStatus(quote)}
                    </div>
                    {lastMessage?.sender === 'professional' && lastMessage.isOffer && (
                      <div className="mt-3 pt-3 border-t border-gray-200 bg-gold-yellow/20 p-2 rounded-md">
                          <p className="text-sm font-bold text-royal-blue">Proposta Recebida:</p>
                          <p className="text-sm text-gray-800">{lastMessage.text}</p>
                          <p className="text-sm text-gray-800"><strong>Valor do Serviço:</strong> R$ {lastMessage.offerDetails?.value.toFixed(2)}</p>
                          {lastMessage.offerDetails?.visitFee && lastMessage.offerDetails.visitFee > 0 && (
                              <p className="text-sm text-red-700 font-semibold">
                                  <strong>Taxa de Visita:</strong> R$ {lastMessage.offerDetails.visitFee.toFixed(2)}
                              </p>
                          )}
                          <p className="text-sm text-gray-800"><strong>Data Sugerida:</strong> {lastMessage.offerDetails?.visitDate && new Date(lastMessage.offerDetails.visitDate + 'T00:00:00').toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                )
              }) : (
                <p className="text-sm text-gray-500">Você ainda não solicitou nenhum orçamento.</p>
              )}
            </div>
          </div>

          {/* Denunciations Section */}
          <div className="mt-8">
              <div className="flex justify-between items-center mb-3 border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Minhas Denúncias</h3>
                  <button 
                      onClick={() => setIsDenunciationModalOpen(true)}
                      className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                  >
                      Fazer uma denúncia
                  </button>
              </div>
              <div className="space-y-4">
                {denunciations.filter(d => d.client.id === client.id).map(denunciation => (
                  <div key={denunciation.id} className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                      <p className="font-semibold text-red-800">Contra: {denunciation.professional.fullName}</p>
                      <p className="text-sm text-red-700">Motivo: {denunciation.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">{denunciation.date.toLocaleDateString()}</p>
                  </div>
                ))}
                {denunciations.filter(d => d.client.id === client.id).length === 0 && (
                  <p className="text-sm text-gray-500">Nenhuma denúncia registrada.</p>
                )}
              </div>
          </div>

          {/* Completed Services History Section */}
          <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Histórico de Serviços Concluídos</h3>
              <div className="space-y-4">
                {clientQuotes.filter(q => q.status === 'completed').map(quote => (
                  <div key={quote.id} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                      <p className="font-semibold text-green-800">Profissional: {quote.to.fullName}</p>
                      <p className="text-sm text-gray-700 mt-1">Serviço: <span className="italic">"{quote.messages[0].text}"</span></p>
                      <p className="text-sm text-gray-600 font-medium mt-2">Data de Conclusão: {quote.scheduledVisit}</p>
                      {!quote.hasBeenRated ? (
                          <div className="text-right mt-2">
                              <button 
                                  onClick={() => onReviewService(quote)}
                                  className="bg-gold-yellow text-royal-blue text-xs font-bold px-3 py-1 rounded hover:bg-yellow-500 transition-colors"
                              >
                                  Avaliar Profissional
                              </button>
                          </div>
                      ) : (
                          <p className="text-right text-xs text-gray-500 mt-2 font-semibold">Avaliação Enviada ✓</p>
                      )}
                  </div>
                ))}
                {clientQuotes.filter(q => q.status === 'completed').length === 0 && (
                  <p className="text-sm text-gray-500">Nenhum serviço concluído ainda.</p>
                )}
              </div>
          </div>

        </div>
      </div>
      {isDenunciationModalOpen && (
        <DenunciationModal 
            client={client}
            quotes={clientQuotes}
            onClose={() => setIsDenunciationModalOpen(false)}
            onSubmit={(data) => {
                onAddDenunciation(data);
                setIsDenunciationModalOpen(false); // Close modal on submit
            }}
        />
      )}
    </>
  );
};