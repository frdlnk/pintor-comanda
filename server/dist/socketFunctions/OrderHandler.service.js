import RequestQueue from "../data/RequestQueue.js";
import { Status } from "../interfaces/IComanda.js";
const queue = RequestQueue.getInstance();
export const pushNewOrder = (comandaData) => {
    const newComanda = Object.assign({ id: '' }, comandaData);
    return queue.enqueue(newComanda);
};
export const getNextOrderForProcessing = () => {
    let comandaToProcess;
    const currentOrders = queue.getAllComandas();
    if (currentOrders.length === 0) {
        throw new Error("La cola está vacía, no hay comandas para procesar.");
    }
    comandaToProcess = currentOrders[0];
    if (comandaToProcess) {
        queue.updateComandaStatus(comandaToProcess.id, Status.PROCESSING);
    }
    return comandaToProcess;
};
export const getAllCurrentOrders = () => {
    return queue.getAllComandas();
};
export const updateOrderStatus = (orderId, newStatus) => {
    return queue.updateComandaStatus(orderId, newStatus);
};
export const markOrderAsReady = (orderId) => {
    return updateOrderStatus(orderId, Status.READY);
};
export const removeOrderCompletely = (orderId) => {
    return queue.removeComandaById(orderId);
};
export const getOrderStatus = (orderId) => {
    const comanda = queue.getAllComandas().find(c => c.id === orderId);
    return comanda === null || comanda === void 0 ? void 0 : comanda.status;
};
export const isOrderQueueEmpty = () => {
    return queue.isEmpty();
};
export const getOrderQueueSize = () => {
    return queue.size();
};
export const getPendingOrders = () => {
    return queue.getAllComandas().filter(c => c.status === Status.PENDING);
};
export const getProcessingOrders = () => {
    return queue.getAllComandas().filter(c => c.status === Status.PROCESSING);
};
export const getReadyOrders = () => {
    return queue.getAllComandas().filter(c => c.status === Status.READY);
};
