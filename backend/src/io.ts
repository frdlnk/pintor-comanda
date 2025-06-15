import { Server, Socket } from "socket.io";

import {
    pushNewOrder,
    getNextOrderForProcessing,
    getAllCurrentOrders,
    updateOrderStatus,
    markOrderAsReady,
    removeOrderCompletely,
    getPendingOrders,
    getProcessingOrders,
    getReadyOrders
} from "./socketFunctions/OrderHandler.service.js";
import { IComanda, Status } from "./interfaces/IComanda.js";

const emitQueueUpdates = (io: Server) => {
    io.emit("QUEUE_UPDATED", {
        allOrders: getAllCurrentOrders(),
        pendingOrders: getPendingOrders(),
        processingOrders: getProcessingOrders(),
        readyOrders: getReadyOrders(),
        queueSize: getAllCurrentOrders().length,
        isEmpty: getAllCurrentOrders().length === 0
    });
};

export const SocketServer = (io: Server) => {

    io.on("connection", (socket: Socket) => {
        console.log(`[Socket Server]: New connection with id: ${socket.id}`);

        emitQueueUpdates(io);

        socket.on("ORDER_CREATE", (data: Omit<IComanda, 'id'>) => {
            try {
                const newComanda = pushNewOrder(data);
                emitQueueUpdates(io);
                socket.emit("ORDER_CREATE_SUCCESS", newComanda);
            } catch (error) {
                console.error("[Socket Server]: Error creating order:", error);
                socket.emit("ORDER_CREATE_FAILED", { message: (error as Error).message });
            }
        });

        socket.on("ORDER_TAKE_NEXT", () => {
            try {
                const comanda = getNextOrderForProcessing();
                emitQueueUpdates(io);
                socket.emit("ORDER_TAKE_NEXT_SUCCESS", comanda);
            } catch (error) {
                console.error("[Socket Server]: Error taking next order:", error);
                socket.emit("ORDER_TAKE_NEXT_FAILED", { message: (error as Error).message });
            }
        });

        socket.on("ORDER_UPDATE_STATUS", (data: { id: string, newStatus: Status }) => {
            try {
                const updatedComanda = updateOrderStatus(data.id, data.newStatus);
                emitQueueUpdates(io);
                socket.emit("ORDER_UPDATE_STATUS_SUCCESS", updatedComanda);
            } catch (error) {
                console.error("[Socket Server]: Error updating order status:", error);
                socket.emit("ORDER_UPDATE_STATUS_FAILED", { message: (error as Error).message });
            }
        });

        socket.on("ORDER_MARK_READY", (orderId: string) => {
            try {
                const readyComanda = markOrderAsReady(orderId);
                emitQueueUpdates(io);
                socket.emit("ORDER_MARK_READY_SUCCESS", readyComanda);
            } catch (error) {
                console.error("[Socket Server]: Error marking order ready:", error);
                socket.emit("ORDER_MARK_READY_FAILED", { message: (error as Error).message });
            }
        });

        socket.on("ORDER_REMOVE_COMPLETED", (orderId: string) => {
            try {
                const removed = removeOrderCompletely(orderId);
                if (removed) {
                    emitQueueUpdates(io);
                    socket.emit("ORDER_REMOVE_COMPLETED_SUCCESS", { id: orderId, removed: true });
                } else {
                    socket.emit("ORDER_REMOVE_COMPLETED_FAILED", { message: `Comanda ${orderId} no encontrada para eliminar.` });
                }
            } catch (error) {
                console.error("[Socket Server]: Error removing completed order:", error);
                socket.emit("ORDER_REMOVE_COMPLETED_FAILED", { message: (error as Error).message });
            }
        });

        socket.on("REQUEST_QUEUE_STATUS", () => {
            emitQueueUpdates(io);
        });

        socket.on("disconnect", () => {
            console.log(`[Socket Server]: Client disconnected: ${socket.id}`);
        });
    });
}