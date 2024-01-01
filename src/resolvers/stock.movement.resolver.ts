import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateStockMovementInput, StockMovement, StockMovementModel } from "../schema/stock.movement.schema";
import StockMovementService from "../services/stock.movement.service";
import Context from "../types/context";

@Resolver()
export default class StockMovementResolver {

    constructor(private stockMovementService: StockMovementService){
        this.stockMovementService = new StockMovementService();
    }

    @Authorized()
    @Mutation(() => StockMovement)
    async updateStockMovement(@Arg('input') input: CreateStockMovementInput, @Ctx() context: Context){

        const productId = input.product;
        const stockMovement = input.stockMovement;
        const mostRecentEntry = await StockMovementModel
        .findOne({product:productId})
        .sort({ stockMovementDateTime: -1})
        .limit(1)

        let previousStock = 0;
        if(mostRecentEntry){
            previousStock = mostRecentEntry.stockLevel;
        }

        const newStockLevel:number = previousStock + stockMovement;
        
        const user = context.user!; 

        return this.stockMovementService.createStockMovement({ ...input, user: user?._id, stockLevel: newStockLevel, });
    }
}