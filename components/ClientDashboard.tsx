import React, { useState, useEffect } from 'react';
import { Client, Professional, Profession, Banner } from '../types';
import { MOCK_PROFESSIONALS } from '../constants';
import { MapPinIcon, StarIcon, QuestionMarkCircleIcon, PencilSquareIcon } from './icons';

interface InteractiveMapProps {
  userLocation: { lat: number; lon: number } | null;
  professionals: Professional[];
  onSelectProfessional: (professional: Professional) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ userLocation, professionals, onSelectProfessional }) => {
  // Use a simple hashing function to generate consistent pseudo-random positions for professionals
  const getPosition = (id: string, index: number) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        const char = id.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    const top = Math.abs(hash % 80) + 10; // 10% to 90%
    const left = Math.abs((hash / 100) % 80) + 10; // 10% to 90%
    
    // Ensure pins don't overlap too much by adding index
    const adjustedTop = (top + index * 12) % 85 + 7.5;
    const adjustedLeft = (left + index * 18) % 85 + 7.5;

    return { top: `${adjustedTop}%`, left: `${adjustedLeft}%` };
  };

  return (
    <div className="bg-blue-100 h-96 w-full rounded-lg shadow-md relative overflow-hidden border-4 border-white">
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-cyan-200/50"></div>

      {userLocation && (
        <div 
          className="absolute z-20 flex flex-col items-center"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          title="Sua localização"
        >
          <MapPinIcon className="w-10 h-10 text-red-500 drop-shadow-lg" />
          <span className="text-xs font-bold bg-white text-red-600 px-2 py-1 rounded-full shadow-md -mt-2">Você</span>
        </div>
      )}

      {professionals.slice(0, 5).map((p, index) => { 
        const position = getPosition(p.id, index);
        return (
          <div
            key={p.id}
            className="absolute z-10 group cursor-pointer flex flex-col items-center transition-transform hover:z-30 hover:scale-110"
            style={{ top: position.top, left: position.left, transform: 'translate(-50%, -100%)' }}
            onClick={() => onSelectProfessional(p)}
          >
            <img
              src={p.profilePictureUrl}
              alt={p.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg group-hover:border-gold-yellow"
            />
            <div className="w-0 h-0 
              border-l-8 border-l-transparent
              border-r-8 border-r-transparent
              border-t-8 border-t-white
              drop-shadow-lg
              -mt-1
              "
            ></div>
            <span className="hidden group-hover:block absolute -top-8 bg-royal-blue text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
              {p.fullName}
            </span>
          </div>
        );
      })}
       <div className="absolute bottom-2 right-2 bg-white/70 text-royal-blue text-xs px-2 py-1 rounded shadow">
        Mapa Interativo (Simulado)
      </div>
    </div>
  );
};


interface ClientDashboardProps {
  client: Client;
  banners: Banner[];
  onSelectProfessional: (professional: Professional) => void;
  onLogout: () => void;
  onOpenPanel: () => void;
  onOpenSupport: () => void;
  onOpenEditProfile: () => void;
  hasNewOffers?: boolean;
}

// Fix: Extract props to a dedicated interface to resolve 'key' prop error with TypeScript.
interface ProfessionalCardProps {
  professional: Professional;
  onSelect: (p: Professional) => void;
}

