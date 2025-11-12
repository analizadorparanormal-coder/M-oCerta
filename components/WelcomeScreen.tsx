
import React from 'react';
import { UserRole } from '../types';
import { WrenchScrewdriverIcon, BriefcaseIcon, AppleIcon, AndroidIcon } from './icons';

interface WelcomeScreenProps {
  onRoleSelect: (role: UserRole) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onRoleSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-royal-blue text-white p-4 text-center">
      <div className="w-24 h-24 mb-4 bg-gold-yellow text-royal-blue rounded-full flex items-center justify-center">
         <WrenchScrewdriverIcon className="w-12 h-12" />
      </div>
      <h1 className="text-5xl font-bold text-gold-yellow">MãoCerta</h1>
      <p className="mt-2 text-lg italic">O profissional certo na hora certa.</p>

      <div className="mt-16 w-full max-w-md space-y-6">
        <button
          onClick={() => onRoleSelect(UserRole.CLIENT)}
          className="w-full bg-white text-royal-blue font-bold py-4 px-6 rounded-lg text-xl shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105 flex items-center justify-center"
        >
          <BriefcaseIcon className="w-7 h-7 mr-3"/>
          Sou Cliente
        </button>
        <button
          onClick={() => onRoleSelect(UserRole.PROFESSIONAL)}
          className="w-full bg-gold-yellow text-royal-blue font-bold py-4 px-6 rounded-lg text-xl shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-105 flex items-center justify-center"
        >
          <WrenchScrewdriverIcon className="w-7 h-7 mr-3"/>
          Sou Profissional
        </button>
      </div>
      
      {/* Download section */}
      <div className="mt-12 w-full max-w-md">
        <p className="text-white/80 mb-4">Baixe nosso aplicativo</p>
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-3 sm:space-y-0">
            <a href="#" className="flex items-center justify-center border-2 border-white/50 text-white/80 font-semibold py-2 px-5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                <AppleIcon className="w-6 h-6 mr-2" />
                <span>App Store</span>
            </a>
            <a href="#" className="flex items-center justify-center border-2 border-white/50 text-white/80 font-semibold py-2 px-5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                <AndroidIcon className="w-6 h-6 mr-2" />
                <span>Google Play</span>
            </a>
        </div>
      </div>

      {/* Admin access button */}
      <div className="absolute bottom-4 right-4">
        <button onClick={() => onRoleSelect(UserRole.ADMIN)} className="text-xs text-white/50 hover:text-white">
            Admin
        </button>
      </div>
    </div>
  );
};