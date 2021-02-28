import { ProductsService } from './products.service';
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get('')
  async getAllProducts(@Req() req: Request, @Res() res: Response) {
    try {
      await this.productsService.getAllProducts(req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }
  @Get(':pid')
  async getProductById(@Req() req: Request, @Res() res: Response) {
    try {
      await this.productsService.getProductById(req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }

  @Get('/author/:aid')
  async getProductsByAuthorId(@Req() req: Request, @Res() res: Response) {
    try {
      await this.productsService.getProductsByAuthorId(req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }
  @Post('create')
  async createProduct(
    @Body('name') name: string,
    @Body('description') desc: string,
    @Body('amount') amount: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.productsService.createProduct(name, desc, amount, req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }
}
