import { Type } from 'class-transformer';
import { IsUUID, IsNumber, IsString, MinLength, IsISO8601 } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  venueId: string;

  @IsISO8601()
  startAt: string;

  @IsISO8601()
  endAt: string;

  @Type(() => Number)
  @IsNumber()
  totalPrice: number;

  @IsString()
  @MinLength(10)
  purpose: string;
}
