import { Module } from '@nestjs/common';
import { BrandsModule } from './brands/brands.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), BrandsModule, DatabaseModule],
  providers: [DatabaseService],
})
export class AppModule {}
