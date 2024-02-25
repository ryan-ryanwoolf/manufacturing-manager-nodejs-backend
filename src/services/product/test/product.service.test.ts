import { CreateProductInput, ProductModel } from "../schema/product.schema";
import ProductService from "./product/product.service";

describe("product", () => {

    let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


    describe("add product", () => {
        describe("given the product information is valid", () => {
            it("should return a new product", async() => {
                const input: CreateProductInput = {
                name: 'Test Product',
                description: 'This is a test product',
                price: 20,
                };

                const productMock = new ProductModel(input);
                //@ts-ignore
                jest.spyOn(ProductModel, 'create').mockResolvedValue(productMock);

                const result = await productService.createProduct(input);

                expect(result).toEqual(productMock);
                expect(ProductModel.create).toHaveBeenCalledWith(input);
            })
        })
    })
})