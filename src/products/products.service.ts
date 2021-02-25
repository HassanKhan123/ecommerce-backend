import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcryptjs');

import { Product } from './products.model';
import { generateToken } from '../../utils/generateToken.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') private readonly productsModel: Model<Product>,
  ) {}

  async createProduct(name: string, desc: string, amount: number, req, res) {
    try {
      res.send({
        data: 'success',
        author: req.body.data,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }
}
