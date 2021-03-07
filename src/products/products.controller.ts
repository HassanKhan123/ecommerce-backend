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
    const response = await this.productsService.getAllProducts();
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
  }
  @Get(':pid')
  async getProductById(@Req() req: Request, @Res() res: Response) {
    const response = await this.productsService.getProductById(req);
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
  }

  @Get('/author/:aid')
  async getProductsByAuthorId(@Req() req: Request, @Res() res: Response) {
    const response = await this.productsService.getProductsByAuthorId(req);
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
  }

  @Get('/reviews/:pid')
  async getAllProductReviews(@Req() req: Request, @Res() res: Response) {
    const response = await this.productsService.getAllProductReviews(req);
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
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
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
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
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
  }

  @Delete(':pid')
  async deleteProduct(@Req() req: Request, @Res() res: Response) {
    const response = await this.productsService.deleteProduct(req);
    if (response.statusCode >= 400) {
      return res.status(response.statusCode).json(response);
    }

    res.status(response.statusCode).json(response);
  }
}
