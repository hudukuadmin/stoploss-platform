import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { GroupsModule } from './modules/groups/groups.module';
import { MembersModule } from './modules/members/members.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { UnderwritingModule } from './modules/underwriting/underwriting.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { RiskScoringModule } from './modules/risk-scoring/risk-scoring.module';
import { AiNarrativeModule } from './modules/ai-narrative/ai-narrative.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    GroupsModule,
    MembersModule,
    QuotesModule,
    PoliciesModule,
    UnderwritingModule,
    AnalyticsModule,
    RiskScoringModule,
    AiNarrativeModule,
  ],
})
export class AppModule {}
