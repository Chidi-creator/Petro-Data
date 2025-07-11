import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SuccessMessage } from 'src/decorators/successMessage.decorator';
import { PricesService } from './prices.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CurrentPriceQueryDto,
  GetPricesQueryDto,
  PricePerformanceOverPeriodQueryDto,
  ProductHisoryQueryDto,
  SearchQueryDto,
  WeeklyProductHistoryDto,
} from './dto/prices.dto';
import {
  DEFAULT_PAGINATION_LIMIT,
  PaginationOptions,
} from 'src/common/config/constants';

@Controller('prices')
export class PricesController {
  constructor(private readonly priceService: PricesService) {}
  @SuccessMessage('Prices uploaded successfully')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPrices(@UploadedFile() file: Express.Multer.File) {
    return await this.priceService.uploadPrices(file);
  }

  @SuccessMessage('Prices fetched successfully')
  @Get('current')
  async getCurrentProductPrice(@Query() query: CurrentPriceQueryDto) {
    return await this.priceService.getCurrentProductPrice(
      query.region,
      query.state,
    );
  }

  @SuccessMessage('Prices fetched successfully')
  @Get('history')
  async getProductHistory(@Query() query: ProductHisoryQueryDto) {
    const durNum = parseInt(query.duration, 10);
    const perDate = new Date(query.period);
    return this.priceService.getProductHistory(
      query.product,
      perDate,
      durNum,
      query.state,
    );
  }

  @SuccessMessage('Prices fetched successfully')
  @Get()
  async getPrices(@Query() query: GetPricesQueryDto) {
    const limit = DEFAULT_PAGINATION_LIMIT;
    const skip = (query.page - 1) * limit;
    const options: PaginationOptions = {limit, skip};
    return await this.priceService.GetPrices(query.state, query.region, options);
  }

  @SuccessMessage('Products Performance fetched SUccessfully')
  @Get('performance')
  async getProductPerformanceOverPeriod(
    @Query() query: PricePerformanceOverPeriodQueryDto,
  ) {
    const durNum = parseInt(query.duration);
    const perDate = new Date(query.period);
    console.log(query);
    return await this.priceService.getProductPerformanceOverPeriod(
      perDate,
      durNum,
      query.state,
      query.product,
    );
  }

  @SuccessMessage('weekkly report successfully retrieved')
  @Get('weekly')
  async getWeeklyProductHistory(@Query() query: WeeklyProductHistoryDto) {
    return await this.priceService.getWeeklyProductHistory(
      query.product,
      query.state,
      query.week,
      query.year,
    );
  }

  //implementing search functionality
  @Get('search')
  async searchQuery(@Query() { query, page }: SearchQueryDto) {
    const filter = { state: new RegExp(`^${query}$`, 'i') };

    const limit = DEFAULT_PAGINATION_LIMIT;
    const skip = (page - 1) * limit;

    const options: PaginationOptions = { skip, limit };

    return await this.priceService.searchQuery(filter, options);
  }
}
