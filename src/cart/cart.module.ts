import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { CartService } from './cart.service';
import { CartsController } from './cart.controller';
import { CartSchema } from './cart.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }])],
  controllers: [CartsController],
  providers: [CartService],
})
export class CartModule {}
