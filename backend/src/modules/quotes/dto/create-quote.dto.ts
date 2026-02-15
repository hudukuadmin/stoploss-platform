import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  IsInt,
} from 'class-validator';
import { CoverageType } from '../../../common/enums';

export class CreateQuoteDto {
  @IsString()
  groupId: string;

  @IsEnum(CoverageType)
  coverageType: CoverageType;

  @IsOptional()
  @IsNumber()
  specificAttachmentPoint?: number;

  @IsOptional()
  @IsNumber()
  specificMaxLiability?: number;

  @IsOptional()
  @IsNumber()
  aggregateAttachmentFactor?: number;

  @IsOptional()
  @IsNumber()
  aggregateMaxLiability?: number;

  @IsDateString()
  effectiveDate: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsInt()
  contractPeriodMonths?: number;
}
