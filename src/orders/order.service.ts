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

  async addOrders(orderItems, req, res) {
    let user;
    try {
      user = await this.usersModel.findById(req.body.data.userId);
    } catch (error) {
      throw new Error('Creating order failed, please try again');
    }

    if (!user) {
      throw new Error('Creating order failed, please try again');
    }

    if (!orderItems || orderItems.length === 0) {
      throw new Error('Creating order failed, please try again');
    }

    const newOrder = new this.ordersModel({
      user: req.body.data.userId,
      orderItems,
    });
    try {
      const order = await newOrder.save();
      user.orders.push(order._id);
      await user.save();
      res.json({
        order,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }

  async getOrderById(req, res) {
    const orderId = req.params.oid;
    let order;
    try {
      order = await this.ordersModel.findById(orderId);
    } catch (error) {
      throw new Error('No order found');
    }

    if (!order) {
      throw new Error('No order found');
    }

    try {
      res.json({
        order,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }
}
