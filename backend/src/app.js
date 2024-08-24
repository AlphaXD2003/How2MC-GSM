const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const https = require("https");
const fs = require("fs");


const app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// setup the middlewares
app.use(cors({ origin: [process.env.CORS_ORIGIN, 
    "http://192.168.0.104:5173"
], credentials: true}));
app.use(cookieParser());
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//import routes
const userRouter = require("./routes/user.routes");
const eggRouter = require("./routes/eggs.routes");
const serverRouter = require("./routes/server.routes");
const pteroRouter = require("./routes/pterouser.routes");
const nodeRouter = require("./routes/nodes.routes");
const locationROuter = require('./routes/location.routes')
const clientRouter = require('./routes/client/client.routes')
const accountRouter = require('./routes/client/account.routes')
const clientServerRouter = require('./routes/client/server.routes')
// const razorpayRouter = require('./routes/razorpay.routes')
const syncRouter = require('./routes/sync.routes')
const blogRouter = require('./routes/blogs/blogs.routes')
const mailRouter = require('./routes/mail/mail.routes')
const pingRouter = require('./routes/ping.routes')
const nestRouter = require('./routes/nests.routes')
const productRouter = require('./routes/products/product.routes')
const orderRouter = require('./routes/orders/order.routes')
const stripeRouter = require('./routes/payment/stripe.routes')
const razorpayRouter = require('./routes/payment/razorpay.routes');
const upload = require("./middlewares/multer.middleware");
const { verifyJWT } = require("./middlewares/auth.middleware");



//declare routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/eggs", eggRouter);
app.use("/api/v1/servers", serverRouter);
app.use("/api/v1/pterouser", pteroRouter);
app.use("/api/v1/nodes", nodeRouter);
app.use('/api/v1/location', locationROuter)
app.use('/api/v1/nests', nestRouter)


app.use('/api/v1/client',clientRouter )
app.use('/api/v1/account', accountRouter)

app.use('/api/v1/client/server', clientServerRouter)


// // orders
// app.use('/api/v1/order', razorpayRouter)

// sync the database with the pterodactyl panel
app.use('/api/v1/sync', syncRouter)

// blog
app.use('/api/v1/blogs', blogRouter)

// send email
app.use('/api/v1/mail', mailRouter)

// calculate ping
app.use('/api/v1/ping', pingRouter)


// Producsts
app.use('/api/v1/products', productRouter)


// Orders
app.use('/api/v1/orders', orderRouter)


// Payment
app.use('/api/v1/payment/razorpay', razorpayRouter)
app.use('/api/v1/payment/stripe', stripeRouter)



// HTTPS server configuration
const privateKey = fs.readFileSync("localhost-key.pem", "utf8");
const certificate = fs.readFileSync("localhost.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);
const PORT = process.env.PORT || 5000;


module.exports = { app, httpsServer, PORT };
