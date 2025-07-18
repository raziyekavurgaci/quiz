import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEnum,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { OptionLabel } from '@prisma/client';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  optionText: string;

  @IsEnum(OptionLabel)
  @IsNotEmpty()
  optionType: OptionLabel;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;
}

export class UpdateOptionDto {
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(255)
  optionText?: string;

  @IsEnum(OptionLabel)
  @IsOptional()
  optionType?: OptionLabel;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;
}
