import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcryptjs');

import { User } from './user.model';
import { generateToken } from '../../utils/generateToken.js';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(res, name: string, email: string, password: string) {
    try {
      let existingUser;
      try {
        existingUser = await this.userModel.findOne({ email });
      } catch (error) {
        throw new Error('Signup failed, please try again');
      }

      if (existingUser) {
        throw new Error('User already exists, Please login instead');
      }

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch (error) {
        console.log(error);
        throw new Error('Could not create user, please try again.');
      }
      try {
        const newUser = new this.userModel({
          name,
          email,
          password: hashedPassword,
        });

        const result = await newUser.save();
        return res.json({
          id: result._id,
          email: result.email,
          name: result.name,
          token: generateToken(result._id),
        });
      } catch (e) {
        throw new Error('Could not create user, please try again.');
      }
    } catch (error) {
      return res.status(500).json({
        messge: error.message,
      });
    }
  }

  async loginUser(res, email: string, password: string) {
    try {
      let userExists;
      try {
        userExists = await this.userModel.findOne({ email });
      } catch (error) {
        throw new Error('Login Failed!');
      }

      let isPasswordValid;
      try {
        isPasswordValid = await bcrypt.compare(password, userExists.password);
      } catch (error) {
        throw new Error('Login Failed!');
      }

      if (!userExists && !isPasswordValid) {
        throw new Error('Login Failed!');
      }

      return res.json({
        id: userExists._id,
        email: userExists.email,
        token: generateToken(userExists._id),
      });
    } catch (e) {
      return res.status(400).json({
        msg: e.message,
      });
    }
  }
}
