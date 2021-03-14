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

import { generateResponse } from '../../utils/responseHandler.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('orders')
  async fetchUserOrders(@Res() res: Response, @Req() req: Request) {
    const response = await this.usersService.fetchOrders(req);
    generateResponse(response, res);
  }
  @Get('products')
  async fetchUserProducts(@Res() res: Response, @Req() req: Request) {
    const response = await this.usersService.fetchProducts(req);
    generateResponse(response, res);
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
    generateResponse(response, res);
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

    generateResponse(response, res);
  }
}
