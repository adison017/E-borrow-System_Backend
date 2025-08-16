import Branch from '../models/branchModel.js';

const branchController = {
  getAllBranches: async (req, res) => {
    try {
      const branches = await Branch.findAll();
      res.json(branches);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBranchById: async (req, res) => {
    try {
      const branch = await Branch.findById(req.params.id);
      if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      res.json(branch);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createBranch: async (req, res) => {
    try {
      const result = await Branch.create(req.body);
      res.status(201).json({ message: 'Branch created successfully', id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateBranch: async (req, res) => {
    try {
      const result = await Branch.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      res.json({ message: 'Branch updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteBranch: async (req, res) => {
    try {
      const result = await Branch.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default branchController;