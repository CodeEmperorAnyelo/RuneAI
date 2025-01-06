import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Registro de usuario
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Genera un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h', // Expiración del token en 1 hora
    });

    res.status(201).json({ user, token });
  } catch (error: any) {
    console.error(error); // Registra el error en el servidor
    res.status(500).json({ message: error?.message || 'Error registering user' });
  }
};

// Inicio de sesión
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Verifica si el usuario existe
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Genera un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h', // Expiración del token en 1 hora
    });

    res.json({ user, token });
  } catch (error: any) {
    console.error(error); // Registra el error en el servidor
    res.status(500).json({ message: error?.message || 'Error logging in' });
  }
};

// Obtención del usuario actual
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Encuentra al usuario en la base de datos
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error: any) {
    console.error(error); // Registra el error en el servidor
    res.status(500).json({ message: error?.message || 'Error fetching user' });
  }
};
