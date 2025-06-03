import Razorpay from 'razorpay';
import { razorpayKeyId, razorpayKeySecret } from '../constants.js';
import ApiError from '../utils/ApiError.js';
import crypto from 'crypto';
import enrollmentModel from '../models/enrollment.model.js';
import userModel from '../models/user.model.js';
import orderModel from '../models/order.model.js';

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

const createOrder = async function (req, res, next) {
  try {
    let { amount, courseId, instructor } = req.body;

    let student = await userModel.findOne({ email: req.user.email });

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (order) {
      await orderModel.create({
        student: student._id,
        instructor: instructor,
        course: courseId,
        amountPaid: amount,
      });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error in Creating Order for Razorpay'
      )
    );
  }
};

const verifyPayment = async function (req, res, next) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      instructor,
    } = req.body;
    const { courseId } = req.params;

    const student = await userModel.findOne({ email: req.user.email });
    if (!student) return next(new ApiError(404, 'Student not found'));

    const order = await orderModel.findOne({
      student: student._id,
      course: courseId,
    });
    if (!order) return next(new ApiError(404, 'Order not found'));

    // STEP 1: Verify the signature
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'Failed';
      await order.save();
      return res.status(200).json({ success: false, message: 'Invalid signature' });
    }

    // STEP 2: Fetch payment from Razorpay and check actual status
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured') {
      order.paymentStatus = 'Failed';
      await order.save();
      return res.status(200).json({ success: false, message: 'Payment not captured' });
    }

    
    order.paymentStatus = 'Success';
    await order.save();

    await enrollmentModel.create({
      student: student._id,
      instructor: instructor,
      course: courseId,
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified and captured successfully',
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error verifying Payment'
      )
    );
  }
};


const getOneOrder = async function (req, res, next) {
  try {
    let { courseId } = req.params;
    let order = await orderModel.findOne({ course: courseId });
    if (!order) return next(new ApiError(404, 'Order not found'));
    return res.status(200).json(order);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error fetching order'
      )
    );
  }
};

export { createOrder, verifyPayment, getOneOrder };
