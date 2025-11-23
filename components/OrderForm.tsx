import React, { useState, useEffect, useMemo } from 'react';
import { Supplier, Commercial } from '../types';
import { Button } from './Button';

interface OrderFormProps {
  nextOrderNumber: number;
  suppliers: Supplier[];
  commercials: Commercial[];
  availableCustomers: string[];
  onSave: (
    data: { date: string; orderNumber: number; supplier: string; customer: string; material: string; serviceDescription: string; commercial: string }
  ) => void;
  onCancel: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ 
  nextOrderNumber, 
  suppliers, 
  commercials, 
  availableCustomers,
  onSave, 
  onCancel 
}) => {
  const [date, setDate] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [material, setMaterial] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [customer, setCustomer] = useState<string>('');
  const [commercial, setCommercial] = useState<string>('');

  // Commercials sorted alphabetically
  const sortedCommercials = useMemo(() => {
    return [...commercials].sort((a, b) => a.name.localeCompare(b.name));
  }, [commercials]);

  // Set default date to today on mount and default selections
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    
    // Use the first supplier from the list (which is passed already sorted by recency)
    // as the default value, but allow changing it via text input
    if (suppliers.length > 0) {
      setSupplier(suppliers[0].name);
    }

    if (sortedCommercials.length > 0) {
      setCommercial(sortedCommercials[0].name);
    }
  }, [suppliers, sortedCommercials]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !customer || !supplier || !material || !commercial) return;

    onSave({
      date,
      orderNumber: nextOrderNumber,
      supplier,
      material,
      serviceDescription,
      customer,
      commercial
    });
  };

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Data</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Nº Pedido (Auto)</label>
          <input
            type="number"
            disabled
            value={nextOrderNumber}
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 shadow-sm cursor-not-allowed sm:text-sm font-mono"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">Fornecedor</label>
        <input
          type="text"
          required
          list="supplier-suggestions"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          placeholder="Selecione ou escreva..."
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <datalist id="supplier-suggestions">
          {suppliers.map((s) => (
            <option key={s.id} value={s.name} />
          ))}
        </datalist>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">Material / Serviço solicitado</label>
        <input
          type="text"
          required
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          placeholder="Descrição do material..."
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">Descrição do serviço a realizar</label>
        <textarea
          rows={4}
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          placeholder="Descreva o serviço detalhadamente..."
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Cliente</label>
          <input
            type="text"
            required
            list="customer-suggestions"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Nome do cliente"
            className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <datalist id="customer-suggestions">
            {availableCustomers.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Comercial</label>
          {sortedCommercials.length > 0 ? (
            <select
              value={commercial}
              onChange={(e) => setCommercial(e.target.value)}
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {sortedCommercials.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          ) : (
             <div className="text-sm text-red-600 p-2 border border-red-100 bg-red-50 rounded">
                Adicione comerciais nas configurações.
             </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="button"
          disabled={!supplier || !customer || !material || sortedCommercials.length === 0}
          onClick={handleSubmit}
        >
          Gravar
        </Button>
      </div>
    </form>
  );
};