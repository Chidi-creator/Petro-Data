import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
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
  Role,
} from 'src/common/config/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guards';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('prices')
export class PricesController {
  constructor(private readonly priceService: PricesService) {}
  @SuccessMessage('Prices uploaded successfully')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPrices(@UploadedFile() file: Express.Multer.File) {
    return await this.priceService.uploadPrices(file);
  }

  @ApiTags('Prices')
@ApiBearerAuth('access-token') // Enables "Authorize" button in Swagger UI
@ApiOperation({ summary: 'Fetch current product prices by region or state' })
@ApiQuery({
  name: 'region',
  required: false,
  type: String,
  description: 'Region to filter prices by (e.g. "South West")',
  example: 'South East',
})
@ApiQuery({
  name: 'state',
  required: false,
  type: String,
  description: 'State to filter prices by (e.g. "Abia")',
  example: 'Lagos',
})
@ApiResponse({
  status: 200,
  description: 'Prices fetched successfully',
})
@ApiResponse({
  status: 403,
  description: 'Unauthorized or forbidden access',
})
  @SuccessMessage('Prices fetched successfully')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('current')
  async getCurrentProductPrice(@Query() query: CurrentPriceQueryDto) {
    return await this.priceService.getCurrentProductPrice(
      query.region,
      query.state,
    );
  }


@ApiTags('Prices')
@ApiBearerAuth('access-token')
@ApiOperation({ summary: 'Fetch historical price data for a product' })
@ApiQuery({
  name: 'period',
  required: true,
  type: String,
  format: 'date-time',
  description: 'Latest day to fetch price history before (inclusive)',
  example: '2024-12-01T00:00:00.000Z',
})
@ApiQuery({
  name: 'product',
  required: true,
  type: String,
  enum: ['pms', 'ago', 'dpk', 'lpg'],
  description: 'Product type to fetch history for',
  example: 'pms',
})
@ApiQuery({
  name: 'state',
  required: false,
  type: String,
  description: 'Filter by state (e.g. "Lagos")',
  example: 'Kano',
})
@ApiQuery({
  name: 'duration',
  required: false,
  type: Number,
  description: 'Number of recent records to return',
  example: 7,
})
@ApiResponse({
  status: 200,
  description: 'Prices fetched successfully',
})
  @SuccessMessage('Prices fetched successfully')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('history')
  async getProductHistory(@Query() query: ProductHisoryQueryDto) {
    const durNum = parseInt(query.duration, 10);
    const perDate = new Date(query.period);
    return this.priceService.getPriceHistory(
      query.product,
      perDate,
      durNum,
      query.state,
    );
  }


@ApiTags('Prices')
@ApiBearerAuth('access-token')
@ApiOperation({ summary: 'Fetch paginated price records by region or state' })
@ApiQuery({
  name: 'state',
  required: false,
  type: String,
  description: 'Filter prices by state name (e.g. "Abia")',
  example: 'Lagos',
})
@ApiQuery({
  name: 'region',
  required: false,
  type: String,
  description: 'Filter prices by region name (e.g. "South West")',
  example: 'North Central',
})
@ApiQuery({
  name: 'page',
  required: true,
  type: Number,
  description: 'Page number for pagination',
  example: 2,
})
@ApiResponse({
  status: 200,
  description: 'Prices fetched successfully',
})
  @SuccessMessage('Prices fetched successfully')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async getPrices(@Query() query: GetPricesQueryDto) {
    const limit = DEFAULT_PAGINATION_LIMIT;
    const skip = (query.page - 1) * limit;
    const options: PaginationOptions = { limit, skip };
    return await this.priceService.GetPrices(
      query.state,
      query.region,
      options,
    );
  }

  @ApiTags('Prices')
@ApiBearerAuth('access-token')
@ApiOperation({
  summary: 'Track product performance over time in a state',
  description: 'Returns price history, change, and percentage change for selected product(s) in a specific state over a time window.',
})
@ApiQuery({
  name: 'period',
  required: true,
  type: String,
  format: 'date-time',
  description: 'Upper bound reference date for price records',
  example: '2024-12-01T00:00:00.000Z',
})
@ApiQuery({
  name: 'state',
  required: true,
  type: String,
  description: 'State for which price performance is queried',
  example: 'Lagos',
})
@ApiQuery({
  name: 'duration',
  required: true,
  type: String,
  description: 'Number of records to include in history (minimum 2)',
  example: '5',
})
@ApiQuery({
  name: 'product',
  required: false,
  type: String,
  enum: ['pms', 'ago', 'dpk', 'lpg'],
  description: 'Filter by product type (optional)',
  example: 'pms',
})
@ApiResponse({
  status: 200,
  description: 'Products Performance fetched successfully',
})
@ApiResponse({
  status: 403,
  description: 'Access denied. Must be ADMIN or USER with valid token',
})
  @SuccessMessage('Products Performance fetched SUccessfully')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/product/performance')
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


@ApiTags('Prices')
@ApiBearerAuth('access-token')
@ApiOperation({
  summary: 'Get weekly price report for a specific product',
  description: 'Returns prices, change, and percentage change for a selected fuel product over a specific week.',
})
@ApiQuery({
  name: 'product',
  required: true,
  type: String,
  enum: ['pms', 'ago', 'dpk', 'lpg'],
  description: 'Fuel product type',
  example: 'pms',
})
@ApiQuery({
  name: 'state',
  required: true,
  type: String,
  description: 'Name of the state',
  example: 'Kano',
})
@ApiQuery({
  name: 'week',
  required: true,
  type: Number,
  description: 'Week number of the calendar year (ISO)',
  example: 48,
})
@ApiQuery({
  name: 'year',
  required: true,
  type: Number,
  description: 'Year for the selected week',
  example: 2024,
})
@ApiResponse({ status: 200, description: 'Weekly report successfully retrieved' })
@ApiResponse({ status: 403, description: 'Access denied. Must be ADMIN or USER' })
  @SuccessMessage('weekkly report successfully retrieved')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('weekly')
  async getWeeklyProductHistory(@Query() query: WeeklyProductHistoryDto) {
    return await this.priceService.getWeeklyPriceHistory(
      query.product,
      query.state,
      query.week,
      query.year,
    );
  }

  //implementing search functionality
    @ApiTags('Prices')
@ApiBearerAuth('access-token')
@ApiOperation({
  summary: 'Search fuel prices by state name',
  description: 'Returns paginated price records that match the given state query.',
})
@ApiQuery({
  name: 'query',
  required: true,
  type: String,
  description: 'Name of the state to search for',
  example: 'Abia',
})
@ApiQuery({
  name: 'page',
  required: true,
  type: Number,
  description: 'Page number (starts from 1)',
  example: 1,
})
@ApiResponse({
  status: 200,
  description: 'Prices successfully fetched for given query',
})
@ApiResponse({
  status: 403,
  description: 'Access denied. Requires valid role and authentication',
})
    @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('search')
  async searchQuery(@Query() { query, page }: SearchQueryDto) {
    const filter = { state: new RegExp(`^${query}$`, 'i') };

    const limit = DEFAULT_PAGINATION_LIMIT;
    const skip = (page - 1) * limit;

    const options: PaginationOptions = { skip, limit };

    return await this.priceService.searchQuery(filter, options);
  }
}
