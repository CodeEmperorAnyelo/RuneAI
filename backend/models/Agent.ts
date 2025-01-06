import mongoose, { Document, Schema } from 'mongoose';

// Interfaz para el modelo de agente
export interface IAgent extends Document {
  name: string;
  objective: string;
  status: 'idle' | 'active' | 'paused' | 'completed';
  owner: mongoose.Types.ObjectId;
  currentTask?: string;
  progress: number;
  activeTools: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Esquema del agente
const agentSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Agent name is required'],
      minlength: [3, 'Agent name must be at least 3 characters long'],
      maxlength: [50, 'Agent name cannot exceed 50 characters'],
    },
    objective: {
      type: String,
      required: [true, 'Objective is required'],
      minlength: [10, 'Objective must be at least 10 characters long'],
    },
    status: {
      type: String,
      enum: ['idle', 'active', 'paused', 'completed'],
      default: 'idle',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    currentTask: {
      type: String,
      maxlength: [100, 'Current task description cannot exceed 100 characters'],
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be less than 0'],
      max: [100, 'Progress cannot be greater than 100'],
    },
    activeTools: [
      {
        type: String,
        maxlength: [30, 'Tool name cannot exceed 30 characters'],
      },
    ],
  },
  {
    timestamps: true, // Agrega automáticamente `createdAt` y `updatedAt`
  }
);

// Índice para optimizar búsquedas por propietario
agentSchema.index({ owner: 1 });

export default mongoose.model<IAgent>('Agent', agentSchema);
