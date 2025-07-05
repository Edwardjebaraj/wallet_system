import { Router } from 'express';
import walletRoutes from './walletRoutes'; 

const router = Router();

const defaultRoutes = [
  {
    path: "/wallet",
    route: walletRoutes,
  },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
