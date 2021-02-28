import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcryptjs');

import { Product } from './products.model';
import { User } from '../users/user.model';

import { generateToken } from '../../utils/generateToken.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') private readonly productsModel: Model<Product>,
    @InjectModel('User') private readonly usersModel: Model<User>,
  ) {}

  async getAllProducts(req, res) {
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

  async getProductById(req, res) {
    const productId = req.params.pid;

    let product;
    try {
      product = await this.productsModel.findById(productId).populate('author');
    } catch (error) {
      throw new Error('Could not find product with the provided ID');
    }
    if (!product) {
      throw new Error('Could not find a product with the provided product id');
    }
    res.json({ product });
  }

  getProductsByAuthorId = async (req, res) => {
    const authorId = req.params.aid;
    let products;
    try {
      products = await this.productsModel.find({ author: authorId });
    } catch (error) {
      throw new Error('Could not find product with the provided authorID');
    }
    if (!products || products.length === 0) {
      throw new Error('Could not find a product with the provided authorID');
    }
    res.json({
      products: products.map((place) => place.toObject({ getters: true })),
    });
  };

  async createProduct(name: string, desc: string, amount: number, req, res) {
    let user;
    try {
      user = await this.usersModel.findById(req.body.data.userId);
    } catch (error) {
      throw new Error('Creating product failed, please try again');
    }

    const newProduct = new this.productsModel({
      name,
      description: desc,
      price: amount,
      author: req.body.data.userId,
    });
    try {
      const product = await newProduct.save();
      user.products.push(product._id);
      await user.save();
      res.json({
        id: product._id,
        author: product.author,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }
}
