import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import ProductService from "../services/product/product.service";
import { CreateProductInput, GetProductInput, Product } from "../schema/product.schema";
import Context from "../types/context";


@Resolver()
export default class ProductResolver {

    constructor(private productService:ProductService){
        this.productService = new ProductService();
    }

    // @Authorized()
    @Mutation(() => Product)
    createProduct(@Arg('input') input: CreateProductInput){

        console.log(`input:${JSON.stringify(input)}`);
        return this.productService.createProduct({ ...input })
    }

    @Query(() => [Product])
    products(){
        return this.productService.findProducts();
    }

    @Authorized()
    @Query(() => Product)
    product(@Arg("input") input: GetProductInput, @Ctx() context: Context){
        console.log(`context:${JSON.stringify(context.user)}`);
        return this.productService.findSingleProduct(input);
    }
    

}