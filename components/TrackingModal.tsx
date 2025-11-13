import React from 'react';
import { Quote } from '../types';
import { MapPinIcon, WrenchScrewdriverIcon } from './icons';

interface TrackingModalProps {
    quote: Quote;
    onClose: () => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({ quote, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <style>
                {`
                @keyframes driveRoute {
                    0% {
                        offset-distance: 0%;
                    }
                    100% {
                        offset-distance: 100%;
                    }
                }
                .moving-icon {
                    offset-path: path("M 20 80 Q 50 10, 80 20");
                    animation: driveRoute 20s linear forwards;
                }
                `}
            </style>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                     <div>
                        <h2 className="text-2xl font-bold text-royal-blue">Acompanhando o Profissional</h2>
                        <p className="text-gray-600">{quote.to.fullName} está a caminho!</p>
                     </div>
                    <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-800">&times;</button>
                </div>
                <div className="mb-4 text-center font-semibold text-lg">
                    <span>Chegada Prevista: </span>
                    <span className="text-royal-blue">{quote.eta}</span>
                </div>

                {quote.transitUpdate && (
                    <div className="my-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg animate-fade-in">
                        <p className="font-semibold text-blue-800">Última atualização do profissional:</p>
                        <p className="text-blue-700 italic">"{quote.transitUpdate.text}"</p>
                        <p className="text-xs text-right text-gray-500 mt-1">
                            {new Date(quote.transitUpdate.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                )}

                <div className="bg-gray-200 h-80 w-full rounded-lg relative overflow-hidden shadow-inner">
                    <img 
                        src="https://www.medjugorje-news.com/wp-content/uploads/2021/08/google-maps.jpg" 
                        alt="Mapa simulado" 
                        className="w-full h-full object-cover opacity-80"
                    />
                    {/* Start Pin */}
                    <div className="absolute top-[80%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <MapPinIcon className="w-8 h-8 text-blue-600 drop-shadow-lg" />
                        <span className="text-xs font-bold bg-white text-blue-600 px-2 py-0.5 rounded-full shadow-md">Partida</span>
                    </div>
                    {/* End Pin */}
                     <div className="absolute top-[20%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <MapPinIcon className="w-8 h-8 text-red-600 drop-shadow-lg" />
                        <span className="text-xs font-bold bg-white text-red-600 px-2 py-0.5 rounded-full shadow-md">Você</span>
                    </div>
                     {/* Route Line & Moving Icon (SVG) */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path 
                            id="route"
                            d="M 20 80 Q 50 10, 80 20" 
                            stroke="rgba(0, 51, 160, 0.6)" 
                            strokeWidth="1" 
                            fill="none" 
                            strokeDasharray="2 1"
                        />
                        <foreignObject className="moving-icon" width="24" height="24">
                           <div className="bg-royal-blue p-1 rounded-full shadow-lg">
                               <WrenchScrewdriverIcon className="w-4 h-4 text-white" />
                           </div>
                        </foreignObject>
                    </svg>
                </div>
                <div className="mt-6 text-right">
                     <button onClick={onClose} className="bg-royal-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-800">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};