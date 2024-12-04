import { Transform } from "class-transformer";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(1)
    @IsOptional()
    title: string;


    @IsString()
    @MinLength(1)
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number; 

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock: number;

    @IsString({each: true})
    @IsArray()
    sizes: string[];


    @Transform(({ value }) => value.toLowerCase())
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;


    @IsString({each: true})
    @IsArray()
    @IsOptional()
    tags?: string[];
   
}
