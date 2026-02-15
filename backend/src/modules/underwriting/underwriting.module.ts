import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnderwritingReview } from './entities/underwriting-review.entity';
import { UnderwritingService } from './underwriting.service';
import { UnderwritingController } from './underwriting.controller';
import { QuotesModule } from '../quotes/quotes.module';
import { GroupsModule } from '../groups/groups.module';
import { MembersModule } from '../members/members.module';
import { RiskScoringModule } from '../risk-scoring/risk-scoring.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnderwritingReview]),
    QuotesModule,
    GroupsModule,
    MembersModule,
    RiskScoringModule,
  ],
  controllers: [UnderwritingController],
  providers: [UnderwritingService],
  exports: [UnderwritingService],
})
export class UnderwritingModule {}
