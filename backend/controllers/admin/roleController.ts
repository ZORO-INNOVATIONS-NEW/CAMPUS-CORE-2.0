import { Request, Response } from 'express';
import Role from '../../models/role';

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find();
    
    // if (roles.length === 0) {
    //   return res.status(404).json({ message: 'No roles found' });
    // }
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const role = new Role({ name, description });
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create role' });
  }
};