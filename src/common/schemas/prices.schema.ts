import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IPrice } from "./types/prices";
import { AbstractDocument } from "./abstract.schema";

@Schema({ timestamps: true })
export class Price extends AbstractDocument implements IPrice {
   @Prop()
    state: string;

    @Prop()
    region: string;

    @Prop()
    period: Date;

    @Prop()
    ago: number;

    @Prop()
    pms: number;

    @Prop()
    dpk: number;

    @Prop()
    lpg: number;

}

const PriceSchema = SchemaFactory.createForClass(Price);

export default PriceSchema;