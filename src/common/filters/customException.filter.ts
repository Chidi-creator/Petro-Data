import { HttpException } from "@nestjs/common";


export class CustomHttpException extends HttpException{
    constructor(message: string, statusCode: number) {
        super({
            statusCode,
            message,
            timestamp: new Date().toISOString(),
        }, statusCode);
    }

}