import RequestQueue from "../data/RequestQueue.js";
import { IComanda, Status } from "../interfaces/IComanda.js";

const queue = RequestQueue.getInstance();

export const pushNewOrder = (comandaData: Omit<IComanda, 'id'>): IComanda => {
    const newComanda: IComanda = {
        id: '',
        ...comandaData
    };
    return queue.enqueue(newComanda);
};

export const getNextOrderForProcessing = (): IComanda => {
    let comandaToProcess: IComanda | undefined;
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

export const getAllCurrentOrders = (): IComanda[] => {
    return queue.getAllComandas();
};

export const updateOrderStatus = (orderId: string, newStatus: Status): IComanda => {
    return queue.updateComandaStatus(orderId, newStatus);
};

export const markOrderAsReady = (orderId: string): IComanda => {
    return updateOrderStatus(orderId, Status.READY);
};

export const removeOrderCompletely = (orderId: string): boolean => {
    return queue.removeComandaById(orderId);
};

export const getOrderStatus = (orderId: string): Status | undefined => {
    const comanda = queue.getAllComandas().find(c => c.id === orderId);
    return comanda?.status;
};

export const isOrderQueueEmpty = (): boolean => {
    return queue.isEmpty();
};

export const getOrderQueueSize = (): number => {
    return queue.size();
};

export const getPendingOrders = (): IComanda[] => {
    return queue.getAllComandas().filter(c => c.status === Status.PENDING);
};

export const getProcessingOrders = (): IComanda[] => {
    return queue.getAllComandas().filter(c => c.status === Status.PROCESSING);
};

export const getReadyOrders = (): IComanda[] => {
    return queue.getAllComandas().filter(c => c.status === Status.READY);
};