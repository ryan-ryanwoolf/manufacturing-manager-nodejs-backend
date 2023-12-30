
import { User } from "../schema/user.schema";
import { Query, Resolver } from "type-graphql";

@Resolver()
export default class UserResolver {

    @Query(() => User)
    me(){
        return {
            _id: "123",
            name: "Jane Doe",
            email: "Jane Doe",
        }
    }

}