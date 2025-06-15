// src/pages/home/components/StatusColumn.tsx
import React from 'react';
import type { IComanda, Status } from '../../types/IComanda.ts'; // Corregir la ruta de importación de tipos si es necesario
import OrderCard from './OderCard.tsx'; // Asegúrate de que el nombre del archivo sea 'OrderCard.tsx' (con 'r')

interface StatusColumnProps {
    title: string;
    statusFilter: Status;
    orders: IComanda[];
    onCardClick: (comanda: IComanda) => void;
}

const StatusColumn: React.FC<StatusColumnProps> = ({ title, orders, onCardClick }) => {
    return (
        <div className="flex-1 bg-white p-4 rounded-lg shadow-lg flex flex-col border border-gray-200"> {/* Fondo blanco y borde */}
            <h3 className={`text-xl font-semibold mb-4 ${
                title === "Pendiente" ? "text-red-600" :     // Rojo más oscuro para pendiente
                title === "En Proceso" ? "text-blue-600" :   // Azul más oscuro para en proceso
                "text-green-600"                             // Verde más oscuro para listo
            }`}>{title} ({orders.length})</h3>
            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} onClick={() => onCardClick(order)} />
                ))}
                {orders.length === 0 && (
                    <p className="text-gray-500 italic text-center py-4">No hay comandas {title.toLowerCase()}.</p>
                )}
            </div>
        </div>
    );
};

export default StatusColumn;