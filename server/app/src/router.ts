// src/router.tsx
import { createBrowserRouter } from "react-router";
import ComandasPage from "./pages/home/index.tsx";
import GenerateOrderPage from "./pages/generate/index.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: ComandasPage
    },
    {
        path: "/generate",
        Component: GenerateOrderPage
    }
]);