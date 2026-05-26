import { Controller, Get, Param, Query } from '@nestjs/common';
import { VenuesService } from './venues.service';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  async list(@Query() query: any) {
    return this.venuesService.findAll(query);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.venuesService.findOne(id);
  }
}
