// src/pages/home/components/OrderDrawer.tsx
import React, { useState } from 'react';
import type { IComanda, Status, ProductOrder } from '../../types/IComanda.ts';
import { X, CheckCircle } from 'lucide-react';

interface OrderDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    order: IComanda;
    onStatusChange: (orderId: string, newStatus: Status) => void;
    onRemove: (orderId: string) => void;
}

const allStatuses: Status[] = ["PENDING", "PROCESSING", "READY"];

const OrderDrawer: React.FC<OrderDrawerProps> = ({ isOpen, onClose, order, onStatusChange, onRemove }) => {
    const [selectedStatus, setSelectedStatus] = useState<Status>(order.status);

    React.useEffect(() => {
        setSelectedStatus(order.status);
    }, [order.status]);

    const handleSaveStatus = () => {
        onStatusChange(order.id, selectedStatus);
        onClose()
    };

    const handleRemove = () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la comanda ${order.id}?`)) {
            onRemove(order.id);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-white bg-opacity-50 transition-opacity" onClick={onClose}></div>
            <div
                className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } p-6 flex flex-col`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-700">Detalles de Comanda</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-blue-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar pr-4">
                    <p className="mb-2"><span className="font-semibold text-gray-800">ID:</span> <span className="text-gray-700">{order.id}</span></p>
                    <p className="mb-2"><span className="font-semibold text-gray-800">Cliente:</span> <span className="text-gray-700">{order.cliente}</span></p>
                    <p className="mb-2"><span className="font-semibold text-gray-800">Creada:</span> <span className="text-gray-700">{new Date(order.createdAt).toLocaleString()}</span></p>
                    <p className="mb-4"><span className="font-semibold text-gray-800">Estado Actual:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold
                            ${order.status === "PENDING" ? 'bg-red-200 text-red-800' :
                              order.status === "PROCESSING" ? 'bg-blue-200 text-blue-800' :
                              'bg-green-200 text-green-800'}
                        `}>
                            {order.status}
                        </span>
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-3 text-blue-600">Productos:</h3>
                    {order.order.length > 0 ? (
                        order.order.map((product: ProductOrder, index: number) => (
                            <div key={index} className="bg-gray-100 p-3 rounded-lg mb-3 last:mb-0 border border-gray-200">
                                <p className="font-semibold text-gray-800">{product.productName} ({product.productQuantity} {product.productSize})</p>
                                <p className="text-sm text-gray-700">Color: {product.productColorCode} ({product.productType})</p>
                                {product.description && <p className="text-xs text-gray-600 mt-1">Desc: {product.description}</p>}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 italic">No hay productos en esta comanda.</p>
                    )}
                </div>

                <div className="mt-6 border-t border-gray-300 pt-6">
                    <label htmlFor="status-select" className="block text-gray-700 text-sm font-bold mb-2">
                        Cambiar Estado:
                    </label>
                    <select
                        id="status-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as Status)}
                        className="block w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {allStatuses.map((statusValue) => (
                            <option key={statusValue} value={statusValue}>
                                {statusValue === "PENDING" ? 'PENDIENTE' :
                                 statusValue === "PROCESSING" ? 'EN PROCESO' :
                                 'LISTA'}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleSaveStatus}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mb-3 flex items-center justify-center space-x-2"
                    >
                        <CheckCircle size={20} />
                        <span>Guardar Estado</span>
                    </button>

                    <button
                        onClick={handleRemove}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                    >
                        <X size={20} />
                        <span>Eliminar Comanda</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDrawer;