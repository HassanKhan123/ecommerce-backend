import { UsersService } from './user.service';
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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('orders')
  async fetchUserOrders(@Res() res: Response, @Req() req: Request) {
    const response = await this.usersService.fetchOrders(req);
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
  }
  @Get('products')
  async fetchUserProducts(@Res() res: Response, @Req() req: Request) {
    const response = await this.usersService.fetchProducts(req);
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
  }
  @Post('signup')
  async createUser(
    @Body('name') userName: string,
    @Body('email') userEmail: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const response = await this.usersService.createUser(
      userName,
      userEmail,
      password,
    );
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
  }

  @Post('login')
  async loginUser(
    @Body('email') userEmail: string,
    @Body('password') password: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const response = await this.usersService.loginUser(
      req,
      userEmail,
      password,
    );

    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
  }
}
