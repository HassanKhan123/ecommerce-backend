import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  reviews: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export interface Product extends Document {
  name: string;
  price: number;
  description: string;
  reviews: number;
  author: mongoose.ObjectId;
}
