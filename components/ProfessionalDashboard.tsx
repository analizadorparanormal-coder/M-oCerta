import React, { useState, useMemo } from 'react';
import { Professional, Quote, QuoteMessage, Client } from '../types';
import { StarIcon, QuestionMarkCircleIcon, PaperAirplaneIcon, CalendarDaysIcon, ChartBarIcon, CurrencyDollarIcon, UserCircleIcon, CheckCircleIcon, ClockIcon, BellIcon, UsersIcon, CreditCardIcon, Cog6ToothIcon, PencilSquareIcon } from './icons';
import { OfferModal } from './OfferModal';
import { OfferDetails } from '../types';

type Tab = 'agenda' | 'solicitacoes' | 'clientes' | 'pagamentos' | 'configuracoes';

interface TabButtonProps {
    icon: React.ReactNode;
    title: string;
    tabName: Tab;
    activeTab: Tab;
    onClick: (tab: Tab) => void;
    badgeCount?: number;
}
const TabButton: React.FC<TabButtonProps> = ({ icon, title, tabName, activeTab, onClick, badgeCount }) => {
    const isActive = activeTab === tabName;
    return (
        <button
            onClick={() => onClick(tabName)}
            className={`flex items-center space-x-2 px-1 py-4 border-b-2 font-semibold text-sm transition-colors ${isActive ? 'border-royal-blue text-royal-blue' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
        >
            {icon}
            <span>{title}</span>
            {badgeCount && badgeCount > 0 ? (
                 <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-700'}`}>{badgeCount}</span>
            ) : null}
        </button>
    );
};

// --- Tab Content Components ---

