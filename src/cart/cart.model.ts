import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const CartSchema = new mongoose.Schema({
  productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: Number,
  totalPrice: Number,
});

export interface Cart extends Document {
  productID: mongoose.ObjectId;
  authorID: mongoose.ObjectId;
  quantity: number;
  totalPrice: number;
}
