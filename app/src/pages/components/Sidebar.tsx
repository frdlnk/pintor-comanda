// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router'; // Asegúrate de importar de 'react-router-dom'
import { Home, PlusSquare } from 'lucide-react';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-white p-6 flex flex-col shadow-lg border-r border-gray-200"> {/* Fondo blanco, sombra y borde sutil */}
            <div className="mb-8 flex justify-center"> {/* Centrar la imagen */}
                <img width={320} height={120} src='/logo-optimized.webp' alt="Logo" className="object-contain" /> {/* Reducir tamaño de logo, añadir alt */}
            </div>
            <nav className="flex flex-col space-y-4">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${isActive
                            ? 'bg-blue-500 text-white shadow-md' // Fondo azul para activo, texto blanco, sombra
                            : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700' // Texto gris oscuro por defecto, hover con fondo azul claro y texto azul
                        }`
                    }
                >
                    <Home size={20} />
                    <span>Comandas</span>
                </NavLink>
                <NavLink
                    to="/generate"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${isActive
                            ? 'bg-blue-500 text-white shadow-md' // Fondo azul para activo, texto blanco, sombra
                            : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700' // Texto gris oscuro por defecto, hover con fondo azul claro y texto azul
                        }`
                    }
                >
                    <PlusSquare size={20} />
                    <span>Generar</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;