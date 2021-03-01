import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart } from './cart.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Cart') private readonly productsModel: Model<Cart>,
  ) {}

  async addToCart(pid, quantity, req, res) {
    let products;
    try {
      products = await this.productsModel.find();
    } catch (error) {
      throw new Error('Fetching products failed, please try again');
    }

    if (products.length > 0) {
      return res.json({
        products,
      });
    }
    res.json({
      products: 'No products found',
    });
  }
}
