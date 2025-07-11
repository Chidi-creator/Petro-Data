// dto/query-prices.dto.ts
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsDate,
  IsNotEmpty,
  IsNumberString,
  IsInt,
  Min,
} from 'class-validator';
import { ProductType } from 'src/common/config/constants';

export class CurrentPriceQueryDto {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class ProductHisoryQueryDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  period: Date;

  @IsNotEmpty()
  @IsString()
  product: ProductType;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsNumberString()
  duration: string;
}

export class PricePerformanceOverPeriodQueryDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  period: Date;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsNumberString()
  duration: string;

  @IsOptional()
  @IsString()
  product: ProductType;
}

export class WeeklyProductHistoryDto {
  @IsNotEmpty()
  @IsString()
  product: ProductType;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  week: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  year: number;
}

export class GetPricesQueryDto {
  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  region: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
