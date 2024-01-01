import { ReturnModelType, getModelForClass, index, prop, queryMethod } from "@typegoose/typegoose";
import { AsQueryMethod } from "@typegoose/typegoose/lib/types";
import { IsDate, IsEmail } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

function findByEmail(this: ReturnModelType<typeof User, QueryHelpers>, email: User['email']){
    return this.findOne({ email });
}

interface QueryHelpers {
    findByEmail: AsQueryMethod<typeof findByEmail>
}



@index({email: 1})
@queryMethod(findByEmail)
@ObjectType()
export class User {
    @Field(() => String)
    _id: string

    @Field(() => String)
    @prop({required: true})
    name: string

    @Field(() => String)
    @prop({required: true})
    familyName: string

    @Field(() => String)
    @prop({required: true})
    email: string

    @Field(() => Date)
    @prop({required: true})
    birthdate: Date

    
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User);

@InputType()
export class CreateUserInput {

    @Field(() => String)
    name: string;

    @Field(() => String)
    familyName: string;

    @IsEmail()
    @Field(() => String)
    email: string;

    @IsDate()
    @Field(() => Date)
    birthdate: Date
}