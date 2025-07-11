export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export interface TokenPayload {
  userId: string;
}

export type ProductType = 'ago' | 'pms' | 'dpk' | 'lpg';

export const DEFAULT_PAGINATION_LIMIT: number = 10;

export interface PaginationOptions {
  skip: number;
  limit: number;
}

