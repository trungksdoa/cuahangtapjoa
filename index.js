'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const ProductRoutes = require('./routes/Product-routes');
const UserRoutes = require('./routes/User-routes');
const OrderRoutes = require('./routes/Order-routes');
const OrderDetailRoutes = require('./routes/OrderDetail-routes');
const AddresslRoutes = require('./routes/addrestuser-routes');
const LikeRoutes = require('./routes/Likes-routes');
const CatagoryRoutes = require('./routes/Catagory-Routes');
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/api', ProductRoutes.routes);
app.use('/api', UserRoutes.routes);
app.use('/api', OrderRoutes.routes);
app.use('/api', OrderDetailRoutes.routes);
app.use('/api', AddresslRoutes.routes);
app.use('/api', LikeRoutes.routes);
app.use('/api', CatagoryRoutes.routes);
app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));