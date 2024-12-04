import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, Param } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)  
    private readonly productRepository: Repository<Product>,

  ) {}
  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
 
      return product;

    } catch (error) {
      this.handleDBExceptions(error);
    }
      
  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let product: Product;
  
    if (isUUID(term)) { 
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');

      product = await queryBuilder
        .where('LOWER(title) = LOWER(:title) or LOWER(slug) = LOWER(:slug)', { 
          title: term,
          slug: term
        }).getOne();
    }

    if (!product) {
      throw new NotFoundException(`Producto con ID o slug "${term}" no encontrado`);
    }

    return product;

  }


  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({
        id: id,
        ...updateProductDto,
      });
      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      return this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(@Param('id') id: string){
    try {
      const producto = await this.productRepository.delete(id);
      
      if (!producto) {
          throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return {
          status: 'success',
          message: 'Producto eliminado correctamente',
          deletedProduct: producto
      };
  } catch (error) {
      if (error instanceof NotFoundException) {
          throw error;
      }
      throw new InternalServerErrorException('Error al eliminar el producto');
  }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