// FIX: Changed component signature to React.FC<ProfessionalCardProps> to correctly handle the 'key' prop provided by React during list rendering.
const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, onSelect }) => (
    <div onClick={() => onSelect(professional)} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300">
      <img src={professional.profilePictureUrl} alt={professional.fullName} className="w-20 h-20 rounded-full object-cover border-4 border-gold-yellow" />
      <div className="flex-1">
        <h3 className="font-bold text-lg text-royal-blue">{professional.fullName}</h3>
        <p className="text-gray-600">{professional.profession}</p>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <StarIcon className="w-5 h-5 text-gold-yellow mr-1" />
          <span>{professional.rating.toFixed(1)} ({professional.reviewsCount} avaliações)</span>
          <span className="mx-2">|</span>
          <MapPinIcon className="w-5 h-5 text-gray-400 mr-1" />
          <span>{professional.distance.toFixed(1)} km</span>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${professional.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {professional.isAvailable ? 'Disponível' : 'Ocupado'}
      </span>
    </div>
);

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ client, banners, onSelectProfessional, onLogout, onOpenPanel, onOpenSupport, onOpenEditProfile, hasNewOffers }) => {
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [professionFilter, setProfessionFilter] = useState<Profession | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [specificService, setSpecificService] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        // Fallback location
        setUserLocation({ lat: -23.5505, lon: -46.6333 }); 
      }
    );
  }, []);

  useEffect(() => {
    let filtered = MOCK_PROFESSIONALS;

    // Filter by profession
    if (professionFilter !== 'all') {
      filtered = filtered.filter(p => p.profession === professionFilter);
    }

    // Filter by availability
    if (showOnlyAvailable) {
      filtered = filtered.filter(p => p.isAvailable);
    }

    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }
    
    // Filter by general search term (name, profession, experience)
    if (searchTerm.trim() !== '') {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
            p.fullName.toLowerCase().includes(lowercasedSearchTerm) ||
            p.profession.toLowerCase().includes(lowercasedSearchTerm) ||
            p.experience.toLowerCase().includes(lowercasedSearchTerm)
        );
    }
    
    // Filter by specific service
    if (specificService.trim() !== '') {
        const lowercasedService = specificService.toLowerCase();
        filtered = filtered.filter(p => 
            p.services.some(service => service.toLowerCase().includes(lowercasedService))
        );
    }

    // Date range filter for services history
    if (startDate || endDate) {
        filtered = filtered.filter(p => 
            p.servicesHistory.some(service => {
                const serviceDate = new Date(service.date);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                if (end) end.setHours(23, 59, 59, 999); // Include the entire end day

                if (start && end) {
                    return serviceDate >= start && serviceDate <= end;
                }
                if (start) {
                    return serviceDate >= start;
                }
                if (end) {
                    return serviceDate <= end;
                }
                return false;
            })
        );
    }

    setProfessionals(filtered);
  }, [professionFilter, showOnlyAvailable, minRating, searchTerm, specificService, startDate, endDate]);
  
  const professionImages: Record<Profession, string> = {
    [Profession.ELECTRICIAN]: 'https://picsum.photos/seed/electric/800/200',
    [Profession.MASON]: 'https://picsum.photos/seed/mason/800/200',
    [Profession.TILER]: 'https://picsum.photos/seed/tiler/800/200',
    [Profession.POOL_CLEANER]: 'https://picsum.photos/seed/pool/800/200',
    [Profession.PLUMBER]: 'https://picsum.photos/seed/plumber/800/200',
    [Profession.LEAK_DETECTOR]: 'https://picsum.photos/seed/leak/800/200',
    [Profession.GARDENER]: 'https://picsum.photos/seed/garden/800/200',
    [Profession.IRONER]: 'https://picsum.photos/seed/iron/800/200',
    [Profession.ELDERLY_CAREGIVER]: 'https://picsum.photos/seed/care/800/200',
    [Profession.NANNY]: 'https://picsum.photos/seed/nanny/800/200',
    [Profession.HOUSEKEEPER]: 'https://picsum.photos/seed/house/800/200',
  }

  const resetFilters = () => {
    setProfessionFilter('all');
    setSearchTerm('');
    setMinRating(0);
    setShowOnlyAvailable(false);
    setSpecificService('');
    setStartDate('');
    setEndDate('');
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
            <div className="w-10 h-10 bg-gold-yellow text-royal-blue rounded-full flex items-center justify-center font-bold text-xl">M</div>
            <h1 className="text-2xl font-bold text-royal-blue ml-3">MãoCerta</h1>
        </div>
        <div className="flex items-center space-x-4">
            <span className="font-semibold hidden sm:block">Olá, {client.fullName.split(' ')[0]}!</span>
            <button onClick={onOpenEditProfile} className="text-royal-blue font-semibold hover:underline px-2 py-1 flex items-center space-x-1">
                <PencilSquareIcon className="w-5 h-5" />
                <span className="hidden md:inline">Editar Perfil</span>
            </button>
            <button onClick={onOpenSupport} className="text-royal-blue font-semibold hover:underline px-2 py-1 flex items-center space-x-1">
                <QuestionMarkCircleIcon className="w-5 h-5" />
                <span className="hidden md:inline">Suporte</span>
            </button>
            <button onClick={onOpenPanel} className="relative text-royal-blue font-semibold hover:underline px-2 py-1">
                Meu Painel
                {hasNewOffers && (
                    <span className="absolute top-0 right-0 -mr-1 -mt-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-yellow opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-yellow"></span>
                    </span>
                )}
            </button>
            <button onClick={onLogout} className="bg-royal-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors">Sair</button>
        </div>
      </header>

      <main className="p-4 md:p-8">
        {hasNewOffers && (
            <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-gold-yellow text-royal-blue p-4 rounded-lg shadow-lg flex items-center justify-between animate-pulse">
                    <p className="font-bold">Você tem novas propostas de orçamento aguardando sua resposta!</p>
                    <button onClick={onOpenPanel} className="bg-royal-blue text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-800 transition-colors">
                        Ver Propostas
                    </button>
                </div>
            </div>
        )}

        {/* Banners Section */}
        {banners.length > 0 && (
            <div className="max-w-6xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map(banner => (
                    <a key={banner.id} href={banner.link} target="_blank" rel="noopener noreferrer" className="block rounded-lg shadow-lg overflow-hidden group relative transform hover:scale-105 transition-transform duration-300">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                        <h3 className="absolute bottom-4 left-4 font-bold text-xl text-white drop-shadow-md">{banner.title}</h3>
                    </a>
                ))}
                </div>
            </div>
        )}

        <div className="max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Encontre o profissional ideal</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="profession-filter" className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
                        <select
                            id="profession-filter"
                            value={professionFilter}
                            onChange={(e) => setProfessionFilter(e.target.value as Profession | 'all')}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-royal-blue"
                         >
                            <option value="all">Todas as profissões</option>
                            {Object.values(Profession).map(p => <option key={p} value={p}>{p}</option>)}
                         </select>
                    </div>
                    <div>
                        <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1">Busca Geral</label>
                        <input
                            id="search-term"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nome, profissão..."
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                        />
                    </div>
                     <div>
                        <label htmlFor="service-filter" className="block text-sm font-medium text-gray-700 mb-1">Serviço Específico</label>
                        <input
                            id="service-filter"
                            type="text"
                            value={specificService}
                            onChange={(e) => setSpecificService(e.target.value)}
                            placeholder="Ex: Instalar termostato..."
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                        />
                    </div>
                    <div>
                        <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-1">Avaliação mínima</label>
                        <select
                            id="rating-filter"
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-royal-blue"
                        >
                            <option value="0">Qualquer</option>
                            <option value="4.5">4.5+ estrelas</option>
                            <option value="4">4+ estrelas</option>
                            <option value="3">3+ estrelas</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Serviços a partir de</label>
                        <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                        />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Serviços até</label>
                        <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                        />
                    </div>
                     <div className="flex items-center justify-start h-full pb-1 lg:col-start-4">
                        <label className="flex items-center space-x-2 cursor-pointer bg-gray-50 p-2.5 rounded-lg hover:bg-gray-100 w-full border border-gray-300">
                            <input
                                type="checkbox"
                                checked={showOnlyAvailable}
                                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-royal-blue focus:ring-royal-blue"
                            />
                            <span className="text-sm font-medium text-gray-700">Apenas disponíveis</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 {professionFilter !== 'all' && (
                    <div className="w-full h-40 rounded-lg overflow-hidden shadow-lg mb-6">
                        <img src={professionImages[professionFilter]} alt={professionFilter} className="w-full h-full object-cover"/>
                    </div>
                 )}
                {professionals.length > 0 ? (
                    professionals.map(prof => <ProfessionalCard key={prof.id} professional={prof} onSelect={onSelectProfessional} />)
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                        <p>Nenhum profissional encontrado com os filtros aplicados.</p>
                        <button onClick={resetFilters} className="mt-4 text-sm text-royal-blue font-semibold hover:underline">
                            Limpar filtros
                        </button>
                    </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <InteractiveMap 
                  userLocation={userLocation}
                  professionals={professionals}
                  onSelectProfessional={onSelectProfessional}
                />
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};