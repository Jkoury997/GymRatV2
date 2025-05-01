const Category = require('../database/models/Category');
const Exercise = require('../database/models/Exercise');

const createCategory = async (data) => {
  return await Category.create(data);
};

const getCategories = async () => {
  const categories = await Category.find();

  const categoriesWithExercises = await Promise.all(
    categories.map(async (category) => {
      const exercises = await Exercise.find({ category: category._id });
      return {
        ...category.toObject(),
        exercises,
      };
    })
  );

  return categoriesWithExercises;

};

const getCategoryById = async (id) => {
  return await Category.findById(id);
};

const updateCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
