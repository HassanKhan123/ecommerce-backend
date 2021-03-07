import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcryptjs');

import { User } from './user.model';
import { Order } from '../orders/order.model';

import { generateToken } from '../../utils/generateToken.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async createUser(name: string, email: string, password: string) {
    try {
      let existingUser;
      existingUser = await this.userModel.findOne({ email });

      if (existingUser) {
        throw {
          message: 'User already exists, Please login instead',
          statusCode: 400,
        };
      }

      let hashedPassword;
      hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new this.userModel({
        name,
        email,
        password: hashedPassword,
      });

      const result = await newUser.save();
      return {
        id: result._id,
        email: result.email,
        name: result.name,
        token: generateToken(result._id),
        statusCode: 201,
      };
    } catch (error) {
      return {
        msg: error.message,
        statusCode: error.statusCode,
      };
    }
  }

  async loginUser(req, email: string, password: string) {
    try {
      let userExists;

      userExists = await this.userModel.findOne({ email });
      if (!userExists) {
        throw {
          message: 'Login Failed!',
          statusCode: 400,
        };
      }

      let isPasswordValid;

      isPasswordValid = await bcrypt.compare(password, userExists.password);
      console.log(isPasswordValid);

      if (!isPasswordValid) {
        throw {
          message: 'Login Failed!',
          statusCode: 400,
        };
      }

      req.user = {
        userExists,
      };

      return {
        id: userExists._id,
        email: userExists.email,
        token: generateToken(userExists._id),
        statusCode: 200,
      };
    } catch (e) {
      return {
        msg: e.message,
        statusCode: e.statusCode,
      };
    }
  }

  async fetchOrders(req) {
    const userId = req.body.data.userId;

    try {
      let user;

      user = await this.userModel.findById(userId).populate('orders');

      if (!user) {
        throw {
          message: 'Fetching orders failed, please try again',
          statusCode: 400,
        };
      }

      return { orders: user.orders, statusCode: 200 };
    } catch (error) {
      return {
        message: 'Fetching orders failed, please try again',
        statusCode: 400,
      };
    }
  }

  async fetchProducts(req) {
    const userId = req.body.data.userId;

    try {
      let user;

      user = await this.userModel.findById(userId).populate('products');

      if (!user) {
        throw {
          message: 'Fetching products failed, please try again',
          statusCode: 400,
        };
      }

      return { products: user.products, statusCode: 200 };
    } catch (error) {
      return {
        message: 'Fetching products failed, please try again',
        statusCode: 400,
      };
    }
  }
}
