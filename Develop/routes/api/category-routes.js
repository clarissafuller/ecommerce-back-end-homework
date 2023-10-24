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
    res
      .status(500)
      .json({
        error: "Unable to retrieve the category and its associated products.",
      });
  }
});

router.post("/", (req, res) => {
  // create a new category
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
