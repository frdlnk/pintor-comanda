// RequestQueue.ts
import { IComanda, Status } from "../interfaces/IComanda.js";
import { v4 as uuidv4 } from 'uuid'; // Importa v4 para generar UUIDs

export default class RequestQueue {
    private static instance: RequestQueue | null = null;
    private orders: IComanda[];

    private constructor() {
        this.orders = [];
        console.log("[Request Queue]: Queue ready");
    }

    public static getInstance(): RequestQueue {
        if (this.instance === null) {
            this.instance = new RequestQueue();
        }
        return this.instance;
    }

    public enqueue(newComanda: IComanda): IComanda {
        newComanda.id = uuidv4()
        this.orders.push(newComanda);
        console.log(`[Request Queue]: Comanda ${newComanda.id} encolada. Total: ${this.orders.length}`);
        return newComanda;
    }

    public dequeue(): void {
        if (this.isEmpty()) {
            console.log("[Request Queue]: La cola está vacía, no hay comandas para desencolar.");
            throw new Error("La cola está vacía, no hay comandas para desencolar.")
        }
        const comanda = this.orders.shift();
        console.log(`[Request Queue]: Comanda ${comanda?.id} desencolada. Restantes: ${this.orders.length}`);
    }

    public getAllComandas(): IComanda[] {
        return [...this.orders];
    }

    public updateComandaStatus(id: string, newStatus: Status): IComanda {
        const comanda = this.orders.find(c => c.id === id);
        if (comanda) {
            comanda.status = newStatus;
            console.log(`[Request Queue]: Comanda ${id} actualizada a estado: ${newStatus}`);
            return comanda;
        }
        console.log(`[Request Queue]: Comanda con ID ${id} no encontrada para actualizar estado.`);
        throw new Error("Comanda con ID ${id} no encontrada para actualizar estado")
    }

    public removeComandaById(id: string): boolean {
        const initialLength = this.orders.length;
        this.orders = this.orders.filter(comanda => comanda.id !== id);
        if (this.orders.length < initialLength) {
            console.log(`[Request Queue]: Comanda ${id} eliminada de la cola.`);
            return true;
        }
        console.log(`[Request Queue]: Comanda con ID ${id} no encontrada para eliminar.`);
        return false;
    }

    public isEmpty(): boolean {
        return this.orders.length === 0;
    }

    public size(): number {
        return this.orders.length;
    }
}