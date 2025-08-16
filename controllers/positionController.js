import Position from '../models/positionModel.js';

const positionController = {
  getAllPositions: async (req, res) => {
    try {
      const positions = await Position.findAll();
      res.json(positions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPositionById: async (req, res) => {
    try {
      const position = await Position.findById(req.params.id);
      if (!position) {
        return res.status(404).json({ message: 'Position not found' });
      }
      res.json(position);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createPosition: async (req, res) => {
    try {
      const result = await Position.create(req.body);
      res.status(201).json({ message: 'Position created successfully', id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePosition: async (req, res) => {
    try {
      const result = await Position.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Position not found' });
      }
      res.json({ message: 'Position updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deletePosition: async (req, res) => {
    try {
      const result = await Position.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Position not found' });
      }
      res.json({ message: 'Position deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default positionController;