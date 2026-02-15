import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './entities/quote.entity';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { GroupsModule } from '../groups/groups.module';
import { MembersModule } from '../members/members.module';
import { RiskScoringModule } from '../risk-scoring/risk-scoring.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quote]),
    GroupsModule,
    MembersModule,
    RiskScoringModule,
  ],
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService],
})
export class QuotesModule {}
