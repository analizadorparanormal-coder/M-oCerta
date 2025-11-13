import React, { useState, useMemo } from 'react';
import { Client, Quote, Denunciation, Professional } from '../types';
import { DENUNCIATION_REASONS } from '../constants';
import { QrCodeIcon, ClipboardIcon, CheckCircleIcon, DocumentArrowDownIcon } from './icons';

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

interface PixPaymentModalProps {
    quote: Quote;
    onClose: () => void;
    onConfirmPayment: (quoteId: string) => void;
}

const PixPaymentModal: React.FC<PixPaymentModalProps> = ({ quote, onClose, onConfirmPayment }) => {
    const [copied, setCopied] = useState(false);
    const offerValue = quote.messages.find(m => m.isOffer)?.offerDetails?.total || 0;
    
    // Simplified BRCode generator for simulation purposes.
    const generateBrCode = (pixKey: string, amount: number, professionalName: string, city: string = 'SAO PAULO') => {
        const merchantName = professionalName.substring(0, 25).toUpperCase().replace(/\s/g, '');
        const merchantCity = city.substring(0, 15).toUpperCase().replace(/\s/g, '');
        const txid = '***'; // Transaction ID - static for simulation
        const formattedAmount = amount.toFixed(2);

        const payload = [
            '000201',
            `26${(pixKey.length + 4 + 14).toString().padStart(2, '0')}0014BR.GOV.BCB.PIX01${pixKey.length.toString().padStart(2, '0')}${pixKey}`,
            '52040000',
            '5303986',
            `54${formattedAmount.length.toString().padStart(2, '0')}${formattedAmount}`,
            '5802BR',
            `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`,
            `60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`,
            `62${(txid.length + 4).toString().padStart(2, '0')}05${txid.length.toString().padStart(2, '0')}${txid}`,
            '6304'
        ].join('');
        // This is a simplified CRC, a real implementation would calculate it properly.
        return payload + 'A1B2';
    };

    const pixCode = quote.to.pixKey ? generateBrCode(quote.to.pixKey, offerValue, quote.to.fullName) : null;


    const handleCopy = () => {
        if (!pixCode) return;
        navigator.clipboard.writeText(pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirm = () => {
        onConfirmPayment(quote.id);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-royal-blue mb-2">Efetuar Pagamento PIX</h2>
                <p className="text-gray-600 mb-4">Para <span className="font-semibold">{quote.to.fullName}</span></p>

                <div className="mb-4">
                    <p className="text-gray-700">Valor a pagar:</p>
                    <p className="text-4xl font-bold text-gray-800">
                        {offerValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
                
                {pixCode ? (
                    <>
                        <div className="flex justify-center my-6">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`} alt="QR Code PIX" className="w-48 h-48 border-4 border-gray-300 p-1 rounded-lg" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Ou use o PIX Copia e Cola:</label>
                            <div className="flex">
                                <input 
                                    type="text"
                                    readOnly
                                    value={pixCode}
                                    className="w-full bg-gray-100 p-2 border border-gray-300 rounded-l-md text-xs text-gray-600 truncate"
                                />
                                <button onClick={handleCopy} className="bg-gray-200 px-3 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-300 flex items-center">
                                    {copied ? <CheckCircleIcon className="w-5 h-5 text-green-600"/> : <ClipboardIcon className="w-5 h-5 text-gray-600"/>}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="my-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        O profissional ainda não configurou uma chave PIX para recebimento. Por favor, entre em contato com ele para combinar o pagamento.
                    </div>
                )}


                <div className="mt-8 space-y-3">
                    <button onClick={handleConfirm} disabled={!pixCode} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Já Efetuei o Pagamento
                    </button>
                    <button onClick={onClose} className="w-full bg-transparent text-gray-600 font-semibold py-2 rounded-lg hover:bg-gray-100">
                        Cancelar
                    </button>
                </div>
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
  onConfirmVisit: (quoteId: string) => void;
  onOpenChat: (quote: Quote) => void;
  onReviewService: (quote: Quote) => void;
  onAddDenunciation: (denunciationData: { professional: Professional; reason: string; description: string; }) => void;
  onTrackProfessional: (quote: Quote) => void;
  onConfirmPayment: (quoteId: string) => void;
  onDownloadPdf: (quote: Quote) => void;
}

export const ClientPanel: React.FC<ClientPanelProps> = ({ client, quotes, denunciations, onClose, onAcceptOffer, onRejectOffer, onScheduleVisit, onConfirmVisit, onOpenChat, onReviewService, onAddDenunciation, onTrackProfessional, onConfirmPayment, onDownloadPdf }) => {
  const clientQuotes = quotes.filter(q => q.from.id === client.id);
  const [isDenunciationModalOpen, setIsDenunciationModalOpen] = useState(false);
  const [quoteToPay, setQuoteToPay] = useState<Quote | null>(null);

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
                 {lastMessage.isVisitOffer ? (
                    <button onClick={() => onConfirmVisit(quote.id)} className="bg-royal-blue text-white text-xs font-bold px-3 py-1 rounded hover:bg-blue-800">
                        Confirmar Visita
                    </button>
                 ) : (
                    <button onClick={() => onScheduleVisit(quote)} className="bg-royal-blue text-white text-xs font-bold px-3 py-1 rounded hover:bg-blue-800">
                        Agendar Serviço
                    </button>
                 )}
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
         return <span className="text-sm font-semibold text-teal-600">Agendado: {quote.scheduledVisit}</span>;
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
                const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
                    {lastMessage?.sender === 'professional' && lastMessage.isOffer && lastMessage.offerDetails && (
                      lastMessage.isVisitOffer ? (
                        <div className="mt-3 pt-3 border-t border-gray-200 bg-blue-50 p-3 rounded-md">
                            <p className="text-sm font-bold text-blue-800 mb-2">Proposta de Visita Técnica:</p>
                            <p className="text-sm text-gray-800 italic mb-2">"{lastMessage.text}"</p>
                            {lastMessage.offerDetails.visitFee > 0 && (
                                <div className="flex justify-between font-bold text-sm">
                                    <span>Custo da visita:</span>
                                    <span>{formatCurrency(lastMessage.offerDetails.visitFee)}</span>
                                </div>
                            )}
                            <p className="text-sm text-gray-800 mt-2">
                                <strong>Data Sugerida:</strong> {new Date(lastMessage.offerDetails.visitDate + 'T00:00:00').toLocaleDateString()}
                            </p>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-gray-200 bg-gold-yellow/20 p-3 rounded-md">
                            <p className="text-sm font-bold text-royal-blue mb-2">Proposta de Orçamento:</p>
                            <p className="text-sm text-gray-800 italic mb-2">"{lastMessage.text}"</p>
                            
                            <div className="text-sm space-y-1 text-gray-800">
                              <div className="flex justify-between">
                                <span>Mão de Obra:</span>
                                <span>{formatCurrency(lastMessage.offerDetails.laborCost)}</span>
                              </div>

                              {lastMessage.offerDetails.materials.length > 0 && (
                                <div>
                                  <span className="font-semibold">Materiais:</span>
                                  <ul className="list-disc list-inside pl-2 text-xs">
                                    {lastMessage.offerDetails.materials.map((item, index) => (
                                      <li key={index} className="flex justify-between">
                                        <span>{item.name}</span>
                                        <span>{formatCurrency(item.price)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {lastMessage.offerDetails.visitFee > 0 && (
                                <div className="flex justify-between text-red-700">
                                  <span className="font-semibold">Taxa de Visita:</span>
                                  <span className="font-semibold">{formatCurrency(lastMessage.offerDetails.visitFee)}</span>
                                </div>
                              )}

                              <div className="flex justify-between font-bold border-t border-gray-300 pt-1 mt-1">
                                <span>TOTAL:</span>
                                <span>{formatCurrency(lastMessage.offerDetails.total)}</span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-800 mt-2">
                              <strong>Data Sugerida:</strong> {new Date(lastMessage.offerDetails.visitDate + 'T00:00:00').toLocaleDateString()}
                            </p>

                            <div className="mt-3 pt-2 border-t border-gold-yellow/30 flex justify-end">
                                  <button
                                      onClick={() => onDownloadPdf(quote)}
                                      className="flex items-center space-x-1.5 bg-gray-600 text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
                                  >
                                      <DocumentArrowDownIcon className="w-4 h-4" />
                                      <span>Baixar PDF</span>
                                  </button>
                              </div>
                        </div>
                      )
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
                {clientQuotes.filter(q => q.status === 'completed').map(quote => {
                  const paymentStatus = quote.paymentStatus || 'unpaid';
                  const offerValue = quote.messages.find(m => m.isOffer)?.offerDetails?.total || 0;
                  return (
                  <div key={quote.id} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                      <p className="font-semibold text-green-800">Profissional: {quote.to.fullName}</p>
                      <p className="text-sm text-gray-700 mt-1">Serviço: <span className="italic">"{quote.messages[0].text}"</span></p>
                      <p className="text-sm text-gray-600 font-medium mt-2">Data: {quote.scheduledVisit}</p>
                      
                      <div className="mt-3 pt-3 border-t border-green-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div className='flex items-center space-x-3'>
                            <span className="text-sm font-semibold text-gray-800">
                                {offerValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                            {paymentStatus === 'requested' && (
                                <button 
                                    onClick={() => setQuoteToPay(quote)}
                                    className="bg-royal-blue text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-1.5"
                                >
                                    <QrCodeIcon className="w-4 h-4" />
                                    <span>Pagar com Pix</span>
                                </button>
                            )}
                            {paymentStatus === 'paid' && (
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-200 text-green-800 flex items-center">
                                    <CheckCircleIcon className="w-4 h-4 mr-1"/> Pagamento Efetuado
                                </span>
                            )}
                            {paymentStatus === 'unpaid' && (
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                                    Aguardando Solicitação
                                </span>
                            )}
                          </div>
                          <div className='self-end sm:self-center'>
                            {!quote.hasBeenRated ? (
                                <button 
                                    onClick={() => onReviewService(quote)}
                                    className="bg-gold-yellow text-royal-blue text-xs font-bold px-3 py-1 rounded hover:bg-yellow-500 transition-colors"
                                >
                                    Avaliar Profissional
                                </button>
                            ) : (
                                <p className="text-xs text-gray-500 mt-2 font-semibold">Avaliação Enviada ✓</p>
                            )}
                          </div>
                      </div>
                  </div>
                )})}
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
      {quoteToPay && (
        <PixPaymentModal
            quote={quoteToPay}
            onClose={() => setQuoteToPay(null)}
            onConfirmPayment={(quoteId) => {
                onConfirmPayment(quoteId);
                setQuoteToPay(null);
            }}
        />
      )}
    </>
  );
};