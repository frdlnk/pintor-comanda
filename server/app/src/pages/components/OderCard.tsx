// src/pages/home/components/OrderCard.tsx
import React from 'react';
import type { IComanda } from '../../types/IComanda.ts';
import { timeago } from '../../libs/timeago.ts';

interface OrderCardProps {
    order: IComanda;
    onClick: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
    return (
        <div
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-50 transition duration-200 border border-gray-200"
            onClick={onClick}
        >
            <h4 className="text-lg font-bold text-blue-700 mb-1">{order.cliente}</h4>
            <p className="text-sm text-gray-700">ID: {order.id.substring(0, 8)}...</p>
            <p className="text-sm text-gray-600">Productos: {order.order.length}</p>
            <p className="text-xs text-gray-500">Creado: {timeago(order.createdAt)}</p>
        </div>
    );
};

export default OrderCard;