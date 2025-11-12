
import React, { useState } from 'react';
import { UserRole, Profession, User } from '../types';
import { PROFESSIONS_LIST, MOCK_CLIENTS, MOCK_PROFESSIONALS } from '../constants';

// --- Helper Components ---

interface FormTitleProps {
  isLogin: boolean;
  role: UserRole;
}

const FormTitle: React.FC<FormTitleProps> = ({ isLogin, role }) => (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-royal-blue">
      {isLogin ? 'Login de ' : 'Cadastro de '}
      {role === UserRole.CLIENT ? 'Cliente' : 'Profissional'}
    </h2>
    <p className="text-gray-600 mt-2">
      {isLogin ? 'Bem-vindo(a) de volta!' : 'Preencha seus dados para começar.'}
    </p>
  </div>
);

interface CommonFieldsProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const CommonFields: React.FC<CommonFieldsProps> = ({ email, password, onEmailChange, onPasswordChange }) => (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input 
          type="email" 
          required 
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Senha</label>
      <input 
          type="password" 
          required 
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
    </div>
  </>
);

const RegistrationFields: React.FC = () => (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
      <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Telefone</label>
      <input type="tel" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
    </div>
     <div>
      <label className="block text-sm font-medium text-gray-700">Endereço</label>
      <input type="text" required placeholder="Ex: Rua das Flores, 123" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
      <input type="file" required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-royal-blue/10 file:text-royal-blue hover:file:bg-royal-blue/20"/>
    </div>
  </>
);

const ProfessionalFields: React.FC = () => (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700">CPF / CNPJ</label>
      <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Profissão</label>
      <select required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue">
        {PROFESSIONS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Experiência</label>
      <textarea placeholder="Descreva brevemente sua experiência..." required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"></textarea>
    </div>
     <div>
      <label className="block text-sm font-medium text-gray-700">Conta Bancária</label>
      <input type="text" placeholder="Agência e Conta" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
    </div>
  </>
);

// --- Main Component ---

interface AuthScreenProps {
  role: UserRole;
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ role, onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
        if (password !== 'senha123') {
            setError('Senha incorreta. Use "senha123" para teste.');
            return;
        }

        let user: User | undefined;
        if (role === UserRole.CLIENT) {
            user = MOCK_CLIENTS.find(c => c.email === email);
        } else if (role === UserRole.PROFESSIONAL) {
            user = MOCK_PROFESSIONALS.find(p => p.email === email);
        }

        if (user) {
            onAuthSuccess(user);
        } else {
            setError('Usuário não encontrado. Use cliente@teste.com ou profissional@teste.com.');
        }

    } else {
      // Simulate successful registration and login with the first mock user of that role
      const mockUser = role === UserRole.CLIENT ? MOCK_CLIENTS[0] : MOCK_PROFESSIONALS[0];
      onAuthSuccess(mockUser);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
        <button onClick={onBack} className="absolute top-6 left-6 text-royal-blue hover:underline">
            &larr; Voltar
        </button>
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <FormTitle isLogin={isLogin} role={role} />

            <form onSubmit={handleSubmit} className="space-y-4">
                {isLogin ? (
                    <CommonFields 
                        email={email} 
                        password={password} 
                        onEmailChange={setEmail} 
                        onPasswordChange={setPassword} 
                    />
                ) : (
                    <>
                    <RegistrationFields />
                    {role === UserRole.PROFESSIONAL && <ProfessionalFields />}
                    <CommonFields 
                        email={email} 
                        password={password} 
                        onEmailChange={setEmail} 
                        onPasswordChange={setPassword} 
                    />
                    </>
                )}
                
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                
                <button
                    type="submit"
                    className="w-full bg-royal-blue text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:bg-blue-800 transition-colors"
                >
                    {isLogin ? 'Entrar' : 'Cadastrar'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-royal-blue hover:underline">
                {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
            </p>
        </div>
    </div>
  );
};
