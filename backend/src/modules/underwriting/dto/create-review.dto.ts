import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { UnderwritingDecision } from '../../../common/enums';

export class CreateReviewDto {
  @IsString()
  quoteId: string;

  @IsEnum(UnderwritingDecision)
  decision: UnderwritingDecision;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  reviewedBy?: string;

  @IsOptional()
  @IsArray()
  conditions?: string[];

  @IsOptional()
  @IsArray()
  exclusions?: string[];
}
