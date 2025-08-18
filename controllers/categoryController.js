import * as Category from '../models/categoryModel.js';

export const getAllCategories = async (req, res) => {
  try {
    const results = await Category.getAllCategories();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const results = await Category.getCategoryById(req.params.id);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    await Category.addCategory(req.body);
    res.status(201).json({ message: 'Category added' });
  } catch (err) {
    // ตรวจสอบ error type เพื่อส่ง status code ที่เหมาะสม
    if (err.message.includes('มีอยู่แล้ว')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

export const updateCategory = async (req, res) => {
  try {
    await Category.updateCategory(req.params.id, req.body);
    res.json({ message: 'Category updated' });
  } catch (err) {
    // ตรวจสอบ error type เพื่อส่ง status code ที่เหมาะสม
    if (err.message.includes('มีอยู่แล้ว')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};