import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './entities/policy.entity';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';
import { QuotesModule } from '../quotes/quotes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Policy]), QuotesModule],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
