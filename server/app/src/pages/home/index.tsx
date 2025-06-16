// src/pages/home/index.tsx
import React, { useState } from 'react';
import type { IComanda, Status } from '../../types/IComanda.ts';
import { useSocket } from '../../hooks/useSocket/index.ts';
import StatusColumn from '../components/StatusColumn.tsx';
import OrderDrawer from '../components/OrderDrawer.tsx';
import Sidebar from '../components/Sidebar.tsx';

const ComandasPage: React.FC = () => {
    const { queueData, emitEvent } = useSocket(); // Obtenemos emitEvent directamente del hook
    const [selectedOrder, setSelectedOrder] = useState<IComanda | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleCardClick = (comanda: IComanda) => {
        setSelectedOrder(comanda);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedOrder(null);
    };

    const handleStatusChange = (orderId: string, newStatus: Status) => {
        emitEvent("ORDER_UPDATE_STATUS", { id: orderId, newStatus });
    };

    const handleTakeNextOrder = () => {
        emitEvent("ORDER_TAKE_NEXT");
    };

    const handleRemoveCompleted = (orderId: string) => {
        emitEvent("ORDER_REMOVE_COMPLETED", orderId);
    };

    if (!queueData) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Cargando datos de la cola...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 text-white">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="flex flex-col h-full">
                    <h2 className="text-3xl font-bold mb-6 text-blue-400">Panel de Comandas</h2>

                    <div className="mb-4">
                        <button
                            onClick={handleTakeNextOrder}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Tomar Siguiente Comanda
                        </button>
                    </div>

                    <div className="flex flex-grow space-x-6">
                        <StatusColumn
                            title="Pendiente"
                            statusFilter="PENDING"
                            orders={queueData.pendingOrders || []}
                            onCardClick={handleCardClick}
                        />
                        <StatusColumn
                            title="En Proceso"
                            statusFilter="PROCESSING"
                            orders={queueData.processingOrders || []}
                            onCardClick={handleCardClick}
                        />
                        <StatusColumn
                            title="Lista"
                            statusFilter="READY"
                            orders={queueData.readyOrders || []}
                            onCardClick={handleCardClick}
                        />
                    </div>

                    {selectedOrder && (
                        <OrderDrawer
                            isOpen={isDrawerOpen}
                            onClose={handleCloseDrawer}
                            order={selectedOrder}
                            onStatusChange={handleStatusChange}
                            onRemove={handleRemoveCompleted}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default ComandasPage;