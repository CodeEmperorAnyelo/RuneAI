import { Router } from 'express';
import { authenticate } from '../middleware/auth'; // Middleware de autenticación
import {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} from '../controllers/AgentController';

const router = Router();

// Aplica el middleware de autenticación a todas las rutas de este router
router.use(authenticate);

/**
 * @route GET /agents
 * @desc Obtener todos los agentes del usuario autenticado
 * @access Protegido
 */
router.get('/', getAgents);

/**
 * @route POST /agents
 * @desc Crear un nuevo agente
 * @access Protegido
 */
router.post('/', createAgent);

/**
 * @route PUT /agents/:id
 * @desc Actualizar un agente existente
 * @access Protegido
 */
router.put('/:id', updateAgent);

/**
 * @route DELETE /agents/:id
 * @desc Eliminar un agente existente
 * @access Protegido
 */
router.delete('/:id', deleteAgent);

export default router;
