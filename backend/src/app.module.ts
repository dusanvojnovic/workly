import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VenuesModule } from './venues/venues.module';

@Module({
  imports: [AuthModule, VenuesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
