import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Venue } from '../../entities/venue.entity';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  async findAll(filters: any) {
    const where: FindOptionsWhere<Venue> = {};
    if (filters.location) {
      where.location = filters.location;
    }
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive === 'true';
    }
    return this.venueRepository.find({ where, relations: ['images'] });
  }

  async findOne(id: string) {
    return this.venueRepository.findOne({ where: { id }, relations: ['images'] });
  }
}