const AgendaView: React.FC<{ quotes: Quote[], onOpenChat: (q: Quote) => void, onStartNavigation: (id: string) => void, onOpenOfferModal: (q: Quote) => void }> = ({ quotes, onOpenChat, onStartNavigation, onOpenOfferModal }) => {
    if (quotes.length === 0) return <p className="text-gray-500 text-center py-8">Nenhum serviço agendado no momento.</p>;
    return (
        <div className="space-y-4">
            {quotes.map(quote => (
                <div key={quote.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-gray-50 hover:shadow-md transition-shadow">
                    <div>
                        <p className="font-bold text-royal-blue">{quote.from.fullName}</p>
                        <p className="text-sm text-gray-600 italic">"{quote.messages[0].text}"</p>
                        <p className="text-sm font-semibold text-gray-800 mt-2 flex items-center">
                            <ClockIcon className="w-4 h-4 mr-2 text-gray-500"/> {quote.scheduledVisit}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
                        <button onClick={() => onOpenChat(quote)} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md text-sm hover:bg-gray-300">
                            Chat
                        </button>
                        <button onClick={() => onStartNavigation(quote.id)} className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-600 flex items-center space-x-2">
                            <PaperAirplaneIcon className="w-4 h-4" />
                            <span>Ver Rota</span>
                        </button>
                        <button onClick={() => onOpenOfferModal(quote)} className="bg-gold-yellow text-royal-blue font-bold px-4 py-2 rounded-md text-sm hover:bg-yellow-500">
                            Gerar Orçamento
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SolicitacoesView: React.FC<{ quotes: Quote[], onOpenChat: (q: Quote) => void, onOpenOfferModal: (q: Quote) => void, onOpenPreliminaryVisitModal: (q: Quote) => void }> = ({ quotes, onOpenChat, onOpenOfferModal, onOpenPreliminaryVisitModal }) => {
     if (quotes.length === 0) return <p className="text-gray-500 text-center py-8">Você não tem novas solicitações. Bom trabalho!</p>;
    return (
        <div className="space-y-4">
            {quotes.map(quote => (
                <div key={quote.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gold-yellow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                        <div>
                            <p className="font-bold text-royal-blue flex items-center"><UserCircleIcon className="w-5 h-5 mr-2 text-gray-400"/>{quote.from.fullName}</p>
                            <p className="text-gray-700 italic mt-1 ml-7">"{quote.messages[0].text}"</p>
                        </div>
                        <div className="flex items-center space-x-2 self-end sm:self-start flex-shrink-0">
                            <button onClick={() => onOpenChat(quote)} className="bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-md text-sm hover:bg-gray-300">
                                Conversar
                            </button>
                            <button onClick={() => onOpenPreliminaryVisitModal(quote)} className="bg-blue-100 text-blue-800 font-bold px-3 py-2 rounded-md text-sm hover:bg-blue-200">
                                Agendar Visita
                            </button>
                            <button onClick={() => onOpenOfferModal(quote)} className="bg-gold-yellow text-royal-blue font-bold px-3 py-2 rounded-md text-sm hover:bg-yellow-500">
                                Criar Oferta
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ClientesView: React.FC<{ clients: { client: Client, serviceCount: number }[] }> = ({ clients }) => {
     if (clients.length === 0) return <p className="text-gray-500 text-center py-8">Você ainda não completou serviços para nenhum cliente.</p>;
    return (
        <div className="space-y-3">
            {clients.map(({ client, serviceCount }) => (
                <div key={client.id} className="p-4 border rounded-lg flex items-center justify-between bg-gray-50">
                    <div className="flex items-center space-x-4">
                        <img src={client.profilePictureUrl} alt={client.fullName} className="w-12 h-12 rounded-full object-cover"/>
                        <div>
                            <p className="font-bold text-gray-800">{client.fullName}</p>
                            <p className="text-sm text-gray-500">{client.phone}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-royal-blue">{serviceCount} {serviceCount > 1 ? 'serviços' : 'serviço'}</p>
                        <p className="text-xs text-gray-500">concluído(s)</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const PagamentosView: React.FC<{ quotes: Quote[], onRequestPayment: (id: string) => void }> = ({ quotes, onRequestPayment }) => {
    const completedUnpaid = quotes.filter(q => q.status === 'completed' && q.paymentStatus !== 'paid');
    const completedPaid = quotes.filter(q => q.status === 'completed' && q.paymentStatus === 'paid');

    const formatCurrency = (value?: number) => (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const findOfferValue = (quote: Quote) => {
        const offerMessage = quote.messages.find(m => m.isOffer && m.offerDetails);
        return offerMessage?.offerDetails?.total || 0;
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">A Receber</h3>
                <div className="space-y-3">
                    {completedUnpaid.length > 0 ? completedUnpaid.map(quote => (
                        <div key={quote.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-yellow-50">
                            <div>
                                <p className="font-bold text-gray-800">{quote.from.fullName}</p>
                                <p className="text-sm text-gray-600 italic">"{quote.messages[0].text}"</p>
                            </div>
                            <div className="flex items-center space-x-4 self-end sm:self-center">
                                <span className="font-bold text-lg text-gray-800">{formatCurrency(findOfferValue(quote))}</span>
                                {quote.paymentStatus === 'requested' ? (
                                    <span className="text-xs font-bold text-orange-800 px-3 py-1 rounded-full bg-orange-200 border border-orange-300">Solicitado</span>
                                ) : ( // 'unpaid'
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-800 px-3 py-1 rounded-full bg-gray-200 border border-gray-300">Pendente</span>
                                        <button onClick={() => onRequestPayment(quote.id)} className="bg-green-500 text-white font-bold px-3 py-1.5 rounded-md text-xs hover:bg-green-600 whitespace-nowrap">
                                            Solicitar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-center py-4">Nenhum pagamento pendente.</p>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Histórico de Recebimentos</h3>
                <div className="space-y-3">
                     {completedPaid.length > 0 ? completedPaid.map(quote => (
                        <div key={quote.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-green-50">
                            <div>
                                <p className="font-semibold text-gray-700">{quote.from.fullName}</p>
                                <p className="text-xs text-gray-500">Pago em {new Date().toLocaleDateString()}</p>
                            </div>
                             <div className="flex items-center space-x-4 self-end sm:self-center">
                                <span className="font-semibold text-green-800">{formatCurrency(findOfferValue(quote))}</span>
                                <span className="text-xs font-bold text-green-800 px-3 py-1 rounded-full bg-green-200 border border-green-300">Recebido</span>
                            </div>
                        </div>
                    )) : (
                         <p className="text-gray-500 text-center py-4">Nenhum pagamento recebido ainda.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ConfiguracoesView: React.FC<{
    professional: Professional;
    onUpdatePixKey: (professionalId: string, pixKey: string) => void;
}> = ({ professional, onUpdatePixKey }) => {
    const [pixKey, setPixKey] = useState(professional.pixKey || '');

    const handleSave = () => {
        onUpdatePixKey(professional.id, pixKey);
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-royal-blue mb-4">Minha Chave PIX</h3>
                <p className="text-gray-600 mb-4 text-sm">
                    Cadastre sua chave PIX aqui para que os clientes possam fazer o pagamento dos serviços diretamente para você. O QR Code será gerado automaticamente.
                </p>
                <div>
                    <label htmlFor="pix-key" className="block text-sm font-medium text-gray-700 mb-1">
                        Chave PIX (CPF/CNPJ, E-mail, Telefone ou Chave Aleatória)
                    </label>
                    <input
                        id="pix-key"
                        type="text"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        placeholder="Digite sua chave PIX"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                    />
                </div>
                <div className="mt-6 text-right">
                    <button
                        onClick={handleSave}
                        className="bg-royal-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        Salvar Chave PIX
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

interface ProfessionalDashboardProps {
  professional: Professional;
  quotes: Quote[];
  onLogout: () => void;
  onOpenChat: (quote: Quote) => void;
  onCompleteService: (quoteId: string) => void;
  onOpenSupport: () => void;
  onOpenEditProfile: () => void;
  onStartNavigation: (quoteId: string) => void;
  onToggleAvailability: (professionalId: string, isAvailable: boolean) => void;
  onRequestPayment: (quoteId: string) => void;
  onUpdatePixKey: (professionalId: string, pixKey: string) => void;
  onSendDetailedOffer: (quoteId: string, description: string, offerDetails: Omit<OfferDetails, 'total'>) => void;
  onOpenPreliminaryVisitModal: (quote: Quote) => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = (props) => {
    const { professional, quotes, onLogout, onOpenSupport, onToggleAvailability, onUpdatePixKey, onOpenEditProfile, onSendDetailedOffer, onOpenPreliminaryVisitModal } = props;
    const [activeTab, setActiveTab] = useState<Tab>('solicitacoes');
    const [quoteToOffer, setQuoteToOffer] = useState<Quote | null>(null);

    const professionalQuotes = useMemo(() => quotes.filter(q => q.to.id === professional.id), [quotes, professional.id]);
    
    const pendingQuotes = useMemo(() => professionalQuotes.filter(q => q.status === 'pending'), [professionalQuotes]);
    const scheduledQuotes = useMemo(() => professionalQuotes.filter(q => q.status === 'scheduled').sort((a,b) => new Date(a.scheduledVisit || 0).getTime() - new Date(b.scheduledVisit || 0).getTime()), [professionalQuotes]);
    
    const uniqueClients = useMemo(() => {
        const clientMap = new Map<string, { client: Client, serviceCount: number }>();
        professionalQuotes.forEach(quote => {
            if (quote.status === 'completed') {
                const existing = clientMap.get(quote.from.id);
                if (existing) {
                    existing.serviceCount += 1;
                } else {
                    clientMap.set(quote.from.id, { client: quote.from, serviceCount: 1 });
                }
            }
        });
        return Array.from(clientMap.values()).sort((a, b) => b.serviceCount - a.serviceCount);
    }, [professionalQuotes]);

    const handleSubmitOffer = (description: string, offerDetails: Omit<OfferDetails, 'total'>) => {
        if (quoteToOffer) {
            onSendDetailedOffer(quoteToOffer.id, description, offerDetails);
            setQuoteToOffer(null); // Close modal
        }
    };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center">
            <div className="w-10 h-10 bg-gold-yellow text-royal-blue rounded-full flex items-center justify-center font-bold text-xl">M</div>
            <h1 className="text-2xl font-bold text-royal-blue ml-3 hidden sm:block">Meu Painel</h1>
        </div>
        <div className="flex items-center space-x-4">
            <button onClick={onOpenEditProfile} className="text-royal-blue font-semibold hover:underline px-2 py-1 flex items-center space-x-1">
                <PencilSquareIcon className="w-5 h-5" />
                <span className="hidden md:inline">Editar Perfil</span>
            </button>
            <button onClick={onOpenSupport} className="text-royal-blue font-semibold hover:underline px-2 py-1 flex items-center space-x-1">
                <QuestionMarkCircleIcon className="w-5 h-5" />
                <span className="hidden md:inline">Suporte</span>
            </button>
            <button onClick={onLogout} className="bg-royal-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors">Sair</button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
         {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
                <img src={professional.profilePictureUrl} alt={professional.fullName} className="w-16 h-16 rounded-full object-cover"/>
                <div className="ml-4">
                    <h2 className="text-2xl font-bold text-royal-blue">Olá, {professional.fullName.split(' ')[0]}!</h2>
                    <p className="text-gray-600">Aqui está um resumo do seu negócio.</p>
                </div>
            </div>
            <div className="mt-4 sm:mt-0">
                <label htmlFor="availability-toggle" className="flex items-center justify-between cursor-pointer">
                    <span className="font-semibold text-gray-700 mr-3">Disponível</span>
                    <div className="relative">
                        <input id="availability-toggle" type="checkbox" className="sr-only" checked={professional.isAvailable} onChange={(e) => onToggleAvailability(professional.id, e.target.checked)}/>
                        <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
                    </div>
                </label>
            </div>
        </div>

         {/* Tab Navigation */}
        <div className="mb-6">
            <div className="border-b border-gray-200 bg-white rounded-t-lg shadow-sm px-4">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <TabButton icon={<CalendarDaysIcon className="w-5 h-5"/>} title="Agenda" tabName="agenda" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton icon={<BellIcon className="w-5 h-5"/>} title="Solicitações" tabName="solicitacoes" activeTab={activeTab} onClick={setActiveTab} badgeCount={pendingQuotes.length}/>
                <TabButton icon={<UsersIcon className="w-5 h-5"/>} title="Clientes" tabName="clientes" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton icon={<CreditCardIcon className="w-5 h-5"/>} title="Pagamentos" tabName="pagamentos" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton icon={<Cog6ToothIcon className="w-5 h-5"/>} title="Configurações" tabName="configuracoes" activeTab={activeTab} onClick={setActiveTab} />
              </nav>
            </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-4 md:p-6 rounded-b-lg shadow-md min-h-[400px]">
            {activeTab === 'agenda' && <AgendaView quotes={scheduledQuotes} onOpenChat={props.onOpenChat} onStartNavigation={props.onStartNavigation} onOpenOfferModal={setQuoteToOffer} />}
            {activeTab === 'solicitacoes' && <SolicitacoesView quotes={pendingQuotes} onOpenChat={props.onOpenChat} onOpenOfferModal={setQuoteToOffer} onOpenPreliminaryVisitModal={onOpenPreliminaryVisitModal} />}
            {activeTab === 'clientes' && <ClientesView clients={uniqueClients} />}
            {activeTab === 'pagamentos' && <PagamentosView quotes={professionalQuotes} onRequestPayment={props.onRequestPayment}/>}
            {activeTab === 'configuracoes' && <ConfiguracoesView professional={professional} onUpdatePixKey={onUpdatePixKey} />}
        </div>
      </main>

       {quoteToOffer && (
        <OfferModal
            quote={quoteToOffer}
            onClose={() => setQuoteToOffer(null)}
            onSubmit={handleSubmitOffer}
        />
       )}

       <style>{`
            #availability-toggle:checked ~ .dot {
                transform: translateX(100%);
                background-color: #0033a0;
            }
             #availability-toggle:checked ~ .block {
                background-color: #ffc72c;
            }
        `}</style>
    </div>
  );
};