import { Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { BrandsService } from './brands.service';

type ValidateQuery = {
  skip?: number;
  limit?: number;
};

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get() // Get brands
  async findAll() {
    return await this.brandsService.findAll();
  }

  @Get('validate') // Get brands and transform them
  async validateAll(@Query() query: ValidateQuery) {
    const { limit, skip } = query;
    return await this.brandsService.validateAll(skip, limit);
  }

  @Patch() // Transform and update brands
  async validateAndUpdate() {
    return await this.brandsService.validateAndUpdate();
  }

  @Post() // Generate new documents
  async extendDatabase() {
    return await this.brandsService.extendDatabase();
  }
}
