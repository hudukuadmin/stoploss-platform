import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  memberIdExternal: string;

  @IsString()
  groupId: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  relationshipCode?: string;

  @IsOptional()
  @IsNumber()
  riskScore?: number;

  @IsOptional()
  @IsArray()
  chronicConditions?: string[];

  @IsOptional()
  @IsNumber()
  historicalClaimsAmount?: number;

  @IsOptional()
  @IsBoolean()
  largeClaimantFlag?: boolean;

  @IsOptional()
  @IsArray()
  diagnosisCodes?: string[];

  @IsOptional()
  @IsDateString()
  enrollmentDate?: string;

  @IsOptional()
  @IsDateString()
  terminationDate?: string;

  @IsOptional()
  @IsString()
  planType?: string;
}

export class BulkUploadMembersDto {
  @IsString()
  groupId: string;

  @IsArray()
  members: CreateMemberDto[];
}
