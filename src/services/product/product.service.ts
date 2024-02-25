import { CreateProductInput, GetProductInput, ProductModel } from "../../schema/product.schema";

class ProductService {

    async createProduct(input: CreateProductInput) {
        console.log(`input: ${JSON.stringify(input)}`);
        return ProductModel.create(input);
      }

    async findProducts(){
        // Pagination logic
        return ProductModel.find().lean();
    }

    async findSingleProduct(input: GetProductInput){
        return ProductModel.findOne(input).lean();
    }
}

export default ProductService