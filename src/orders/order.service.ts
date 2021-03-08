import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from './order.model';
import { Product } from '../products/products.model';
import { User } from '../users/user.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly ordersModel: Model<Order>,
    @InjectModel('User') private readonly usersModel: Model<User>,
    @InjectModel('Product') private readonly productsModel: Model<Product>,
  ) {}

  async addOrders(orderItems, req) {
    try {
      let user;
      user = await this.usersModel.findById(req.body.data.userId);
      if (!user) {
        throw {
          message: 'Creating order failed, please try again',
          statusCode: 400,
        };
      }
      if (!orderItems) {
        throw {
          message: 'Creating order failed, please try again',
          statusCode: 400,
        };
      }
      const newOrder = new this.ordersModel({
        user: req.body.data.userId,
        orderItems,
      });
      const order = await newOrder.save();
      user.orders.push(order._id);
      await user.save();

      return {
        order,
        statusCode: 200,
      };
    } catch (error) {
      throw {
        msg: error.message,
        statusCode: error.statusCode,
      };
    }
  }

  async getOrderById(req) {
    try {
      const orderId = req.params.oid;
      let order;
      order = await this.ordersModel
        .findById(orderId)
        // .populate('orderItems.product');
        .populate({
          path: 'orderItems',
          populate: {
            path: 'product',
            model: 'Product',
            populate: {
              path: 'author',
              model: 'User',
            },
          },
        });
      if (!order) {
        throw {
          message: 'No order found',
          statusCode: 400,
        };
      }

      return {
        order,
        statusCode: 200,
      };
    } catch (error) {
      throw {
        msg: error.message,
        statusCode: error.statusCode,
      };
    }
  }

  deleteOrder = async (req) => {
    try {
      const orderId = req.params.oid;
      const authorId = req.body.data.userId;
      let user;
      user = await this.usersModel.findById(authorId);
      if (!user) {
        throw {
          message: "Can't delete this order",
          statusCode: 400,
        };
      }
      let order;
      order = await this.ordersModel.findById(orderId).populate('user');
      if (!order) {
        throw {
          message: 'No Order found',
          statusCode: 400,
        };
      }
      if (order.user.id !== authorId) {
        throw {
          message: 'You are not allowed to delete this order',
          statusCode: 400,
        };
      }
      order.user.orders.pull(order.id);
      await order.remove();
      await order.user.save();

      return {
        message: 'Order Deleted',
        statusCode: 200,
      };
    } catch (error) {
      throw {
        msg: error.message,
        statusCode: error.statusCode,
      };
    }
  };
}
