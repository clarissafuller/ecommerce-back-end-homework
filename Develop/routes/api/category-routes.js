const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  try {
    // Find all categories and include their associated products
    const categories = await Category.findAll({
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock"],
      },
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Unable to retrieve categories and associated products.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find one category by its `id` value and include its associated products
    const category = await Category.findOne({
      where: { id: categoryId },
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock"],
      },
    });

    if (!category) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(200).json(category);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Unable to retrieve the category and its associated products.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    // Extract category data from the request body
    const { category_name } = req.body;

    // Create a new category in the database
    const newCategory = await Category.create({ category_name });

    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create a new category." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { category_name } = req.body;

    // Find the category by its `id` value
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Update the category's data
    category.category_name = category_name;
    await category.save();

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update the category." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category by its `id` value
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Delete the category
    await category.destroy();

    res.status(204).send(); // Send a 204 No Content response indicating successful deletion
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete the category." });
  }
});

module.exports = router;
