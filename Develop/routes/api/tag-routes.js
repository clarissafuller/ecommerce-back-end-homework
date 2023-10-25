const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    // Find all tags and include their associated product data
    const tags = await Tag.findAll({
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock"],
        through: {
          attributes: [], // Exclude any extra attributes from the join table
        },
      },
    });

    res.status(200).json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to retrieve tags." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tagId = req.params.id;

    // Find a single tag by its `id` and include its associated Product data
    const tag = await Tag.findOne({
      where: { id: tagId },
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock"],
        through: {
          attributes: [], // Exclude any extra attributes from the join table
        },
      },
    });

    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.status(200).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to retrieve the tag." });
  }
});

router.post("/", async (req, res) => {
  try {
    // Extract tag data from the request body
    const { tag_name } = req.body;

    // Create a new tag in the database
    const newTag = await Tag.create({ tag_name });

    res.status(201).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create a new tag." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tagId = req.params.id;
    const { tag_name } = req.body;

    // Find the tag by its `id` value
    const tag = await Tag.findByPk(tagId);

    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    // Update the tag's name
    tag.tag_name = tag_name;
    await tag.save();

    res.status(200).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update the tag." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tagId = req.params.id;

    // Find the tag by its `id` value
    const tag = await Tag.findByPk(tagId);

    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    // Delete the tag
    await tag.destroy();

    res.status(204).send(); // Send a 204 No Content response indicating successful deletion
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete the tag." });
  }
});

module.exports = router;
