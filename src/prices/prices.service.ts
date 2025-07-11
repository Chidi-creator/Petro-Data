import {
  HttpStatus,
  Injectable,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PricesRepository } from './prices.repository';
import * as csv from 'csv-parse/sync';
import { CustomHttpException } from 'src/common/filters/customException.filter';
import { Price } from 'src/common/schemas/prices.schema';
import { FilterQuery } from 'mongoose';
import { DEFAULT_PAGINATION_LIMIT, PaginationOptions, ProductType } from 'src/common/config/constants';

@Injectable()
export class PricesService {
  constructor(private readonly priceRepository: PricesRepository) {}

  async uploadPrices(file: Express.Multer.File) {
    const records = csv.parse(file.buffer, {
      columns: (header: string[]) =>
        header.map((h) => h.replace(/['"]+/g, '').trim()),
      trim: true,
    }) as Record<string, string>[];

    // console.log(Object.keys(records[0]));
    // console.log(records[0])
    const prices = records.map((row) => ({
      state: row['State'],
      period: new Date(row.Period),
      ago: Number(row.AGO),
      pms: Number(row.PMS),
      dpk: Number(row.DPK),
      lpg: Number(row.LPG),
      region: row.Region,
    }));

    try {
      return await this.priceRepository.bulkInsert(prices);
    } catch (error) {
      console.error('Error Uploading File:', error);
      throw new CustomHttpException(
        'Error Uploading File: ' + (error?.message || error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCurrentProductPrice(
    region?: string,
    state?: string,
  ): Promise<Partial<Price>[]> {
    try {
      return await this.priceRepository.getCurrentProductPrice(region, state);
    } catch (error) {
      console.error('Error fetching Prices:', error);
      throw new CustomHttpException(
        'Error fetching Prices: ' + (error?.message || error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async GetPrices(state?: string, region?: string, options?: PaginationOptions): Promise<Array<Price>> {
    const filter: FilterQuery<Price> = {};

    if (state) filter.state = state;
    if (region) filter.region = region;

    try {
      const document = await this.priceRepository.findAll(filter, options);
      return document;
    } catch (error) {
      console.error('Error fetching Prices:', error);
      throw new CustomHttpException(
        'Error fetching Prices: ' + (error?.message || error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductHistory(
    product: ProductType,
    period: Date,
    duration?: number,
    state?: string,
  ) {
    try {
      const document = await this.priceRepository.getProductHistory(
        product,
        period,
        duration,
        state,
      );
      return document;
    } catch (error) {
      console.error('Error fetching Price History:', error);
      throw new CustomHttpException(
        'Error fetching Price History: ' + (error?.message || error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductPerformanceOverPeriod(
    period: Date,
    duration: number,
    state: string,
    product?: ProductType,
  ): Promise<
    Array<{
      state: string;
      product: ProductType;
      history: { period: Date; price: number }[];
      change: number;
      percentageChange: number;
    }>
  > {
    try {
      const document = await this.priceRepository.getPricePerformanceOverPeriod(
        period,
        duration,
        state,
        product,
      );
      return document;
    } catch (error) {
      console.error('Error fetching Price Performance:', error);
      throw new CustomHttpException(
        'Error fetching Price Performance: ' + (error?.message || error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWeeklyProductHistory(
    product: ProductType,
    state: string,
    week: number,
    year: number,
  ): Promise<{
    state: string;
    product: ProductType;
    history: { period: Date; price: number }[];
    latest: number;
    previous: number;
    change: number;
    percentageChange: number;
  }> {
    try {
      const document = await this.priceRepository.getWeeklyProductHistory(
        product,
        state,
        week,
        year,
      );
      return document;
    } catch (error) {
      console.error('Error fetching Weekly Product History:', error);
      throw new CustomHttpException(
        'Error fetching Weekly Product History: ' + (error?.message || error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchQuery(
    query: FilterQuery<Price> = {},
    options? : PaginationOptions
  ): Promise<Price[]> {
   

    try {
      const document = await this.priceRepository.findAll(query,options );
      return document;
    } catch (error) {
      console.error('Error fetching Prices:', error);
      throw new CustomHttpException(
        'Error fetching Prices: ' + (error?.message || error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
