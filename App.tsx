import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { ClientDashboard } from './components/ClientDashboard';
import { ProfessionalProfile } from './components/ProfessionalProfile';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientPanel } from './components/ClientPanel';
import { ScheduleVisitModal } from './components/ScheduleVisitModal';
import { ChatDialog } from './components/ChatDialog';
import { ReviewModal } from './components/ReviewModal';
import { SupportModal } from './components/SupportModal';
import { NavigationModal } from './components/NavigationModal';
import { TrackingModal } from './components/TrackingModal';
import { UserRole, User, Professional, Client, Quote, Denunciation, Banner, QuoteMessage, Review, SupportTicket, SupportMessage } from './types';
import { MOCK_CLIENTS, MOCK_PROFESSIONALS, MOCK_QUOTES, MOCK_DENUNCIATIONS, MOCK_BANNERS, MOCK_SUPPORT_TICKETS } from './constants';

type View = 'welcome' | 'auth' | 'clientDashboard' | 'professionalProfile' | 'professionalDashboard' | 'adminDashboard';

const App: React.FC = () => {
    const [view, setView] = useState<View>('welcome');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

    // Data state
    const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
    const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
    const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
    const [denunciations, setDenunciations] = useState<Denunciation[]>(MOCK_DENUNCIATIONS);
    const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);

    // UI State
    const [isClientPanelOpen, setIsClientPanelOpen] = useState(false);
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
    const [quoteToSchedule, setQuoteToSchedule] = useState<Quote | null>(null);
    const [quoteToReview, setQuoteToReview] = useState<Quote | null>(null);
    const [hasNewOffers, setHasNewOffers] = useState(false);
    const [chattingQuote, setChattingQuote] = useState<Quote | null>(null);
    const [navigatingQuote, setNavigatingQuote] = useState<Quote | null>(null);
    const [trackingQuote, setTrackingQuote] = useState<Quote | null>(null);


    useEffect(() => {
        // Check for new offers for the current client
        if (currentUser?.role === UserRole.CLIENT) {
            const hasNew = quotes.some(q => q.from.id === currentUser.id && q.status === 'answered');
            setHasNewOffers(hasNew);
        }
    }, [quotes, currentUser]);


    const handleRoleSelect = (role: UserRole) => {
        if (role === UserRole.ADMIN) {
            setView('adminDashboard');
            return;
        }
        setSelectedRole(role);
        setView('auth');
    };

    const handleAuthSuccess = (user: User) => {
        setCurrentUser(user);
        if (user.role === UserRole.CLIENT) {
            setView('clientDashboard');
        } else if (user.role === UserRole.PROFESSIONAL) {
            setView('professionalDashboard');
        }
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        setSelectedRole(null);
        setSelectedProfessional(null);
        setView('welcome');
        setIsClientPanelOpen(false);
    };

    const handleSelectProfessional = (professional: Professional) => {
        setSelectedProfessional(professional);
        setView('professionalProfile');
    };


    const handleSubmitQuote = (quote: Quote) => {
        setQuotes(prev => [...prev, quote]);
    };

    const handleRespondToQuote = (quoteId: string, response: QuoteMessage) => {
        setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, messages: [...q.messages, response], status: 'answered' } : q));
    };

    const handleAcceptOffer = (quoteId: string) => {
        setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'accepted' } : q));
    };

    const handleRejectOffer = (quoteId: string) => {
        setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'rejected' } : q));
    };
    
    const handleConfirmSchedule = (quoteId: string, visitDateTime: string) => {
        setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'scheduled', scheduledVisit: visitDateTime } : q));
        setQuoteToSchedule(null);
    };

    const handleCompleteService = (quoteId: string) => {
        setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'completed' } : q));
    };

    const handleSubmitReview = (quoteId: string, rating: number, comment: string) => {
        const quote = quotes.find(q => q.id === quoteId);
        if (!quote) return;

        const professionalId = quote.to.id;
        const clientName = quote.from.fullName;

        const newReview: Review = {
            clientName,
            rating,
            comment,
            date: new Date(),
        };

        setProfessionals(prev => 
            prev.map(prof => {
                if (prof.id === professionalId) {
                    const updatedReviews = [...prof.reviews, newReview];
                    const newTotalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
                    const newAverageRating = newTotalRating / updatedReviews.length;
                    
                    return {
                        ...prof,
                        reviews: updatedReviews,
                        reviewsCount: updatedReviews.length,
                        rating: newAverageRating,
                    };
                }
                return prof;
            })
        );

        setQuotes(prev =>
            prev.map(q => q.id === quoteId ? { ...q, hasBeenRated: true } : q)
        );

        setQuoteToReview(null);
    };

    const handleAddDenunciation = (denunciationData: { professional: Professional; reason: string; description: string; }) => {
        if (!currentUser || currentUser.role !== UserRole.CLIENT) return;
        
        const newDenunciation: Denunciation = {
            id: `den-${Date.now()}`,
            client: currentUser as Client,
            professional: denunciationData.professional,
            reason: denunciationData.reason,
            description: denunciationData.description,
            date: new Date(),
        };
        setDenunciations(prev => [...prev, newDenunciation]);
    };

    const handleSendMessage = (quoteId: string, message: QuoteMessage) => {
        setQuotes(prevQuotes => {
            const newQuotes = prevQuotes.map(q => {
                if (q.id === quoteId) {
                    return { ...q, messages: [...q.messages, message] };
                }
                return q;
            });

            const updatedQuoteForModal = newQuotes.find(q => q.id === quoteId);
            if (updatedQuoteForModal) {
                setChattingQuote(updatedQuoteForModal);
            }

            return newQuotes;
        });
    };

    const handleAddSupportTicket = (subject: string, message: string) => {
        if (!currentUser) return;

        const newTicket: SupportTicket = {
            id: `ticket-${Date.now()}`,
            clientOrProfessional: currentUser as Client | Professional,
            subject,
            messages: [
                {
                    senderId: currentUser.id,
                    senderName: currentUser.fullName,
                    text: message,
                    timestamp: new Date(),
                }
            ],
            status: 'open',
            createdAt: new Date(),
        };
        setSupportTickets(prev => [...prev, newTicket]);
        alert('Sua mensagem foi enviada! A equipe de suporte responderá em breve.');
    };
    
    const handleAdminReplyToTicket = (ticketId: string, message: string) => {
        const newReply: SupportMessage = {
            senderId: 'admin',
            senderName: 'Admin',
            text: message,
            timestamp: new Date(),
        };

        setSupportTickets(prev =>
            prev.map(ticket =>
                ticket.id === ticketId
                    ? { ...ticket, messages: [...ticket.messages, newReply], status: 'open' } // Re-open ticket on reply
                    : ticket
            )
        );
    };
    
    const handleToggleTicketStatus = (ticketId: string) => {
        setSupportTickets(prev =>
            prev.map(ticket =>
                ticket.id === ticketId
                    ? { ...ticket, status: ticket.status === 'open' ? 'closed' : 'open' }
                    : ticket
            )
        );
    };


    const handleOpenChat = (quote: Quote) => {
        setChattingQuote(quote);
    };

    const handleStartNavigation = (quoteId: string) => {
        const quoteToUpdate = quotes.find(q => q.id === quoteId);
        if (!quoteToUpdate) return;
    
        const etaDate = new Date(Date.now() + 25 * 60 * 1000);
        const etaString = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
        setQuotes(prev => prev.map(q => 
            q.id === quoteId ? { ...q, professionalEnRoute: true, eta: etaString } : q
        ));
    
        // Find the updated quote object to pass to the modal
        const updatedQuote = { ...quoteToUpdate, professionalEnRoute: true, eta: etaString };
        setNavigatingQuote(updatedQuote);
    };

    const renderView = () => {
        switch (view) {
            case 'welcome':
                return <WelcomeScreen onRoleSelect={handleRoleSelect} />;
            case 'auth':
                return <AuthScreen role={selectedRole!} onAuthSuccess={handleAuthSuccess} onBack={() => setView('welcome')} />;
            case 'clientDashboard':
                return (
                    <>
                        <ClientDashboard 
                            client={currentUser as Client} 
                            banners={banners}
                            onSelectProfessional={handleSelectProfessional} 
                            onLogout={handleLogout}
                            onOpenPanel={() => setIsClientPanelOpen(true)}
                            onOpenSupport={() => setIsSupportModalOpen(true)}
                            hasNewOffers={hasNewOffers}
                        />
                        {isClientPanelOpen && (
                            <ClientPanel 
                                client={currentUser as Client}
                                quotes={quotes}
                                denunciations={denunciations}
                                onClose={() => setIsClientPanelOpen(false)}
                                onAcceptOffer={handleAcceptOffer}
                                onRejectOffer={handleRejectOffer}
                                onScheduleVisit={(quote) => setQuoteToSchedule(quote)}
                                onOpenChat={handleOpenChat}
                                onReviewService={(quote) => setQuoteToReview(quote)}
                                onAddDenunciation={handleAddDenunciation}
                                onTrackProfessional={(quote) => setTrackingQuote(quote)}
                            />
                        )}
                        {quoteToSchedule && (
                            <ScheduleVisitModal
                                quote={quoteToSchedule}
                                onClose={() => setQuoteToSchedule(null)}
                                onConfirmSchedule={handleConfirmSchedule}
                            />
                        )}
                        {quoteToReview && (
                            <ReviewModal
                                quote={quoteToReview}
                                onClose={() => setQuoteToReview(null)}
                                onSubmitReview={handleSubmitReview}
                            />
                        )}
                        {chattingQuote && currentUser && (
                            <ChatDialog
                                quote={chattingQuote}
                                currentUser={currentUser}
                                onClose={() => setChattingQuote(null)}
                                onSendMessage={handleSendMessage}
                            />
                        )}
                         {isSupportModalOpen && currentUser && (
                            <SupportModal
                                user={currentUser}
                                onClose={() => setIsSupportModalOpen(false)}
                                onSubmit={handleAddSupportTicket}
                            />
                        )}
                        {trackingQuote && (
                            <TrackingModal
                                quote={trackingQuote}
                                onClose={() => setTrackingQuote(null)}
                            />
                        )}
                    </>
                );
            case 'professionalProfile':
                return <ProfessionalProfile 
                            professional={selectedProfessional!} 
                            client={currentUser as Client}
                            onBack={() => setView('clientDashboard')}
                            onSubmitQuote={handleSubmitQuote}
                        />;
            case 'professionalDashboard':
                return (
                    <>
                        <ProfessionalDashboard 
                            professional={currentUser as Professional}
                            quotes={quotes}
                            onLogout={handleLogout}
                            onRespondToQuote={handleRespondToQuote}
                            onOpenChat={handleOpenChat}
                            onCompleteService={handleCompleteService}
                            onOpenSupport={() => setIsSupportModalOpen(true)}
                            onStartNavigation={handleStartNavigation}
                        />
                        {chattingQuote && currentUser && (
                             <ChatDialog
                                quote={chattingQuote}
                                currentUser={currentUser}
                                onClose={() => setChattingQuote(null)}
                                onSendMessage={handleSendMessage}
                                onCompleteService={handleCompleteService}
                            />
                        )}
                        {isSupportModalOpen && currentUser && (
                            <SupportModal
                                user={currentUser}
                                onClose={() => setIsSupportModalOpen(false)}
                                onSubmit={handleAddSupportTicket}
                            />
                        )}
                        {navigatingQuote && (
                            <NavigationModal
                                quote={navigatingQuote}
                                onClose={() => setNavigatingQuote(null)}
                            />
                        )}
                    </>
                );
            case 'adminDashboard':
                 return <AdminDashboard 
                            clients={clients}
                            professionals={professionals}
                            denunciations={denunciations}
                            banners={banners}
                            supportTickets={supportTickets}
                            onBannersChange={setBanners}
                            onProfessionalsChange={setProfessionals}
                            onClientsChange={setClients}
                            onReplyToTicket={handleAdminReplyToTicket}
                            onToggleTicketStatus={handleToggleTicketStatus}
                            onLogout={handleLogout}
                        />;
            default:
                return <WelcomeScreen onRoleSelect={handleRoleSelect} />;
        }
    };

    return <div className="App">{renderView()}</div>;
};

export default App;