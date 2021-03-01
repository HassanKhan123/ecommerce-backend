import { CartService } from './cart.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('cart')
export class CartsController {
  constructor(private readonly cartService: CartService) {}
  @Post('add')
  async addToCart(
    @Body('productID') pid: string,
    @Body('quantity') quantity: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.cartService.addToCart(pid, quantity, req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }
}
