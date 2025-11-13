import React, { useState } from 'react';
import { User, Professional, UserRole, Profession } from '../types';
import { PROFESSIONS_LIST } from '../constants';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onUpdateUser }) => {
    const [isSaving, setIsSaving] = useState(false);

    // Using state to manage form data for a more controlled component approach
    const [formData, setFormData] = useState({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        // Professional specific
        profession: user.role === UserRole.PROFESSIONAL ? (user as Professional).profession : undefined,
        experience: user.role === UserRole.PROFESSIONAL ? (user as Professional).experience : '',
        // Password
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert('As novas senhas não coincidem.');
            return;
        }

        setIsSaving(true);
        
        // Construct the updated user object from state
        const updatedUser: User = {
            ...user,
            ...formData,
        };

        console.log("Simulating profile update for:", updatedUser.fullName);

        // Simulate API call
        setTimeout(() => {
            onUpdateUser(updatedUser);
            setIsSaving(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-royal-blue text-center">Editar Perfil</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    {/* Common Fields */}
                    <fieldset>
                        <legend className="text-lg font-semibold text-gray-800 mb-2">Informações Pessoais</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
                            </div>
                        </div>
                         <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
                            <input type="file" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-royal-blue/10 file:text-royal-blue hover:file:bg-royal-blue/20"/>
                        </div>
                    </fieldset>

                    {/* Professional-specific Fields */}
                    {user.role === UserRole.PROFESSIONAL && (
                        <fieldset className="border-t pt-4">
                            <legend className="text-lg font-semibold text-gray-800 mb-2">Informações Profissionais</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Profissão</label>
                                    <select name="profession" value={formData.profession} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue">
                                        {PROFESSIONS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Experiência</label>
                                    <textarea name="experience" value={formData.experience} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue"></textarea>
                                </div>
                            </div>
                        </fieldset>
                    )}
                    
                    {/* Password Change */}
                    <fieldset className="border-t pt-4">
                        <legend className="text-lg font-semibold text-gray-800 mb-2">Alterar Senha</legend>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Deixe em branco para não alterar" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Deixe em branco para não alterar" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue focus:border-royal-blue" />
                            </div>
                        </div>
                    </fieldset>

                    <div className="pt-4 flex justify-end space-x-3 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSaving} className="bg-royal-blue text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 transition-colors">
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
