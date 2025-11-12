import React, { useState } from 'react';
import { Client, Professional, Denunciation, Banner, SupportTicket } from '../types';

interface AdminDashboardProps {
  clients: Client[];
  professionals: Professional[];
  denunciations: Denunciation[];
  banners: Banner[];
  supportTickets: SupportTicket[];
  onBannersChange: (banners: Banner[]) => void;
  onProfessionalsChange: (professionals: Professional[]) => void;
  onClientsChange: (clients: Client[]) => void;
  onReplyToTicket: (ticketId: string, message: string) => void;
  onToggleTicketStatus: (ticketId: string) => void;
  onLogout: () => void;
}

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'maocertaadm' && password === 'vecolorli') {
      onLogin();
    } else {
      setError('Nome de usuário ou senha incorretos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-royal-blue">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-royal-blue mb-6">Acesso Administrativo</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Usuário</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-gold-yellow text-royal-blue font-bold py-2 rounded-lg">Entrar</button>
        </form>
      </div>
    </div>
  );
};

const ManageProfessionalModal: React.FC<{
    professional: Professional;
    onClose: () => void;
    onUpdate: (updatedProfessional: Professional) => void;
    onBan: () => void;
}> = ({ professional, onClose, onUpdate, onBan }) => {
    const [newWarning, setNewWarning] = useState('');
    const [blockUntilDate, setBlockUntilDate] = useState(professional.blockedUntil || '');

    const handleAddWarning = () => {
        if (newWarning.trim()) {
            const updatedProfessional = {
                ...professional,
                warnings: [...(professional.warnings || []), newWarning],
            };
            onUpdate(updatedProfessional);
            setNewWarning('');
        }
    };

    const handleSetBlock = () => {
        const updatedProfessional = { ...professional, blockedUntil: blockUntilDate };
        onUpdate(updatedProfessional);
    };

    const handleClearBlock = () => {
        const updatedProfessional = { ...professional, blockedUntil: '' };
        onUpdate(updatedProfessional);
        setBlockUntilDate('');
    };

    return (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-gray-800">&times;</button>
                <h3 className="text-2xl font-bold text-royal-blue mb-4">Gerenciar {professional.fullName}</h3>
                
                {/* Warnings Section */}
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Advertências</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded border">
                        {(professional.warnings || []).length > 0 ? (
                            professional.warnings?.map((warning, index) => (
                                <p key={index} className="text-sm text-gray-700 border-b pb-1"> - {warning}</p>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">Nenhuma advertência registrada.</p>
                        )}
                    </div>
                    <div className="flex mt-2">
                        <input 
                            type="text" 
                            value={newWarning}
                            onChange={e => setNewWarning(e.target.value)}
                            placeholder="Adicionar nova advertência..."
                            className="flex-grow p-2 border rounded-l-md"
                        />
                        <button onClick={handleAddWarning} className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600">Adicionar</button>
                    </div>
                </div>

                {/* Block Section */}
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Bloqueio Temporário</h4>
                    <div className="flex items-center space-x-2">
                        <input 
                            type="date" 
                            value={blockUntilDate}
                            onChange={e => setBlockUntilDate(e.target.value)}
                            className="p-2 border rounded-md"
                        />
                         <button onClick={handleSetBlock} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Bloquear até</button>
                         <button onClick={handleClearBlock} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Limpar Bloqueio</button>
                    </div>
                </div>

                {/* Ban Section */}
                <div>
                     <h4 className="font-semibold text-red-700 mb-2">Ação Permanente</h4>
                     <button onClick={onBan} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">Banir Profissional</button>
                     <p className="text-xs text-gray-500 mt-1">O banimento remove o profissional do sistema permanentemente.</p>
                </div>

            </div>
        </div>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ clients, professionals, denunciations, banners, supportTickets, onBannersChange, onProfessionalsChange, onClientsChange, onReplyToTicket, onToggleTicketStatus, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [managingProfessional, setManagingProfessional] = useState<Professional | null>(null);
  const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(null);
  const [adminReply, setAdminReply] = useState('');


  // State for payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    monthlyFee: 100,
    methods: {
      pix: true,
      creditCard: true,
      boleto: true,
    },
    pixKey: 'financeiro@maocerta.com',
    bankDetails: 'Banco MãoCerta S.A. | Ag: 0001 | C/C: 12345-6 | CNPJ: 12.345.678/0001-99',
  });

  // State for new banner form
  const [newBanner, setNewBanner] = useState({ imageUrl: '', title: '', link: '#' });

  const handleNewBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewBanner(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBanner = (e: React.FormEvent) => {
      e.preventDefault();
      if (newBanner.imageUrl && newBanner.title) {
          const bannerToAdd: Banner = { ...newBanner, id: `banner-${Date.now()}` };
          onBannersChange([...banners, bannerToAdd]);
          setNewBanner({ imageUrl: '', title: '', link: '#' }); // Reset form
      } else {
          alert('Por favor, preencha a URL da Imagem e o Título do Banner.');
      }
  };

  const handleDeleteBanner = (bannerId: string) => {
      if (window.confirm('Tem certeza que deseja excluir este banner?')) {
          onBannersChange(banners.filter(b => b.id !== bannerId));
      }
  };

  const handleUpdateProfessional = (updatedProfessional: Professional) => {
      const updatedList = professionals.map(p => p.id === updatedProfessional.id ? updatedProfessional : p);
      onProfessionalsChange(updatedList);
      setManagingProfessional(updatedProfessional); // Keep modal open with updated data
  };

  const handleConfirmAndBanProfessional = () => {
    if (!managingProfessional) return;

    if (window.confirm(`Tem certeza que deseja banir permanentemente ${managingProfessional.fullName}? Esta ação não pode ser desfeita.`)) {
        onProfessionalsChange(professionals.filter(p => p.id !== managingProfessional.id));
        setManagingProfessional(null); // Close modal
    }
  };
  
  const handleBanClient = (clientId: string) => {
    if (window.confirm('Tem certeza que deseja banir este cliente? Esta ação não pode ser desfeita.')) {
        onClientsChange(clients.filter(c => c.id !== clientId));
    }
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
      e.preventDefault();
      if (viewingTicket && adminReply.trim()) {
          onReplyToTicket(viewingTicket.id, adminReply);
          setAdminReply('');
      }
  };
  
  // Update viewingTicket with fresh data from props
  React.useEffect(() => {
    if (viewingTicket) {
      setViewingTicket(supportTickets.find(t => t.id === viewingTicket.id) || null);
    }
  }, [supportTickets, viewingTicket]);


  // Handler for input changes
  const handlePaymentSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setPaymentSettings(prev => ({
        ...prev,
        methods: {
          ...prev.methods,
          [name]: checked,
        },
      }));
    } else {
      setPaymentSettings(prev => ({
        ...prev,
        [name]: name === 'monthlyFee' ? Number(value) || 0 : value,
      }));
    }
  };

  // Handler for saving settings
  const handleSavePaymentSettings = () => {
    // In a real app, this would be an API call
    console.log('Saving payment settings:', paymentSettings);
    alert('Configurações de pagamento salvas com sucesso!');
  };


  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <aside className="w-64 bg-royal-blue text-white flex flex-col">
        <div className="p-4 text-center border-b border-blue-500">
          <h1 className="text-2xl font-bold text-gold-yellow">MãoCerta ADM</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('users')} className={`w-full text-left p-2 rounded ${activeTab === 'users' ? 'bg-gold-yellow text-royal-blue' : ''}`}>Gerenciar Usuários</button>
          <button onClick={() => setActiveTab('content')} className={`w-full text-left p-2 rounded ${activeTab === 'content' ? 'bg-gold-yellow text-royal-blue' : ''}`}>Gerenciar Conteúdo</button>
          <button onClick={() => setActiveTab('denunciations')} className={`w-full text-left p-2 rounded ${activeTab === 'denunciations' ? 'bg-gold-yellow text-royal-blue' : ''}`}>Denúncias</button>
          <button onClick={() => setActiveTab('support')} className={`w-full text-left p-2 rounded ${activeTab === 'support' ? 'bg-gold-yellow text-royal-blue' : ''}`}>Suporte</button>
        </nav>
        <div className="p-4 border-t border-blue-500">
            <button onClick={onLogout} className="w-full bg-red-500 p-2 rounded hover:bg-red-600">Sair</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Usuários</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Profissionais ({professionals.length})</h3>
                <div className="space-y-2 bg-white p-4 rounded-lg shadow max-h-[70vh] overflow-y-auto">
                  {professionals.map(p => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Set to midnight for fair comparison
                    const blockDate = p.blockedUntil ? new Date(`${p.blockedUntil}T00:00:00`) : null;
                    const isBlocked = blockDate && blockDate >= today;

                    return (
                        <div key={p.id} className="p-2 border-b flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{p.fullName}</p>
                                <p className={`text-xs font-bold ${isBlocked ? 'text-orange-500' : 'text-green-500'}`}>
                                    {isBlocked ? `BLOQUEADO ATÉ ${blockDate.toLocaleDateString()}` : 'ATIVO'}
                                </p>
                            </div>
                            <button onClick={() => setManagingProfessional(p)} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded hover:bg-gray-300">Gerenciar</button>
                        </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Clientes ({clients.length})</h3>
                <div className="space-y-2 bg-white p-4 rounded-lg shadow max-h-[70vh] overflow-y-auto">
                  {clients.map(c => <div key={c.id} className="p-2 border-b flex justify-between items-center">{c.fullName} <button onClick={() => handleBanClient(c.id)} className="text-red-500 text-xs hover:underline">Banir</button></div>)}
                </div>
              </div>
            </div>
          </div>
        )}
         {activeTab === 'content' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Gerenciar Conteúdo</h2>
            <div className="space-y-8">
                 {/* Banners and Ads section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-royal-blue mb-4">Banners e Propagandas</h3>
                    
                    {/* Form to add banner */}
                    <form onSubmit={handleAddBanner} className="mb-6 p-4 border rounded-md space-y-3 bg-gray-50">
                        <h4 className="font-semibold text-gray-700">Adicionar Novo Banner</h4>
                        <div>
                            <label className="block text-sm font-medium">URL da Imagem</label>
                            <input type="text" name="imageUrl" value={newBanner.imageUrl} onChange={handleNewBannerChange} placeholder="https://exemplo.com/imagem.png" className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Título do Banner</label>
                            <input type="text" name="title" value={newBanner.title} onChange={handleNewBannerChange} placeholder="Ex: Promoção de Inverno!" className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Link de Destino (opcional)</label>
                            <input type="text" name="link" value={newBanner.link} onChange={handleNewBannerChange} placeholder="https://exemplo.com/promo" className="w-full p-2 border rounded-md" />
                        </div>
                        <button type="submit" className="bg-royal-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800">Adicionar Banner</button>
                    </form>

                    {/* List of current banners */}
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Banners Atuais</h4>
                        <div className="space-y-4">
                            {banners.map(banner => (
                                <div key={banner.id} className="flex items-center justify-between p-3 border rounded-md bg-white">
                                    <div className="flex items-center space-x-4">
                                        <img src={banner.imageUrl} alt={banner.title} className="w-24 h-12 object-cover rounded"/>
                                        <div>
                                            <p className="font-semibold">{banner.title}</p>
                                            <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{banner.link}</a>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteBanner(banner.id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600">Excluir</button>
                                </div>
                            ))}
                            {banners.length === 0 && <p className="text-sm text-gray-500">Nenhum banner cadastrado.</p>}
                        </div>
                    </div>
                </div>

                {/* Payment Settings section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-royal-blue mb-4">Configurações de Pagamento da Assinatura</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor da Mensalidade (R$)</label>
                            <input
                            type="number"
                            name="monthlyFee"
                            value={paymentSettings.monthlyFee}
                            onChange={handlePaymentSettingsChange}
                            className="mt-1 block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Métodos de Pagamento Aceitos</label>
                            <div className="space-y-2">
                            <label className="flex items-center">
                                <input type="checkbox" name="pix" checked={paymentSettings.methods.pix} onChange={handlePaymentSettingsChange} className="h-4 w-4 rounded border-gray-300 text-royal-blue focus:ring-royal-blue" />
                                <span className="ml-2 text-gray-800">Pix</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" name="creditCard" checked={paymentSettings.methods.creditCard} onChange={handlePaymentSettingsChange} className="h-4 w-4 rounded border-gray-300 text-royal-blue focus:ring-royal-blue" />
                                <span className="ml-2 text-gray-800">Cartão de Crédito</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" name="boleto" checked={paymentSettings.methods.boleto} onChange={handlePaymentSettingsChange} className="h-4 w-4 rounded border-gray-300 text-royal-blue focus:ring-royal-blue" />
                                <span className="ml-2 text-gray-800">Boleto Bancário</span>
                            </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chave Pix</label>
                            <input
                            type="text"
                            name="pixKey"
                            value={paymentSettings.pixKey}
                            onChange={handlePaymentSettingsChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
                            placeholder="Ex: email@dominio.com ou 123.456.789-00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dados para Boleto / Transferência</label>
                            <textarea
                            name="bankDetails"
                            value={paymentSettings.bankDetails}
                            onChange={handlePaymentSettingsChange}
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"
                            placeholder="Banco, Agência, Conta Corrente, CNPJ"
                            ></textarea>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                            Para Cartão de Crédito, a integração deve ser feita com um provedor de pagamentos (Ex: Stripe, PagSeguro). As chaves de API seriam configuradas aqui.
                            </p>
                        </div>
                        <div className="text-right">
                            <button
                            onClick={handleSavePaymentSettings}
                            className="bg-royal-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors"
                            >
                            Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}
        {activeTab === 'denunciations' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Denúncias Recebidas</h2>
            <div className="space-y-4">
                {denunciations.map(d => (
                    <div key={d.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                        <p><strong>Cliente:</strong> {d.client.fullName}</p>
                        <p><strong>Profissional:</strong> {d.professional.fullName}</p>
                        <p><strong>Motivo:</strong> {d.reason}</p>
                        <p><strong>Descrição:</strong> "{d.description}"</p>
                        <p className="text-sm text-gray-500 mt-2">{new Date(d.date).toLocaleString()}</p>
                    </div>
                ))}
            </div>
          </div>
        )}
        {activeTab === 'support' && (
             <div>
                <h2 className="text-2xl font-bold mb-4">Tickets de Suporte</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Ticket List */}
                    <div className="bg-white p-4 rounded-lg shadow max-h-[75vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-2">Caixa de Entrada</h3>
                         {supportTickets.map(ticket => (
                            <div key={ticket.id} onClick={() => setViewingTicket(ticket)} className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${viewingTicket?.id === ticket.id ? 'bg-blue-50' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{ticket.subject}</p>
                                        <p className="text-sm text-gray-600">{ticket.clientOrProfessional.fullName}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ticket.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                                        {ticket.status === 'open' ? 'Aberto' : 'Fechado'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                            </div>
                         ))}
                    </div>
                    {/* Ticket Details */}
                    <div className="bg-white p-4 rounded-lg shadow">
                         {viewingTicket ? (
                            <div className="flex flex-col h-[75vh]">
                                <div className="border-b pb-3 mb-3">
                                    <h3 className="text-xl font-semibold">{viewingTicket.subject}</h3>
                                    <p className="text-sm">De: <span className="font-medium">{viewingTicket.clientOrProfessional.fullName}</span></p>
                                    <button onClick={() => onToggleTicketStatus(viewingTicket.id)} className={`mt-2 text-sm font-bold py-1 px-3 rounded-lg ${viewingTicket.status === 'open' ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-400 hover:bg-gray-500 text-white'}`}>
                                        {viewingTicket.status === 'open' ? 'Marcar como Resolvido' : 'Reabrir Ticket'}
                                    </button>
                                </div>
                                <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                                    {viewingTicket.messages.map((msg, index) => (
                                        <div key={index} className={`p-3 rounded-lg w-fit max-w-sm ${msg.senderId === 'admin' ? 'bg-royal-blue text-white ml-auto' : 'bg-gray-200 text-gray-800'}`}>
                                            <p className="text-sm font-bold">{msg.senderName}</p>
                                            <p>{msg.text}</p>
                                            <p className="text-xs text-right opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleSendAdminReply} className="mt-4 border-t pt-4">
                                    <textarea 
                                        value={adminReply}
                                        onChange={e => setAdminReply(e.target.value)}
                                        placeholder="Digite sua resposta..."
                                        rows={3}
                                        className="w-full p-2 border rounded-md"
                                        disabled={viewingTicket.status === 'closed'}
                                    />
                                    <button type="submit" className="w-full mt-2 bg-royal-blue text-white font-bold py-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400" disabled={viewingTicket.status === 'closed'}>
                                        Enviar Resposta
                                    </button>
                                </form>
                            </div>
                         ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Selecione um ticket para visualizar.</p>
                            </div>
                         )}
                    </div>
                </div>
             </div>
        )}
      </main>

      {managingProfessional && (
        <ManageProfessionalModal 
            professional={managingProfessional}
            onClose={() => setManagingProfessional(null)}
            onUpdate={handleUpdateProfessional}
            onBan={handleConfirmAndBanProfessional}
        />
      )}
    </div>
  );
};