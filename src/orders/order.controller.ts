import { OrderService } from './order.service';
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

import { generateResponse } from '../../utils/responseHandler.js';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':oid')
  async getOrderById(@Req() req: Request, @Res() res: Response) {
    const response = await this.orderService.getOrderById(req);
    generateResponse(response, res);
  }

  @Post('create')
  async addToCart(
    @Body('orderItems') orderItems: [],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.orderService.addOrders(orderItems, req);
    generateResponse(response, res);
  }

  @Delete(':oid')
  async deleteOrder(@Req() req: Request, @Res() res: Response) {
    const response = await this.orderService.deleteOrder(req);
    generateResponse(response, res);
  }
}
