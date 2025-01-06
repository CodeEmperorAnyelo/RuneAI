// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// MongoDB schemas
const toolSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  parameters: [{ name: String, type: String, required: Boolean }],
  isActive: Boolean
});

const agentSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: String,
  objective: String,
  status: { type: String, enum: ['idle', 'active', 'paused', 'completed'], default: 'idle' },
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  selectedTools: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tool' }],
  currentTask: String,
  progress: Number,
  history: [{
    timestamp: Date,
    action: String,
    result: String,
    toolUsed: String
  }]
});

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: { type: String, enum: ['trial', 'monthly', 'yearly'] },
  status: { type: String, enum: ['active', 'expired', 'cancelled'] },
  startDate: Date,
  endDate: Date,
  maxAgents: Number
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String, // Hashed
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  createdAt: { type: Date, default: Date.now }
});

// Models
const Tool = mongoose.model('Tool', toolSchema);
const Agent = mongoose.model('Agent', agentSchema);
const User = mongoose.model('User', userSchema);
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Agent Management Routes
app.post('/api/agents', async (req, res) => {
  try {
    const { name, objective, selectedTools, userId } = req.body;
    
    // Check user subscription
    const user = await User.findById(userId).populate('subscription');
    if (!user || !user.subscription || user.subscription.status !== 'active') {
      return res.status(403).json({ error: 'Active subscription required' });
    }
    
    // Check agent limit
    const currentAgents = await Agent.countDocuments({ owner: userId });
    if (currentAgents >= user.subscription.maxAgents) {
      return res.status(403).json({ error: 'Agent limit reached' });
    }
    
    const agent = new Agent({
      name,
      objective,
      owner: userId,
      selectedTools,
      status: 'idle',
      progress: 0
    });
    
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agent Execution Engine
class AgentExecutionEngine {
  async executeTask(agent, task) {
    try {
      // Update agent status
      agent.status = 'active';
      agent.currentTask = task;
      await agent.save();

      // Get available tools
      const tools = await Tool.find({
        _id: { $in: agent.selectedTools },
        isActive: true
      });

      // Simulate task execution with selected tools
      for (const tool of tools) {
        const result = await this.executeTool(tool, task);
        
        // Record action in history
        agent.history.push({
          timestamp: new Date(),
          action: task,
          result: result,
          toolUsed: tool.name
        });

        // Update progress
        agent.progress += Math.floor(100 / tools.length);
        await agent.save();
      }

      // Complete the task
      agent.status = 'completed';
      agent.progress = 100;
      await agent.save();

      return { success: true, message: 'Task completed successfully' };
    } catch (error) {
      agent.status = 'idle';
      await agent.save();
      return { success: false, error: error.message };
    }
  }

  async executeTool(tool, task) {
    // Simulate tool execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Executed ${tool.name} for task: ${task}`;
  }
}
//Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

app.post('/api/create-checkout-session', async (req, res) => {
  const { plan } = req.body; // 'trial', 'monthly', 'yearly'
  const prices = {
    trial: 'price_123', // Sustituir con ID de precio en Stripe
    monthly: 'price_456',
    yearly: 'price_789',
  };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: prices[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:5000/success',
      cancel_url: 'http://localhost:5000/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subscription Management
app.post('/api/subscriptions', async (req, res) => {
  try {
    const { userId, plan } = req.body;
    
    const planDetails = {
      trial: { days: 14, maxAgents: 2 },
      monthly: { days: 30, maxAgents: 5 },
      yearly: { days: 365, maxAgents: 10 }
    };
    
    const subscription = new Subscription({
      userId,
      plan,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + planDetails[plan].days * 24 * 60 * 60 * 1000),
      maxAgents: planDetails[plan].maxAgents
    });
    
    await subscription.save();
    
    // Update user subscription
    await User.findByIdAndUpdate(userId, { subscription: subscription._id });
    
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
