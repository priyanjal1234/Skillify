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
    let { courseId } = req.params;

    let student = await userModel.findOne({ email: req.user.email });
    if (!student) {
      return next(new ApiError(404, 'Student not found'));
    }

    let order = await orderModel.findOne({
      student: student._id,
    });
    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    const secret = razorpayKeySecret;
    const hash = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (hash === razorpay_signature) {
      order.paymentStatus = 'Success';
      await order.save();

      await enrollmentModel.create({
        student: student._id,
        instructor: instructor,
        course: courseId,
      });

      return res
        .status(200)
        .json({ success: true, message: 'Payment verified successfully' });
    } else {
      order.paymentStatus = 'Failed';
      await order.save();
      return next(new ApiError(400, 'Payment Verification Failed'));
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error verifying Payment'
      )
    );
  }
};

export { createOrder, verifyPayment };
