import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(payload: Partial<Notification>) {
    const notification = this.notificationRepository.create(payload);
    return this.notificationRepository.save(notification);
  }

  async findAllForUser(userId: string) {
    return this.notificationRepository.find({ where: { user: { id: userId } } });
  }
}
