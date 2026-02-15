import { IsString, IsOptional, IsObject } from 'class-validator';

export class BindPolicyDto {
  @IsString()
  quoteId: string;

  @IsOptional()
  @IsString()
  boundBy?: string;

  @IsOptional()
  @IsObject()
  terms?: Record<string, any>;
}
