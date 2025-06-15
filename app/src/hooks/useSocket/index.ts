// src/hooks/useSocket/index.ts
import { useEffect } from 'react';
import { useSocketStore } from '../../store/socketStore.ts'; // Importar la store

export const useSocket = () => {
    const { socket, queueData, connectSocket, isConnected } = useSocketStore();

    useEffect(() => {
        if (!isConnected && !socket) {
            connectSocket();
        }
        // No necesitamos desconectar aquí, la lógica de limpieza está en la store
    }, [isConnected, socket, connectSocket, queueData]);

    // Retorna lo que los componentes necesitan del estado global
    return {
        socket,
        queueData,
        isConnected,
        emitEvent: useSocketStore.getState().emitEvent // Acceso directo a la acción emitEvent
    };
};