import { NotFoundException } from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { PaginationOptions } from '../config/constants';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  async create(
    Document: Omit<TDocument, '_id'> | Partial<TDocument>,
  ): Promise<TDocument> {
    const createdDocument = await this.model.create(Document);
    return createdDocument;
  }

  async findAll(
    filterQuery: FilterQuery<TDocument> = {},
    options?: PaginationOptions,
  ): Promise<TDocument[]> {
    let query = this.model.find(filterQuery);

    if (options) {
      query = query.skip(options.skip).limit(options.limit);
    }
    const documents = await query.exec();

    return documents;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument | null> {
    const document = await this.model.findOne(filterQuery);
    if (!document) {
      throw new NotFoundException(
        `Document not found with filter: ${JSON.stringify(filterQuery)}`,
      );
    }

    return document;
  }

  async findOneOrNull(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findOne(filterQuery);
  }

  async findById(id: string): Promise<TDocument | null> {
    const document = await this.model.findById(id);
    if (!document) {
      throw new NotFoundException(`Document not found with id: ${id}`);
    }
    return document;
  }

  async updateById(id: string, update: Partial<TDocument>): Promise<TDocument> {
    const updatedDocument = await this.model.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedDocument) {
      throw new NotFoundException(`Document not found with id: ${id}`);
    }

    return updatedDocument;
  }
}
