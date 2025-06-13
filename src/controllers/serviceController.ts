import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Service from '../models/Service';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.findAll();
    
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error fetching services' });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { title, description, icon } = req.body;
    
    const service = await Service.create({
      title,
      description,
      icon
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error creating service' });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const service = await Service.findByPk(req.params.id);
    
    if (service) {
      const { title, description, icon } = req.body;
      
      service.title = title || service.title;
      service.description = description || service.description;
      service.icon = icon || service.icon;
      
      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error updating service' });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByPk(req.params.id);
    
    if (service) {
      await service.destroy();
      res.json({ message: 'Service removed' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error deleting service' });
  }
};