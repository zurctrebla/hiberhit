import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import WarrantyPage from "../pages/warranty/page";
import AdminLogin from "../pages/admin/login/page";
import AdminDashboard from "../pages/admin/dashboard/page";
import OrcamentoDetail from "../pages/admin/orcamento/[id]/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/garantia-certificacao",
    element: <WarrantyPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/orcamento/:id',
    element: <OrcamentoDetail />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
