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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CurrentPriceQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by region name (e.g. "South West")',
    example: 'South South',
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: 'Filter by state name (e.g. "Enugu")',
    example: 'Kaduna',
  })
  @IsOptional()
  @IsString()
  state?: string;
}

export class ProductHisoryQueryDto {
  @ApiProperty({
    description: 'Reference date to look back from (inclusive)',
    example: '2024-12-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  period: Date;

  @ApiProperty({
    description: 'Product name to fetch history for',
    example: 'ago',
    enum: ['pms', 'ago', 'dpk', 'lpg'],
  })
  @IsNotEmpty()
  @IsString()
  product: ProductType;

  @ApiPropertyOptional({
    description: 'Filter by state name (e.g. "Ogun")',
    example: 'Ogun',
  })
  @IsOptional()
  @IsString()
  state: string;

  @ApiPropertyOptional({
    description: 'Number of records to return (e.g. last 7 days)',
    example: '7',
  })
  @IsOptional()
  @IsNumberString()
  duration: string;
}


export class PricePerformanceOverPeriodQueryDto {
  @ApiProperty({
    description: 'Latest date for price record inclusion',
    example: '2024-12-01T00:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  period: Date;

  @ApiProperty({
    description: 'Name of state to fetch price performance for',
    example: 'Kaduna',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Number of records to track backwards from "period"',
    example: '5',
  })
  @IsNotEmpty()
  @IsNumberString()
  duration: string;

  @ApiPropertyOptional({
    description: 'Filter results by specific product type',
    enum: ['pms', 'ago', 'dpk', 'lpg'],
    example: 'ago',
  })
  @IsOptional()
  @IsString()
  product: ProductType;
}


export class WeeklyProductHistoryDto {
  @ApiProperty({
    description: 'Fuel product type',
    enum: ['pms', 'ago', 'dpk', 'lpg'],
    example: 'ago',
  })
  @IsNotEmpty()
  @IsString()
  product: ProductType;

  @ApiProperty({
    description: 'Name of the state',
    example: 'Benue',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Week number of the year (1–52)',
    example: 49,
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  week: number;

  @ApiProperty({
    description: 'Year for the selected week',
    example: 2024,
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  year: number;
}
export class GetPricesQueryDto {
  @ApiPropertyOptional({
    description: 'State name to filter prices by',
    example: 'Oyo',
  })
  @IsOptional()
  @IsString()
  state: string;

  @ApiPropertyOptional({
    description: 'Region name to filter prices by',
    example: 'South West',
  })
  @IsOptional()
  @IsString()
  region: string;

  @ApiProperty({
    description: 'Pagination page number (starts from 1)',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
export class SearchQueryDto {
  @ApiProperty({
    description: 'State name to search for (e.g. "Abia")',
    example: 'Ogun',
  })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty({
    description: 'Pagination page number (must be ≥ 1)',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}