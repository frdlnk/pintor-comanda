import { v4 as uuidv4 } from 'uuid';
class RequestQueue {
    constructor() {
        this.orders = [];
        console.log("[Request Queue]: Queue ready");
    }
    static getInstance() {
        if (this.instance === null) {
            this.instance = new RequestQueue();
        }
        return this.instance;
    }
    enqueue(newComanda) {
        newComanda.id = uuidv4();
        this.orders.push(newComanda);
        console.log(`[Request Queue]: Comanda ${newComanda.id} encolada. Total: ${this.orders.length}`);
        return newComanda;
    }
    dequeue() {
        if (this.isEmpty()) {
            console.log("[Request Queue]: La cola está vacía, no hay comandas para desencolar.");
            throw new Error("La cola está vacía, no hay comandas para desencolar.");
        }
        const comanda = this.orders.shift();
        console.log(`[Request Queue]: Comanda ${comanda === null || comanda === void 0 ? void 0 : comanda.id} desencolada. Restantes: ${this.orders.length}`);
    }
    getAllComandas() {
        return [...this.orders];
    }
    updateComandaStatus(id, newStatus) {
        const comanda = this.orders.find(c => c.id === id);
        if (comanda) {
            comanda.status = newStatus;
            console.log(`[Request Queue]: Comanda ${id} actualizada a estado: ${newStatus}`);
            return comanda;
        }
        console.log(`[Request Queue]: Comanda con ID ${id} no encontrada para actualizar estado.`);
        throw new Error("Comanda con ID ${id} no encontrada para actualizar estado");
    }
    removeComandaById(id) {
        const initialLength = this.orders.length;
        this.orders = this.orders.filter(comanda => comanda.id !== id);
        if (this.orders.length < initialLength) {
            console.log(`[Request Queue]: Comanda ${id} eliminada de la cola.`);
            return true;
        }
        console.log(`[Request Queue]: Comanda con ID ${id} no encontrada para eliminar.`);
        return false;
    }
    isEmpty() {
        return this.orders.length === 0;
    }
    size() {
        return this.orders.length;
    }
}
RequestQueue.instance = null;
export default RequestQueue;
