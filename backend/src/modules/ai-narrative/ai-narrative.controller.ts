import { Controller, Post, Body } from '@nestjs/common';
import { AiNarrativeService, NarrativeRequest } from './ai-narrative.service';

@Controller('api/ai-narrative')
export class AiNarrativeController {
  constructor(private readonly aiNarrativeService: AiNarrativeService) {}

  @Post('generate')
  generate(@Body() request: NarrativeRequest) {
    return this.aiNarrativeService.generateNarrative(request);
  }
}
