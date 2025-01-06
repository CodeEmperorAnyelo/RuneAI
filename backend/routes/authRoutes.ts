import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './authRoutes';
import agentRoutes from './agentRoutes';
import { authenticate } from '../middleware/auth'; // Middleware de autenticación

const router = express.Router();

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
router.use('/agents', authenticate, agentRoutes);

// Manejador para rutas no encontradas
router.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware global de manejo de errores
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Registra el error en la consola
  res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
});

export default router;
