import { IsString, IsEnum, IsOptional, IsInt, IsDateString, IsObject } from 'class-validator';
import { GroupType, ContractType } from '../../../common/enums';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsEnum(GroupType)
  groupType: GroupType;

  @IsEnum(ContractType)
  contractType: ContractType;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  sicCode?: string;

  @IsOptional()
  @IsInt()
  memberCount?: number;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @IsOptional()
  @IsDateString()
  renewalDate?: string;

  @IsOptional()
  @IsObject()
  historicalClaimsData?: Record<string, any>;

  @IsOptional()
  @IsObject()
  priorCoverage?: Record<string, any>;
}
