import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './products.model';
import { User } from '../users/user.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') private readonly productsModel: Model<Product>,
    @InjectModel('User') private readonly usersModel: Model<User>,
  ) {}

  async getAllProducts() {
    try {
      let products;
      products = await this.productsModel.find();
      if (!products) {
        throw {
          message: 'No Products Found',
          statusCode: 400,
        };
      }

      return {
        products,
        statusCode: 200,
      };
    } catch (error) {
      throw {
        msg: error.message,
        statusCode: error.statusCode,
      };
    }
  }

  async getProductById(req) {
    try {
      const productId = req.params.pid;
      let product;
      if (!product) {
        throw {
          message: 'Could not find a product with the provided product id',
          statusCode: 400,
        };
      }
      product = await this.productsModel.findById(productId).populate('author');

      return {
        product,
        statusCode: 200,
      };
    } catch (error) {
      throw {
        msg: error.message,
        statusCode: error.statusCode,
      };
    }
  }

  getProductsByAuthorId = async (req) => {
    try {
      const authorId = req.params.aid;
      let products;
      products = await this.productsModel.find({ author: authorId });
      if (!products) {
        throw {
          message: 'Could not find a product with the provided authorID',
          statusCode: 400,
        };
      }

      return {
        products: products.map((place) => place.toObject({ getters: true })),
        statusCode: 200,
      };
    } catch (error) {
      throw {
        msg: error.message,
        statusCode: error.statusCode,
      };
    }
  };

  getAllProductReviews = async (req) => {
    try {
      const productId = req.params.pid;
      let product;
      product = await this.productsModel.findById(productId);
      if (!product) {
        throw {
          message: 'Could not find a product with the provided ID',
          statusCode: 400,
        };
      }

      return {
        reviews: product.reviews,
        totalReviews: product.totalReviews,
        statusCode: 200,
      };
    } catch (error) {
      throw {
        msg: error.message,
        statusCode: error.statusCode,
      };
    }
  };

  async createProduct(name: string, desc: string, amount: number, req) {
    try {
      let user;
      user = await this.usersModel.findById(req.body.data.userId);
      if (!user) {
        throw {
          message: 'Creating product failed, please try again',
          statusCode: 400,
        };
      }

      const newProduct = new this.productsModel({
        name,
        description: desc,
        price: amount,
        author: req.body.data.userId,
      });

      const product = await newProduct.save();
      user.products.push(product._id);
      await user.save();

      return {
        id: product._id,
        author: product.author,
        statusCode: 400,
      };
    } catch (error) {
      throw {
        msg: error.message,
        statusCode: error.statusCode,
      };
    }
  }

  postReview = async (pid, review, rating, req) => {
    try {
      const authorId = req.body.data.userId;
      let author;
      author = await this.usersModel.findById(authorId);
      if (!author) {
        throw {
          message: 'No user found with the given id',
          statusCode: 400,
        };
      }
      if (!author.products) {
        throw {
          message: "You can't review this product until you purchase",
          statusCode: 400,
        };
      }
      let isProduct = false;
      author.products.map(async (prod) => {
        if (prod === pid) {
          isProduct = true;
        }
      });
      if (isProduct) {
        let product;
        product = await this.productsModel.findById(pid);
        if (!product) {
          throw {
            message: "You can't review this product until you purchase",
            statusCode: 400,
          };
        }
        if (rating < 0 || rating > 5) {
          throw {
            message: 'Rating must be between 1 to 5',
            statusCode: 400,
          };
        }
        product.totalReviews = product.reviews?.length || 0;
        product.reviews = [
          ...product.reviews,
          { review, rating, author: author.name },
        ];
        product.totalReviews = product.reviews.length;
        await product.save();

        return {
          product,
          statusCode: 200,
        };
      }
    } catch (error) {
      throw {
        msg: error.message,
        statusCode: error.statusCode,
      };
    }
  };

  deleteProduct = async (req) => {
    try {
      const productId = req.params.pid;
      const authorId = req.body.data.userId;
      let user;
      user = await this.usersModel.findById(authorId);
      if (!user) {
        throw {
          message: "Can't delete this product",
          statusCode: 400,
        };
      }
      let product;
      product = await this.productsModel.findById(productId).populate('author');
      if (!product) {
        throw {
          message: 'No Product found',
          statusCode: 400,
        };
      }
      if (product.author.id !== authorId) {
        throw {
          message: 'You are not allowed to delete this place',
          statusCode: 400,
        };
      }
      product.author.products.pull(product.id);
      await product.remove();
      await product.author.save();

      return {
        message: 'Product Deleted',
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
