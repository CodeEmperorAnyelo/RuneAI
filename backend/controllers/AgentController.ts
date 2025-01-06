import { Request, Response } from 'express';
import Agent from '../models/Agent';

export const getAgents = async (req: Request, res: Response): Promise<void> => {
  try {
    const agents = await Agent.find({ owner: req.user._id });
    res.json(agents);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Server error' });
  }
};

export const createAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, objective, activeTools } = req.body;
    const agent = new Agent({
      name,
      objective,
      activeTools,
      owner: req.user._id,
      status: 'idle',
      progress: 0,
    });
    await agent.save();
    res.status(201).json(agent);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Error creating agent' });
  }
};

export const updateAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const agent = await Agent.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!agent) {
      res.status(404).json({ message: 'Agent not found' });
      return;
    }
    res.json(agent);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Error updating agent' });
  }
};

export const deleteAgent = async (req: Request, res: Response): Promise<void> => {
  try {
    const agent = await Agent.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!agent) {
      res.status(404).json({ message: 'Agent not found' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Error deleting agent' });
  }
};