// src/store/socketStore.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import type { IComanda } from '../types/IComanda.ts';


const URI = "http://localhost:3000"

interface QueueUpdateData {
    allOrders: IComanda[];
    pendingOrders: IComanda[];
    processingOrders: IComanda[];
    readyOrders: IComanda[];
    queueSize: number;
    isEmpty: boolean;
}

interface SocketState {
    socket: Socket | null;
    queueData: QueueUpdateData | null;
    isConnected: boolean;
    connectSocket: () => void;
    disconnectSocket: () => void;
    setQueueData: (data: QueueUpdateData) => void;
    emitEvent: (event: string, data?: any) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    queueData: null,
    isConnected: false,

    connectSocket: () => {
        const socketInstance = io(URI); // Ajusta la URL de tu servidor

        socketInstance.on('connect', () => {
            console.log('Connected to Socket.IO server');
            set({ socket: socketInstance, isConnected: true });
            socketInstance.emit("REQUEST_QUEUE_STATUS"); // Solicitar el estado inicial
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
            set({ socket: null, isConnected: false, queueData: null });
        });

        socketInstance.on('QUEUE_UPDATED', (data: QueueUpdateData) => {
            console.log('Queue updated:', data);
            set({ queueData: data });
        });

        // Manejo de eventos de éxito/fallo
        socketInstance.on('ORDER_CREATE_SUCCESS', (comanda: IComanda) => {
            console.log('Order created successfully:', comanda.id);
        });
        socketInstance.on('ORDER_CREATE_FAILED', (error: { message: string }) => {
            console.error('Order creation failed:', error.message);
        });

        socketInstance.on('ORDER_TAKE_NEXT_SUCCESS', (comanda: IComanda) => {
            console.log('Order taken successfully:', comanda.id);
        });
        socketInstance.on('ORDER_TAKE_NEXT_FAILED', (error: { message: string }) => {
            console.error('Order take next failed:', error.message);
        });

        socketInstance.on('ORDER_UPDATE_STATUS_SUCCESS', (comanda: IComanda) => {
            console.log('Order status updated successfully:', comanda.id);
        });
        socketInstance.on('ORDER_UPDATE_STATUS_FAILED', (error: { message: string }) => {
            console.error('Order status update failed:', error.message);
        });

        socketInstance.on('ORDER_MARK_READY_SUCCESS', (comanda: IComanda) => {
            console.log('Order marked ready successfully:', comanda.id);
        });
        socketInstance.on('ORDER_MARK_READY_FAILED', (error: { message: string }) => {
            console.error('Order mark ready failed:', error.message);
        });

        socketInstance.on('ORDER_REMOVE_COMPLETED_SUCCESS', (data: { id: string, removed: boolean }) => {
            console.log('Order removed successfully:', data.id);
        });
        socketInstance.on('ORDER_REMOVE_COMPLETED_FAILED', (error: { message: string }) => {
            console.error('Order removal failed:', error.message);
        });


        // Clean up on unmount or re-connection
        return () => {
            socketInstance.off('connect');
            socketInstance.off('disconnect');
            socketInstance.off('QUEUE_UPDATED');
            // Off para todos los demás eventos si se reconecta
            socketInstance.off('ORDER_CREATE_SUCCESS');
            socketInstance.off('ORDER_CREATE_FAILED');
            socketInstance.off('ORDER_TAKE_NEXT_SUCCESS');
            socketInstance.off('ORDER_TAKE_NEXT_FAILED');
            socketInstance.off('ORDER_UPDATE_STATUS_SUCCESS');
            socketInstance.off('ORDER_UPDATE_STATUS_FAILED');
            socketInstance.off('ORDER_MARK_READY_SUCCESS');
            socketInstance.off('ORDER_MARK_READY_FAILED');
            socketInstance.off('ORDER_REMOVE_COMPLETED_SUCCESS');
            socketInstance.off('ORDER_REMOVE_COMPLETED_FAILED');

            if (get().isConnected) { // Solo desconectar si aún está conectado para evitar errores si ya se desconectó
                 socketInstance.disconnect();
            }
        };
    },

    disconnectSocket: () => {
        const { socket, isConnected } = get();
        if (socket && isConnected) {
            socket.disconnect();
            set({ socket: null, isConnected: false, queueData: null });
        }
    },

    setQueueData: (data) => set({ queueData: data }),

    emitEvent: (event, data) => {
        const { socket } = get();
        if (socket && get().isConnected) {
            socket.emit(event, data);
        } else {
            console.warn(`[Zustand Store]: No socket connected or not ready to emit event: ${event}`);
        }
    },
}));