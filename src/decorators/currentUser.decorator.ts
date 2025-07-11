import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/common/schemas/users.schema";

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
)