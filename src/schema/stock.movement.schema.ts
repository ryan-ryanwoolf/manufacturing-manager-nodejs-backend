import { Ref, getModelForClass, index, prop } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { IsNumber, MaxLength, Min, MinLength } from "class-validator";
import { User } from "./user.schema";
import { Product } from "./product.schema";



@ObjectType()
export class StockMovement {
    @Field(() => String)
    _id: string

    @Field(() => String)
    @prop({ required: true, ref: () => User})
    user: Ref<User>;

    @Field(() => String)
    @prop({ required: true, ref: () => Product})
    product: Ref<Product>;

    @Field(() => Number)
    @prop({ required: true})
    stockLevel: number;

    @Field(() => Number)
    @prop({ required: true})
    stockMovement: number;

    @Field(() => Date)
    @prop({ required: true, default: () => new Date()})
    stockMovementDateTime: Date;
}

export const StockMovementModel = getModelForClass<typeof StockMovement>(StockMovement);

@InputType()
export class CreateStockMovementInput {
  
  @Field(() => String)
  product: Ref<Product>;
  
  //Stock movement usage is negative number e.g. -20 restocking is positive number e.g. 50
  @Field(() => Number)
  stockMovement: number;
}

@InputType()
export class GetStockMovementInput {
    @Field()
    _id: string;
}