import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Place an order.'
  /* #swagger.security = [{
               "Bearer": []
        }] */

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    /* #swagger.responses[201] = { 
               schema: { $ref: "#/definitions/Order" },
               description: 'Usuário encontrado.' 
        } */
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Get specific order details for the client.'
  // #swagger.parameters['id'] = { description: 'ID of the order.' }
  /* #swagger.security = [{
               "Bearer": []
        }] */

  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    /* #swagger.responses[200] = { 
            schema: { $ref: "#/definitions/Order" },
            description: 'Your order.' 
        } */
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Update order to paid status.'
  // #swagger.parameters['id'] = { description: 'ID of the order.' }
  /* #swagger.security = [{
               "Bearer": []
        }] */

  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Order" },
               description: 'Order is paid.' 
        } */
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Update the order to deliver status.'
  // #swagger.parameters['id'] = { description: 'ID of the order.' }
  /* #swagger.security = [{
               "Bearer": []
        }] */

  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Order" },
               description: 'Order is delivered.' 
        } */
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Get logged in users orders'
  /* #swagger.security = [{
               "Bearer": []
        }] */

  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Get all orders for the admin.'
  /* #swagger.security = [{
          "Bearer": []
        }] */

  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
