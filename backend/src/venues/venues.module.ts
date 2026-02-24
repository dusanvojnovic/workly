import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VenuesController } from './venues.controller';
import { VenuesService } from './venues.service';

@Module({
  controllers: [VenuesController],
  providers: [VenuesService, PrismaService],
})
export class VenuesModule {}
