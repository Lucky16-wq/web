import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('checkout')
  async checkout(@Body() payload: any) {
    return this.paymentsService.createPaymentSession(payload);
  }

  @Post('webhook')
  async webhook(@Body() body: any) {
    return this.paymentsService.verifyWebhook(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles('Admin', 'Super Admin')
  @Get('status/:id')
  async status(@Param('id') id: string) {
    return { message: 'Payment status', id };
  }
}
