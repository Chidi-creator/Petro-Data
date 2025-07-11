import { HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ProductType } from 'src/common/config/constants';
import { CustomHttpException } from 'src/common/filters/customException.filter';
import { AbstractRepository } from 'src/common/schemas/abstract.repository';
import { Price } from 'src/common/schemas/prices.schema';
import { getWeekDates } from 'src/utils/helper.utils';



export class PricesRepository extends AbstractRepository<Price> {
  constructor(@InjectModel(Price.name) priceModel: Model<Price>) {
    super(priceModel);
  }

  async bulkInsert(prices: Partial<Price>[]) {
    return await this.model.insertMany(prices);
  }

  async getCurrentProductPrice(
    region?: string,
    state?: string,
  ): Promise<Partial<Price>[]> {
    const filter: FilterQuery<Price> = {};

    if (state) {
      const normalizedState = state.trim();
      filter.state = { $regex: new RegExp(`^${normalizedState}$`, 'i') };
    }
    if (region) {
      const normalizedRegion = region.trim().replace(/\s+/g, '\\s*');
      filter.region = { $regex: new RegExp(`^${normalizedRegion}$`, 'i') };
    }

    if (region || state) {
      const result = await this.model.aggregate([
        { $match: filter },
        { $sort: { period: -1 } },
        { $limit: 1 },
      ]);
      return result;
    }

    //add pagination here later
    const result = await this.model.aggregate([
      { $sort: { period: -1 } },
      {
        $group: {
          _id: '$state',
          state: { $first: '$state' },
          region: { $first: '$region' },
          period: { $first: '$period' },
          ago: { $first: '$ago' },
          pms: { $first: '$pms' },
          dpk: { $first: '$dpk' },
          lpg: { $first: '$lpg' },
          updatedAt: { $first: '$updatedAt' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $project: { _id: 0 } },
    ]);
    return result;
  }


  async getPriceHistory(
    product: ProductType,
    period: Date,
    duration?: number,
    state?: string,
  ): Promise<
    Array<{ period: Date; product: ProductType; price: number; state: string }>
  > {
    const filter: Record<string, any> = {};

    filter.period = { $lte: new Date(period) };
    const endOfPeriod = new Date(period);
    endOfPeriod.setHours(23, 59, 59, 999);

    filter.period = { $lte: endOfPeriod };

    if (state) {
      filter.state = { $regex: new RegExp(`^${state.trim()}$`, 'i') };
    }
    const allowedProducts: ProductType[] = ['pms', 'ago', 'dpk', 'lpg'];
    if (!allowedProducts.includes(product)) {
      throw new CustomHttpException(
        `Invalid product "${product}". Must be one of ${allowedProducts.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.model.aggregate([
      { $match: filter },
      { $sort: { period: -1 } },
      ...(duration ? [{ $limit: duration }] : []),
      {
        $project: {
          _id: 0,
          period: 1,
          state: 1,
          product: { $literal: product },
          price: `$${product}`,
        },
      },
      { $sort: { period: 1 } },
    ]);

    return result;
  }

  async getPricePerformanceOverPeriod(
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
    const matchDate = period ? new Date(period) : new Date();
    matchDate.setHours(23, 59, 59, 999);
    const matchFilter: Record<string, any> = {
      period: { $lte: matchDate },
    };

    if (state) {
      matchFilter.state = { $regex: new RegExp(`^${state.trim()}$`, 'i') };
    }

    if (!duration || duration < 2) duration = 2;
    const productList: ProductType[] = product
      ? [product]
      : (['pms', 'ago', 'dpk', 'lpg'] as ProductType[]);

    const results: Array<{
      state: string;
      product: ProductType;
      history: { period: Date; price: number }[];
      change: number;
      percentageChange: number;
    }> = [];

    for (const prod of productList) {
      const document = await this.model.aggregate([
        { $match: matchFilter },
        { $sort: { period: -1 } },
        {
          $group: {
            _id: '$state',
            prices: { $push: `$${prod}` },
            periods: { $push: '$period' },
          },
        },
        {
          $project: {
            state: '$_id',
            product: { $literal: prod },
            history: {
              $map: {
                input: {
                  $slice: [
                    { $zip: { inputs: ['$periods', '$prices'] } },
                    duration || 2,
                  ],
                },
                as: 'entry',
                in: {
                  period: { $arrayElemAt: ['$$entry', 0] },
                  price: { $arrayElemAt: ['$$entry', 1] },
                },
              },
            },
            latest: { $arrayElemAt: ['$prices', 0] },
            previous: {
              $cond: {
                if: { $gte: [{ $size: '$prices' }, duration || 2] },
                then: { $arrayElemAt: ['$prices', (duration || 2) - 1] },
                else: null,
              },
            },
          },
        },
        {
          $addFields: {
            change: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$previous', null] },
                    { $eq: ['$latest', null] },
                  ],
                },
                0,
                {
                  $round: [
                    { $divide: [{ $subtract: ['$latest', '$previous'] }, 100] },
                    2,
                  ],
                },
              ],
            },
            percentageChange: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$previous', null] },
                    { $eq: ['$previous', 0] },
                  ],
                },
                0,
                {
                  $round: [
                    {
                      $divide: [
                        {
                          $divide: [
                            { $subtract: ['$latest', '$previous'] },
                            '$previous',
                          ],
                        },
                        100,
                      ],
                    },
                    4,
                  ],
                },
              ],
            },
          },
        },
        { $project: { _id: 0 } },
      ]);
      results.push(...document);
    }
    return results;
  }

  async getWeeklyPriceHistory(
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
    const allowedProducts: ProductType[] = ['pms', 'ago', 'dpk', 'lpg'];
    if (!allowedProducts.includes(product)) {
      throw new CustomHttpException(
        `Invalid product "${product}". Must be one of ${allowedProducts.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const weekDates = getWeekDates(week, year);
    const startDate = weekDates[0];
    const endDate = new Date(weekDates[6]);
    endDate.setHours(23, 59, 59, 999);

    const matchFilter = {
      state: { $regex: new RegExp(`^${state.trim()}$`, 'i') },
      period: { $gte: startDate, $lte: endDate },
    };

    const document = await this.model.aggregate([
      { $match: matchFilter },
      { $sort: { period: -1 } },
      {
        $project: {
          period: 1,
          price: `$${product}`,
          state: 1,
          product: { $literal: product },
        },
      },
    ]);

    const history = document.map((doc) => ({
      period: doc.period,
      price: doc.price,
    }));

    const latest = history[0]?.price ?? 0;
    const previous = history[1]?.price ?? 0;

    
    const change = +(latest - previous) / 100;
    const percentageChange =
      previous === 0 ? 0 : +((latest - previous) / previous / 100).toFixed(4);

    return {
      state,
      product,
      history,
      latest,
      previous,
      change: +change.toFixed(2),
      percentageChange,
    };
  }
}
