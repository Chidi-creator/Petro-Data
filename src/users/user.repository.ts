import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "src/common/schemas/abstract.repository";
import { User } from "src/common/schemas/users.schema";

export class UserRepository extends AbstractRepository<User>{
    constructor(@InjectModel(User.name) userModel: Model<User>){
        super(userModel)
    }


}