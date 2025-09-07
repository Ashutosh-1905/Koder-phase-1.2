const Razorpay = require('razorpay');
const crypto = require('crypto');
const productModel = require('../models/product.model');
const paymentModel = require('../models/payment.model');


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPayment = async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const order = await razorpay.orders.create({
            amount: product.price.amount * 100,
            currency: product.price.currency,
        });

      
        const payment = await paymentModel.create({
            orderId: order.id,
            user: req.user._id,
            product: productId,
            price: {
                amount: product.price.amount,
                currency: product.price.currency,
            }
        });

        res.status(201).json({
            message: "Order created successfully",
            order: payment,
            user: req.user,
        });

    } catch (error) {
        console.error("Error creating payment:", error.message);
        res.status(500).json({
            message: "Failed to create payment order",
            error: error.message
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, signature } = req.body;

        // Concatenate the order ID and payment ID to create the hash string
        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        // Compare the generated signature with the signature received from Razorpay
        if (generatedSignature === signature) {
            // Signature is valid, update the payment status in your database
            const updatedPayment = await paymentModel.findOneAndUpdate(
                { orderId: razorpayOrderId },
                {
                    paymentId: razorpayPaymentId,
                    signature: signature,
                    status: "completed"
                },
                { new: true } // Return the updated document
            );

            if (!updatedPayment) {
                return res.status(404).json({ message: "Payment record not found for the given order ID." });
            }

            res.status(200).json({
                message: "Payment verified successfully",
                success: true,
                updatedPayment
            });
        } else {
            // Signature is invalid
            res.status(400).json({ message: "Payment verification failed: Invalid signature", success: false });
        }

    } catch (error) {
        console.error("Error verifying payment:", error.message);
        res.status(500).json({
            message: "An internal server error occurred during payment verification.",
            error: error.message
        });
    }
};

module.exports = { createPayment, verifyPayment };
