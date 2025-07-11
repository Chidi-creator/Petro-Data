import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "../config/constants";
import { IUser } from "./types/Users";
import { AbstractDocument } from "./abstract.schema";


@Schema({ timestamps: true })
export class User extends AbstractDocument implements IUser {
    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop({unique: true})
    phoneNumber: string;
    
    @Prop({
        type:[{type: String, enum: Role}],
        default: [Role.USER]
    })
    role: Role[];
}

const UserSchema = SchemaFactory.createForClass(User);

export default UserSchema;
