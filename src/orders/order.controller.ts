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

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':oid')
  async getOrderById(@Req() req: Request, @Res() res: Response) {
    const response = await this.orderService.getOrderById(req);
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }
    res.status(response.statusCode).json(response);
  }

  @Post('create')
  async addToCart(
    @Body('orderItems') orderItems: [],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.orderService.addOrders(orderItems, req);
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }
    res.status(response.statusCode).json(response);
  }

  @Delete(':oid')
  async deleteOrder(@Req() req: Request, @Res() res: Response) {
    const response = await this.orderService.deleteOrder(req);
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }
    res.status(response.statusCode).json(response);
  }
}
