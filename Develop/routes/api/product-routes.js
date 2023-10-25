const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// route to get all products
router.get("/", async (req, res) => {
  try {
    // Find all products and include their associated Category and Tag data
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "category_name"],
        },
        {
          model: Tag,
          attributes: ["id", "tag_name"],
          through: {
            attributes: [], // Exclude any extra attributes from the join table
          },
        },
      ],
    });

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to retrieve products." });
  }
});
//route to get one product
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find a single product by its `id` and include its associated Category and Tag data
    const product = await Product.findOne({
      where: { id: productId },
      include: [
        {
          model: Category,
          attributes: ["id", "category_name"],
        },
        {
          model: Tag,
          attributes: ["id", "tag_name"],
          through: {
            attributes: [], // Exclude any extra attributes from the join table
          },
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to retrieve the product." });
  }
});

//route to create new product
router.post("/", async (req, res) => {
  try {
    const { product_name, price, stock, tagIds } = req.body;

    // Create the product in the database
    const newProduct = await Product.create();

    if (tagIds && tagIds.length) {
      // If tagIds are provided, associate the product with tags
      await newProduct.addTags(tagIds);
    }

    // Reload the product to include associated tags
    await newProduct.reload();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create a new product." });
  }
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;
