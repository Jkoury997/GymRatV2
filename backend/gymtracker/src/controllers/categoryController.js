const CategoryService = require('../services/categoryService');
const HttpError = require('../utils/httpError');

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new HttpError('El nombre de la categoría es obligatorio', 400);

    const existing = await CategoryService.getCategories();
    if (existing.find((cat) => cat.name.toLowerCase() === name.toLowerCase())) {
      throw new HttpError('La categoría ya existe', 400);
    }

    const category = await CategoryService.createCategory({ name });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryService.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.updateCategory(req.params.id, req.body);
    if (!category) throw new HttpError('Categoría no encontrada', 404);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.deleteCategory(req.params.id);
    if (!category) throw new HttpError('Categoría no encontrada', 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};
