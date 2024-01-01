import UserResolver from "../resolvers/user.resolver";
import ProductResolver from "./product.resolver";
import StockMovementResolver from "./stock.movement.resolver";
console.log("Resolvers:", [UserResolver]);

export const resolvers = [UserResolver, ProductResolver, StockMovementResolver] as const;