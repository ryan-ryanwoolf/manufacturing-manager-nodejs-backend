import { Product } from "../schema/product.schema";
import { CreateStockMovementInput, GetStockMovementInput, StockMovementModel } from "../schema/stock.movement.schema";
import { User } from "../schema/user.schema";

class StockMovementService {

    async createStockMovement(input: CreateStockMovementInput & { user: User["_id"] } & { stockLevel: number }) {
        return StockMovementModel.create(input);
    }

    async getPreviousStockMovement(product: GetStockMovementInput): Promise<string>{
        return StockMovementModel.findOne(product).lean();
    }


}

export default StockMovementService