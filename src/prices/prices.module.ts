import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { PricesRepository } from './prices.repository';
import { MongooseModule } from '@nestjs/mongoose';
import PriceSchema, { Price } from 'src/common/schemas/prices.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Price.name, schema: PriceSchema}
    ])
  ],
  providers: [PricesService, PricesRepository],
  controllers: [PricesController]
})
export class PricesModule {}
