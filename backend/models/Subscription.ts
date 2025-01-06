import mongoose, { Schema, Document } from 'mongoose';

// Interfaz del modelo de suscripción
export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'trial' | 'monthly' | 'yearly';
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  maxAgents: number;
}

const subscriptionSchema: Schema<ISubscription> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    plan: {
      type: String,
      enum: ['trial', 'monthly', 'yearly'],
      required: [true, 'Plan is required'],
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (this: ISubscription, value: Date): boolean {
          // Asegúrate de que endDate es posterior a startDate
          return value > this.startDate;
        },
        message: 'End date must be later than start date',
      },
    },
    maxAgents: {
      type: Number,
      required: [true, 'Maximum number of agents is required'],
      min: [1, 'Maximum number of agents must be at least 1'],
    },
  },
  {
    timestamps: true, // Agrega `createdAt` y `updatedAt`
  }
);

export default mongoose.model<ISubscription>('Subscription', subscriptionSchema);
