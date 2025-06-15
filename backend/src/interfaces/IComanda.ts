
export enum Status {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    READY = "READY"
}


enum ProductType {
    SATIN = "SATIN",
    MATE = "MATE",
    BRILLANTE = "BRILLANTE"
}

enum ProductSize {
    QUART = "QUART",
    GALLON = "GALLON",
    BUCKET = "BUCKET"
}


interface ProductOrder {
    productName: string
    productQuantity: number,
    productSize: ProductSize,
    productColorCode: string,
    productType: ProductType,
    description?: string
}


export interface IComanda {
    id: string,
    cliente: string,
    createdAt: Date
    order: ProductOrder[]
    status: Status,
}