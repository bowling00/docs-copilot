import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  // findById(id: string) {
  //   return this.prisma.log.findUnique({
  //     where: {
  //       user_id: id,
  //     },
  //     relations: {
  //       user: true,
  //     },
  //   });
  // }
}
