import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { ClientDashboard } from './components/ClientDashboard';
import { ProfessionalProfile } from './components/ProfessionalProfile';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientPanel } from './components/ClientPanel';
import { ScheduleVisitModal } from './components/ScheduleVisitModal';
import { PreliminaryVisitModal } from './components/PreliminaryVisitModal';
import { ChatDialog } from './components/ChatDialog';
import { ReviewModal } from './components/ReviewModal';
import { SupportModal } from './components/SupportModal';
import { NavigationModal } from './components/NavigationModal';
import { TrackingModal } from './components/TrackingModal';
import { EditProfileModal } from './components/EditProfileModal';
import { UserRole, User, Professional, Client, Quote, Denunciation, Banner, QuoteMessage, Review, SupportTicket, SupportMessage, OfferDetails } from './types';
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
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [quoteToSchedule, setQuoteToSchedule] = useState<Quote | null>(null);
    const [quoteForPreliminaryVisit, setQuoteForPreliminaryVisit] = useState<Quote | null>(null);
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

    const handleSendDetailedOffer = (quoteId: string, description: string, offerDetails: Omit<OfferDetails, 'total'>) => {
        const total = offerDetails.laborCost + offerDetails.materials.reduce((sum, item) => sum + item.price, 0) + offerDetails.visitFee;
        const fullOfferDetails: OfferDetails = { ...offerDetails, total };

        const response: QuoteMessage = {
            sender: 'professional',
            text: description,
            timestamp: new Date(),
            isOffer: true,
            offerDetails: fullOfferDetails,
        };
        
        setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, messages: [...q.messages, response], status: 'answered' } : q));
    };

    const handleSchedulePreliminaryVisit = (quoteId: string, visitDetails: { date: string; time: string; fee: number; message: string }) => {
        const visitDateTime = `${new Date(visitDetails.date + 'T00:00:00').toLocaleDateString()} às ${visitDetails.time}`;
        
        const offerDetails: OfferDetails = {
            laborCost: 0,
            materials: [],
            visitFee: visitDetails.fee,
            total: visitDetails.fee,
            visitDate: visitDetails.date,
        };

        const response: QuoteMessage = {
            sender: 'professional',
            text: visitDetails.message || 'Proposta para visita técnica de avaliação.',
            timestamp: new Date(),
            isOffer: true,
            isVisitOffer: true,
            offerDetails,
        };
        
        setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, messages: [...q.messages, response], status: 'answered' } : q));
        setQuoteForPreliminaryVisit(null);
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
    
    const handleConfirmVisit = (quoteId: string) => {
        setQuotes(prev => prev.map(q => {
            if (q.id === quoteId) {
                const lastMessage = q.messages[q.messages.length - 1];
                const visitDate = lastMessage.offerDetails?.visitDate;
                const time = '09:00'; // Placeholder, could be extracted if stored
                const visitDateTime = `${new Date(visitDate + 'T00:00:00').toLocaleDateString()}`;
                return { ...q, status: 'scheduled', scheduledVisit: visitDateTime };
            }
            return q;
        }));
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

    const handleMarkSentMessagesAsRead = (quoteId: string) => {
        if (!currentUser) return;
        setQuotes(prev =>
            prev.map(q => {
                if (q.id === quoteId) {
                    const updatedMessages = q.messages.map(msg => {
                        const isMyMessage = (currentUser.role === UserRole.CLIENT && msg.sender === 'client') ||
                                          (currentUser.role === UserRole.PROFESSIONAL && msg.sender === 'professional');
                        if (isMyMessage) {
                            return { ...msg, isRead: true };
                        }
                        return msg;
                    });
                    return { ...q, messages: updatedMessages };
                }
                return q;
            })
        );
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
    
    const handleToggleAvailability = (professionalId: string, isAvailable: boolean) => {
        const updatedProfessionals = professionals.map(p => 
            p.id === professionalId ? { ...p, isAvailable } : p
        );
        setProfessionals(updatedProfessionals);

        if (currentUser?.id === professionalId) {
            setCurrentUser(prevUser => {
                const updatedUser = updatedProfessionals.find(p => p.id === prevUser?.id);
                return updatedUser || prevUser;
            });
        }
    };

    const handleRequestPayment = (quoteId: string) => {
        setQuotes(prev =>
            prev.map(q => q.id === quoteId ? { ...q, paymentStatus: 'requested' } : q)
        );
    };

    const handleConfirmPayment = (quoteId: string) => {
        setQuotes(prev =>
            prev.map(q => q.id === quoteId ? { ...q, paymentStatus: 'paid' } : q)
        );
    };

    const handleUpdatePixKey = (professionalId: string, pixKey: string) => {
        setProfessionals(prev => 
            prev.map(p => p.id === professionalId ? { ...p, pixKey } : p)
        );
        // Also update currentUser if they are the one being edited
        if (currentUser?.id === professionalId) {
            setCurrentUser(prev => prev ? { ...prev, pixKey } as Professional : null);
        }
        alert('Chave PIX atualizada com sucesso!');
    };

    const handleUpdateUser = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        if (updatedUser.role === UserRole.CLIENT) {
            setClients(prev => prev.map(c => c.id === updatedUser.id ? updatedUser as Client : c));
        } else if (updatedUser.role === UserRole.PROFESSIONAL) {
            setProfessionals(prev => prev.map(p => p.id === updatedUser.id ? updatedUser as Professional : p));
        }
        setIsEditProfileModalOpen(false);
        alert('Perfil atualizado com sucesso!');
    };

    const handleSendTransitUpdate = (quoteId: string, text: string) => {
        const updatedQuotes = quotes.map(q =>
            q.id === quoteId
                ? { ...q, transitUpdate: { text, timestamp: new Date() } }
                : q
        );
        setQuotes(updatedQuotes);

        // Also update the quote in the tracking modal if it's currently open
        if (trackingQuote?.id === quoteId) {
            const updatedTrackingQuote = updatedQuotes.find(q => q.id === quoteId);
            if(updatedTrackingQuote) setTrackingQuote(updatedTrackingQuote);
        }
    };

    const handleDownloadPdf = (quote: Quote) => {
        const offer = quote.messages.find(m => m.isOffer && m.offerDetails);
        if (!offer || !offer.offerDetails) return;

        const { laborCost, materials, visitFee, total, visitDate } = offer.offerDetails;
        const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        const printableContent = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #eee;">
                <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0033a0; padding-bottom: 10px;">
                    <div>
                        <h1 style="color: #0033a0; margin: 0; font-size: 28px;">MãoCerta</h1>
                        <p style="margin: 0; color: #555;">Orçamento de Serviço</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0;"><strong>Orçamento #:</strong> ${quote.id.slice(-6)}</p>
                        <p style="margin: 0;"><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                </header>

                <section style="margin-top: 20px; display: flex; justify-content: space-between;">
                    <div>
                        <h2 style="font-size: 16px; color: #333; margin-bottom: 5px;">PARA:</h2>
                        <p style="margin: 0;">${quote.from.fullName}</p>
                        <p style="margin: 0;">${quote.from.address}</p>
                        <p style="margin: 0;">${quote.from.phone}</p>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="font-size: 16px; color: #333; margin-bottom: 5px;">DE:</h2>
                        <p style="margin: 0;">${quote.to.fullName}</p>
                        <p style="margin: 0;">${quote.to.profession}</p>
                        <p style="margin: 0;">${quote.to.phone}</p>
                    </div>
                </section>

                <section style="margin-top: 30px;">
                    <h2 style="font-size: 16px; color: #333; margin-bottom: 10px;">Descrição do Serviço:</h2>
                    <p style="font-style: italic; border-left: 3px solid #ffc72c; padding-left: 10px; color: #555;">
                        ${offer.text}
                    </p>
                </section>

                <section style="margin-top: 30px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead style="background-color: #f2f2f2;">
                            <tr>
                                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
                                <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">Mão de Obra</td>
                                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(laborCost)}</td>
                            </tr>
                            ${materials.map(item => `
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #eee; padding-left: 20px;">- ${item.name}</td>
                                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${formatCurrency(item.price)}</td>
                                </tr>
                            `).join('')}
                            ${visitFee > 0 ? `
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #eee; color: #c00;">Taxa de Visita</td>
                                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee; color: #c00;">${formatCurrency(visitFee)}</td>
                                </tr>
                            ` : ''}
                        </tbody>
                        <tfoot>
                            <tr style="font-weight: bold; font-size: 18px;">
                                <td style="padding: 10px 8px; text-align: right;">TOTAL</td>
                                <td style="padding: 10px 8px; text-align: right;">${formatCurrency(total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </section>

                <footer style="margin-top: 40px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
                    <p>Orçamento válido por 15 dias. Data sugerida para o serviço: ${new Date(visitDate + 'T00:00:00').toLocaleDateString()}.</p>
                    <p>MãoCerta - O profissional certo na hora certa.</p>
                </footer>
            </div>
        `;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.visibility = 'hidden';
        iframe.setAttribute('title', 'Print Frame');

        const cleanup = () => {
            // Check if the iframe is still a child of the body before removing to prevent errors.
            if (iframe.parentNode === document.body) {
                document.body.removeChild(iframe);
            }
        };

        iframe.onload = () => {
            try {
                if (iframe.contentWindow) {
                    iframe.contentWindow.focus(); // Focus for some browser policies
                    iframe.contentWindow.print();
                } else {
                    throw new Error("Iframe content window is not available.");
                }
            } catch (error) {
                console.error("Could not print from iframe:", error);
                alert("Could not open print window. Please disable pop-up blockers and try again.");
            } finally {
                // Cleanup after a delay to allow the print dialog to open.
                setTimeout(cleanup, 1000);
            }
        };

        iframe.onerror = () => {
            alert('An error occurred while loading the print content.');
            cleanup();
        };

        document.body.appendChild(iframe);
        
        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write('<!DOCTYPE html><html><head><title>Orçamento MãoCerta</title></head><body>' + printableContent + '</body></html>');
            doc.close();
        } else {
            alert('An error occurred while trying to generate the quote. Please try again.');
            cleanup(); // Clean up if doc is not available
        }
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
                            onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
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
                                onConfirmVisit={handleConfirmVisit}
                                onOpenChat={handleOpenChat}
                                onReviewService={(quote) => setQuoteToReview(quote)}
                                onAddDenunciation={handleAddDenunciation}
                                onTrackProfessional={(quote) => setTrackingQuote(quote)}
                                onConfirmPayment={handleConfirmPayment}
                                onDownloadPdf={handleDownloadPdf}
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
                                onMarkAsRead={handleMarkSentMessagesAsRead}
                            />
                        )}
                         {isSupportModalOpen && currentUser && (
                            <SupportModal
                                user={currentUser}
                                onClose={() => setIsSupportModalOpen(false)}
                                onSubmit={handleAddSupportTicket}
                            />
                        )}
                        {isEditProfileModalOpen && currentUser && (
                            <EditProfileModal
                                user={currentUser}
                                onClose={() => setIsEditProfileModalOpen(false)}
                                onUpdateUser={handleUpdateUser}
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
                            onOpenChat={handleOpenChat}
                            onCompleteService={handleCompleteService}
                            onOpenSupport={() => setIsSupportModalOpen(true)}
                            onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
                            onStartNavigation={handleStartNavigation}
                            onToggleAvailability={handleToggleAvailability}
                            onRequestPayment={handleRequestPayment}
                            onUpdatePixKey={handleUpdatePixKey}
                            onSendDetailedOffer={handleSendDetailedOffer}
                            onOpenPreliminaryVisitModal={setQuoteForPreliminaryVisit}
                        />
                        {quoteForPreliminaryVisit && (
                            <PreliminaryVisitModal
                                quote={quoteForPreliminaryVisit}
                                onClose={() => setQuoteForPreliminaryVisit(null)}
                                onSubmit={handleSchedulePreliminaryVisit}
                            />
                        )}
                        {chattingQuote && currentUser && (
                             <ChatDialog
                                quote={chattingQuote}
                                currentUser={currentUser}
                                onClose={() => setChattingQuote(null)}
                                onSendMessage={handleSendMessage}
                                onCompleteService={handleCompleteService}
                                onMarkAsRead={handleMarkSentMessagesAsRead}
                            />
                        )}
                        {isSupportModalOpen && currentUser && (
                            <SupportModal
                                user={currentUser}
                                onClose={() => setIsSupportModalOpen(false)}
                                onSubmit={handleAddSupportTicket}
                            />
                        )}
                        {isEditProfileModalOpen && currentUser && (
                            <EditProfileModal
                                user={currentUser}
                                onClose={() => setIsEditProfileModalOpen(false)}
                                onUpdateUser={handleUpdateUser}
                            />
                        )}
                        {navigatingQuote && (
                            <NavigationModal
                                quote={navigatingQuote}
                                onClose={() => setNavigatingQuote(null)}
                                onSendUpdate={handleSendTransitUpdate}
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