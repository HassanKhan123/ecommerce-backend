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

import { generateResponse } from '../../utils/responseHandler.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get('')
  async getAllProducts(@Req() req: Request, @Res() res: Response) {
    const response = await this.productsService.getAllProducts();
    generateResponse(response, res);
  }
  @Get(':pid')
  async getProductById(@Req() req: Request, @Res() res: Response) {
    const response = await this.productsService.getProductById(req);
    generateResponse(response, res);
  }

  @Get('/author/:aid')
  async getProductsByAuthorId(@Req() req: Request, @Res() res: Response) {
    const response = await this.productsService.getProductsByAuthorId(req);
    generateResponse(response, res);
  }

  @Get('/reviews/:pid')
  async getAllProductReviews(@Req() req: Request, @Res() res: Response) {
    const response = await this.productsService.getAllProductReviews(req);
    generateResponse(response, res);
  }
  @Post('create')
  async createProduct(
    @Body('name') name: string,
    @Body('description') desc: string,
    @Body('amount') amount: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.productsService.createProduct(
      name,
      desc,
      amount,
      req,
    );
    generateResponse(response, res);
  }

  @Post('review')
  async postReview(
    @Body('productId') pid: string,
    @Body('review') review: string,
    @Body('rating') rating: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.productsService.postReview(
      pid,
      review,
      rating,
      req,
    );
    generateResponse(response, res);
  }

  @Delete(':pid')
  async deleteProduct(@Req() req: Request, @Res() res: Response) {
    const response = await this.productsService.deleteProduct(req);
    generateResponse(response, res);
  }
}
