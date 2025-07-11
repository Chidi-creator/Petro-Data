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
  PricePerformanceOverPeriodQueryDto,
  ProductHisoryQueryDto,
} from './dto/prices.dto';

@Controller('prices')
export class PricesController {
  constructor(private readonly priceService: PricesService) {}
  @SuccessMessage('Prices uploaded successfully')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPrices(@UploadedFile() file: Express.Multer.File) {
    return this.priceService.uploadPrices(file);
  }

  @SuccessMessage('Prices fetched successfully')
  @Get('current')
  async getCurrentProductPrice(@Query() query: CurrentPriceQueryDto) {
    return this.priceService.getCurrentProductPrice(query.region, query.state);
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

  @SuccessMessage('Products Performance fetched SUccessfully')
  @Get('performance')
  async getProductPerformanceOverPeriod(
    @Query() query: PricePerformanceOverPeriodQueryDto,
  ) {
    const durNum = parseInt(query.duration);
    const perDate = new Date(query.period);
    console.log(query);
    return this.priceService.getProductPerformanceOverPeriod(
      perDate,
      durNum,
      query.state,
      query.product,
    );
  }
}
