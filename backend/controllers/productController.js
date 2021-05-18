import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.description = 'Get all products.'
  const pageSize = 10;
  /* #swagger.parameters['pageNumber'] = {
            description: 'The number of the required page.',
            type: 'string'
        } 
*/

  const pageNumber = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (pageNumber - 1));

  res.json({ products, pageNumber, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.description = 'Get a product by the id.'
  // #swagger.parameters['id'] = { description: 'ID of the product.' }
  const product = await Product.findById(req.params.id);

  if (product) {
    /* #swagger.responses[200] = { 
            schema: { $ref: "#/definitions/Order" },
            description: 'The product.' 
        } */
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.description = ' Delete a product.Admin only.'
  // #swagger.parameters['id'] = { description: 'ID of the product.' }
  /* #swagger.security = [{
               "Bearer": []
        }] */
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.description = 'Get all Products for the admin.'
  /* #swagger.security = [{
               "Bearer": []
        }] */

  const {
    name,
    price,
    user,
    image,
    brand,
    category,
    countInStock,
    description,
  } = req.body;
  /* #swagger.parameters['newProduct'] = {
            in: 'body',
            description: 'the product details.',
            required: true,
            type: 'object',
            schema: { $ref: "#/definitions/Product" }
        } */

  const newProduct = {
    name,
    price,
    user,
    image,
    brand,
    category,
    countInStock,
    description,
  };

  const product = new Product(newProduct);
  const createdProduct = await product.save();
  console.log(newProduct);
  /* #swagger.responses[200] = { 
            schema: { $ref: "#/definitions/Order" },
            description: 'Created product.' 
        } */
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.description = 'Update a Product by the admin.'
  // #swagger.parameters['id'] = { description: 'ID of the product.' }
  /* #swagger.security = [{
               "Bearer": []
        }] */

  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    /* #swagger.responses[200] = { 
            schema: { $ref: "#/definitions/Product" },
            description: 'Updated product.' 
        } */
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.description = 'Create a Product review by a logged in client.'
  // #swagger.parameters['id'] = { description: 'ID of the product.' }
  /* #swagger.security = [{
               "Bearer": []
        }] */

  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.description = 'Get top Products.'
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
