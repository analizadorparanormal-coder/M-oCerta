import React, { useState, useMemo, useEffect } from 'react';
import { Quote, OfferDetails } from '../types';

interface OfferModalProps {
    quote: Quote;
    onClose: () => void;
    onSubmit: (description: string, offerDetails: Omit<OfferDetails, 'total'>) => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({ quote, onClose, onSubmit }) => {
    const [description, setDescription] = useState('');
    const [laborCost, setLaborCost] = useState(0);
    const [materials, setMaterials] = useState<{ name: string; price: number }[]>([]);
    const [visitFee, setVisitFee] = useState(0);
    const [chargeVisitFee, setChargeVisitFee] = useState(false);
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);

    const total = useMemo(() => {
        const materialsTotal = materials.reduce((sum, item) => sum + (item.price || 0), 0);
        return (laborCost || 0) + materialsTotal + (chargeVisitFee ? (visitFee || 0) : 0);
    }, [laborCost, materials, visitFee, chargeVisitFee]);

    const handleAddMaterial = () => {
        setMaterials([...materials, { name: '', price: 0 }]);
    };

    const handleRemoveMaterial = (index: number) => {
        setMaterials(materials.filter((_, i) => i !== index));
    };

    const handleMaterialChange = (index: number, field: 'name' | 'price', value: string) => {
        const newMaterials = [...materials];
        if (field === 'price') {
            newMaterials[index][field] = parseFloat(value) || 0;
        } else {
            newMaterials[index][field] = value;
        }
        setMaterials(newMaterials);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || laborCost <= 0) {
            alert('A descrição e o valor da mão de obra são obrigatórios.');
            return;
        }
        onSubmit(description, {
            laborCost,
            materials,
            visitFee: chargeVisitFee ? visitFee : 0,
            visitDate,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-royal-blue text-center">Criar Orçamento</h2>
                    <p className="text-center text-gray-600">Para: <span className="font-semibold">{quote.from.fullName}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descrição do Serviço</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-royal-blue focus:border-royal-blue" placeholder="Ex: Instalação de 3 ventiladores de teto com passagem de fiação."/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700">Valor da Mão de Obra (R$)</label>
                           <input type="number" value={laborCost} onChange={e => setLaborCost(parseFloat(e.target.value) || 0)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700">Data Sugerida para o Serviço</label>
                           <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Materiais</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 border rounded-md p-2 bg-gray-50">
                            {materials.map((material, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" placeholder="Nome do material" value={material.name} onChange={e => handleMaterialChange(index, 'name', e.target.value)} className="w-2/3 p-2 border rounded-md"/>
                                    <input type="number" placeholder="Preço" value={material.price} onChange={e => handleMaterialChange(index, 'price', e.target.value)} className="w-1/3 p-2 border rounded-md"/>
                                    <button type="button" onClick={() => handleRemoveMaterial(index)} className="text-red-500 font-bold p-2 hover:bg-red-100 rounded-full">X</button>
                                </div>
                            ))}
                             {materials.length === 0 && <p className="text-sm text-gray-500 text-center">Nenhum material adicionado.</p>}
                        </div>
                        <button type="button" onClick={handleAddMaterial} className="mt-2 text-sm text-royal-blue font-semibold hover:underline">+ Adicionar Material</button>
                    </div>

                    <div>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={chargeVisitFee} onChange={e => setChargeVisitFee(e.target.checked)} className="h-4 w-4 rounded text-royal-blue focus:ring-royal-blue"/>
                            <span className="text-sm font-medium text-gray-700">Cobrar taxa de visita?</span>
                        </label>
                        <p className="text-xs text-gray-500 ml-6 mt-1">A taxa será cobrada caso o cliente não aprove o orçamento após a visita técnica.</p>
                        {chargeVisitFee && (
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">Valor da Taxa de Visita (R$)</label>
                                <input type="number" value={visitFee} onChange={e => setVisitFee(parseFloat(e.target.value) || 0)} className="mt-1 block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        )}
                    </div>

                    <div className="text-right font-bold text-2xl text-royal-blue border-t pt-4">
                        TOTAL: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
                        <button type="submit" className="bg-gold-yellow text-royal-blue font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 disabled:bg-gray-400 transition-colors">Enviar Orçamento</button>
                    </div>
                </form>
            </div>
        </div>
    );
};