// src/pages/generate/index.tsx
import React, { useState } from 'react';
import { useSocket } from '../../hooks/useSocket/index.ts';
import type { ProductOrder, ProductSize, ProductType, IComanda } from '../../types/IComanda.ts';
import Sidebar from '../components/Sidebar.tsx'; // Corregir la ruta de importación de Sidebar
import { PlusCircle, Send, X } from 'lucide-react';

const allProductTypes: ProductType[] = ["SATIN", "MATE", "BRILLANTE"];
const allProductSizes: ProductSize[] = ["QUART", "GALLON", "BUCKET"];

const GenerateOrderPage: React.FC = () => {
    const { emitEvent, socket } = useSocket();
    const [clientName, setClientName] = useState<string>('');
    const [products, setProducts] = useState<ProductOrder[]>([]);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const addProduct = () => {
        setProducts([
            ...products,
            {
                productName: '',
                productQuantity: 1,
                productSize: "GALLON",
                productColorCode: '',
                productType: "MATE",
                description: ''
            }
        ]);
    };

    const updateProduct = (index: number, field: keyof ProductOrder, value: any) => {
        const newProducts = [...products];
        (newProducts[index] as any)[field] = value;
        setProducts(newProducts);
    };

    const removeProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName.trim() || products.length === 0) {
            setNotification({ message: 'Por favor, complete el nombre del cliente y añada al menos un producto.', type: 'error' });
            return;
        }

        for (const product of products) {
            if (!product.productName.trim() || product.productQuantity <= 0 || !product.productColorCode.trim()) {
                setNotification({ message: 'Todos los campos de producto son obligatorios y la cantidad debe ser positiva.', type: 'error' });
                return;
            }
        }

        if (socket) {
            const newComandaData: Omit<IComanda, 'id'> = {
                cliente: clientName,
                createdAt: new Date(),
                order: products,
                status: "PENDING",
            };
            emitEvent("ORDER_CREATE", newComandaData);

            socket.once("ORDER_CREATE_SUCCESS", (comanda) => {
                setNotification({ message: `Comanda ${comanda.id} creada exitosamente.`, type: 'success' });
                setClientName('');
                setProducts([]);
            });

            socket.once("ORDER_CREATE_FAILED", (error: { message: string }) => {
                setNotification({ message: `Error al crear comanda: ${error.message}`, type: 'error' });
            });
        } else {
            setNotification({ message: 'No hay conexión con el servidor.', type: 'error' });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900"> {/* Fondo general muy claro, texto oscuro */}
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200"> {/* Contenedor principal blanco con borde */}
                    <h2 className="text-3xl font-bold mb-6 text-blue-600">Generar Nueva Comanda</h2> {/* Título azul oscuro */}

                    {notification && (
                        <div className={`p-3 mb-4 rounded-lg ${
                            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                            {notification.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="clientName" className="block text-gray-700 text-sm font-bold mb-2"> {/* Texto de label gris oscuro */}
                                Nombre del Cliente:
                            </label>
                            <input
                                type="text"
                                id="clientName"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <h3 className="text-xl font-semibold text-blue-600">Productos en la Comanda:</h3> {/* Título de sección azul oscuro */}
                        {products.map((product, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg relative border border-gray-200"> {/* Fondo de producto claro con borde */}
                                <button
                                    type="button"
                                    onClick={() => removeProduct(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    <X size={20} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-1">Nombre:</label> {/* Labels de producto gris oscuro */}
                                        <input
                                            type="text"
                                            value={product.productName}
                                            onChange={(e) => updateProduct(index, 'productName', e.target.value)}
                                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-1 px-2 text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-1">Cantidad:</label>
                                        <input
                                            type="number"
                                            value={product.productQuantity}
                                            onChange={(e) => updateProduct(index, 'productQuantity', parseInt(e.target.value))}
                                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-1 px-2 text-sm"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-1">Tamaño:</label>
                                        <select
                                            value={product.productSize}
                                            onChange={(e) => updateProduct(index, 'productSize', e.target.value as ProductSize)}
                                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-1 px-2 text-sm"
                                        >
                                            {allProductSizes.map(size => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-1">Color (código):</label>
                                        <input
                                            type="text"
                                            value={product.productColorCode}
                                            onChange={(e) => updateProduct(index, 'productColorCode', e.target.value)}
                                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-1 px-2 text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-1">Tipo:</label>
                                        <select
                                            value={product.productType}
                                            onChange={(e) => updateProduct(index, 'productType', e.target.value as ProductType)}
                                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-1 px-2 text-sm"
                                        >
                                            {allProductTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-full">
                                        <label className="block text-gray-700 text-sm font-bold mb-1">Descripción (opcional):</label>
                                        <textarea
                                            value={product.description}
                                            onChange={(e) => updateProduct(index, 'description', e.target.value)}
                                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-1 px-2 text-sm"
                                            rows={2}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addProduct}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 border border-gray-300"
                        >
                            <PlusCircle size={20} />
                            <span>Añadir Producto</span>
                        </button>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 mt-6"
                        >
                            <Send size={20} />
                            <span>Generar Comanda</span>
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default GenerateOrderPage;