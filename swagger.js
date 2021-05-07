import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'Proshop API',
    description: 'Proshop API documentation by <b>swagger-autogen</b>.',
  },
  host: 'localhost:5000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Users',
      description: 'Endpoints',
    },
    {
      name: 'Orders',
      description: 'EndPoints',
    },
    {
      name: 'Products',
      description: 'EndPoints',
    },
    {
      name: 'Uploads',
      description: 'EndPoints',
    },
  ],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  definitions: {
    Order: {
      user: '',
      orderItems: {
        $name: '',
        $qty: 5,
        $image: '/uploads/Screen Shot 2020-09-29 at 5.50.52 PM.png',
        $price: 1500,
        $product: '',
      },
      shippingAddress: {
        $address: 'sdg',
        $city: 'tunis',
        $postalCode: '1002',
        $country: 'Tunisia',
      },
      paymentResult: {
        id: '',
        status: '',
        email_address: '',
        update_time: '',
      },
      $taxPrice: 100,
      $shippingPrice: 100,
      $totalPrice: 1220,
      $isPaid: false,
      paidAt: '',
      $isDelivered: false,
      deliveredAt: '',
      $paymentMethod: 'paypal',
    },
    User: {
      _id: '',
      $name: 'abderrahmen',
      $email: 'admin@example.comm',
      $password: '123456',
      $isAdmin: false,
      token: 'oiuytiotyu',
    },
  },
};

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './backend/routes/orderRoutes.js',
  './backend/routes/uploadRoutes.js',
  './backend/routes/userRoutes.js',
  './backend/routes/productRoutes.js',
];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
  await import('./backend/server.js'); // Your project's root file
});
