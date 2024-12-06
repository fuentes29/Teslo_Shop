import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('text', { nullable: false })
    url: string;

    @ManyToOne(
        () => Product,
        product => product.images,
        { 
            nullable: false,
            onDelete: 'CASCADE',

        }
    )
        
    product: Product;

}