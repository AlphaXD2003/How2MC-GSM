const {ApiResponse} = require("../../../utils/ApiResponse");
const {ApiErrors} = require("../../../utils/ApiErrors");
const Razorpay = require("razorpay");
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
const {v4 : uuidv4} = require('uuid');
const { Order, User } = require("../../../models");
const crypto = require("crypto");
const createOrder = async (req, res) => {
    try {
        const { 
            amount, currency = "INR", productId, eggId,   monthDuration = 1
        } = req.body;
        const user_id = req.user._id;
        //console.log(user_id);
        if (!amount ) {
            throw new ApiErrors(400, "Invalid request");
        }
        const receipt = `${uuidv4()}`;
        const options = {
            amount: amount * 100,
            currency,
            receipt,
            payment_capture: 1,
        };
        const razorpay = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET,
        });
        const order = await razorpay.orders.create(options);
        //console.log(order);

    // Calculate endingDateAndTime as one month from now
        const startingDateAndTime = new Date();
        const endingDateAndTime = new Date(startingDateAndTime);
        endingDateAndTime.setMonth(startingDateAndTime.getMonth() + monthDuration);
     
    // Save order to database
        await Order.create({
           order_id: order.id,
           userId: req.user._id,
           price: amount,
           productId: productId,
           eggId: eggId,
           currentStatus: "pending",
           startingDateAndTime: startingDateAndTime,
           endingDateAndTime: endingDateAndTime,
          
        });
        const user = await User.findById(user_id);
        const userEmail = user.email;
        const userName = user.name;
        
        // await sendEmail(userEmail, userName, message);
        return res
        .status(200)
        .json(new ApiResponse(200, {
            ...order,
            name: userName,
            email: userEmail
        }, "Order created successfully"));
    } catch (error) {
        //console.log(error);
    }
}

const verifyOrder = async (req, res) => {
    try {
        const { order_id, payment_id, signature } = req.body;
        if ([order_id, payment_id, signature].includes(undefined)) {
            throw new ApiErrors(400,  "Invalid request");
        }
        const expectedSecret = await crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(`${order_id}|${payment_id}`)
            .digest("hex");
        if (expectedSecret !== signature) {
            // save database as failed
            await Order.findOneAndUpdate(
                { order_id },
                { status: "failed" },
                { new: true }
            );

            throw new ApiErrors(400, "Invalid signature");
        }

        // Save order to database
        await Order.findOneAndUpdate(
            { order_id },
            { status: "delivered", amountPaid: this.amount },
            { new: true }
        );

        return res
        .status(200)
        .json(new ApiResponse(200, "Order verified", "Order verified"));
    } catch (error) {
        //console.log(error);
        return res
        .status(400)
        .json(new ApiResponse(400, "Invalid request", "Invalid request"));
    }       

}

module.exports = {
    createOrder,
    verifyOrder
}