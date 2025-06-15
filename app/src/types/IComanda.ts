// src/types/IComanda.ts
export type Status = "PENDING" | "PROCESSING" | "READY";

export type ProductType = "SATIN" | "MATE" | "BRILLANTE";

export type ProductSize = "QUART" | "GALLON" | "BUCKET";

export interface ProductOrder {
    productName: string;
    productQuantity: number;
    productSize: ProductSize;
    productColorCode: string;
    productType: ProductType;
    description?: string;
}

export interface IComanda {
    id: string;
    cliente: string;
    createdAt: Date;
    order: ProductOrder[];
    status: Status;
}