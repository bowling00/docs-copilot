import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  // findById(id: string) {
  //   return this.prisma.log.findUnique({
  //     where: {
  //       userId: id,
  //     },
  //     relations: {
  //       user: true,
  //     },
  //   });
  // }
}
