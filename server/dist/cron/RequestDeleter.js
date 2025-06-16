import RequestQueue from "../data/RequestQueue.js";
import { getAllCurrentOrders, getPendingOrders, getProcessingOrders, getReadyOrders } from "../socketFunctions/OrderHandler.service.js";
const queue = RequestQueue.getInstance();
const emitQueueUpdates = (io) => {
    io.emit("QUEUE_UPDATED", {
        allOrders: getAllCurrentOrders(),
        pendingOrders: getPendingOrders(),
        processingOrders: getProcessingOrders(),
        readyOrders: getReadyOrders(),
        queueSize: getAllCurrentOrders().length,
        isEmpty: getAllCurrentOrders().length === 0
    });
};
export const removeReadyRequests = (io) => {
    console.log("[CRON_JOB]: Iniciando limpieza automática de comandas");
    const readyOrders = queue.getAllComandas().filter(o => o.status == "READY");
    if (readyOrders.length == 0)
        return;
    for (let i = 0; i < readyOrders.length; i++) {
        const order = readyOrders[i];
        queue.removeComandaById(order.id);
    }
    io.emit("QUEUE_UPDATED", {
        allOrders: getAllCurrentOrders(),
        pendingOrders: getPendingOrders(),
        processingOrders: getProcessingOrders(),
        readyOrders: getReadyOrders(),
        queueSize: getAllCurrentOrders().length,
        isEmpty: getAllCurrentOrders().length === 0
    });
};
