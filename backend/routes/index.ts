import express from 'express';
import authRoutes from './authRoutes';
import agentRoutes from './agentRoutes';
import { authenticate } from '../middleware/auth'; // Usar el middleware `authenticate`

const router = express.Router();

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas
router.use('/agents', authenticate, agentRoutes);

// Manejador para rutas no encontradas
router.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default router;
