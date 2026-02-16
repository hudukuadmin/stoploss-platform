import { Module } from '@nestjs/common';
import { AiNarrativeService } from './ai-narrative.service';
import { AiNarrativeController } from './ai-narrative.controller';

@Module({
  controllers: [AiNarrativeController],
  providers: [AiNarrativeService],
  exports: [AiNarrativeService],
})
export class AiNarrativeModule {}
