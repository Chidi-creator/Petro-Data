export enum Role{
    ADMIN = 'admin',
    USER = 'user',
}


export interface TokenPayload {
    userId: string;
}

export type ProductType = "ago" | "pmg" | "dpk" | "lpg"