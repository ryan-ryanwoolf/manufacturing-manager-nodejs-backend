import { AuthChecker } from "type-graphql";
import Context from "../types/context";
import AuthMiddleware from "../middleware/auth.middleware";
import CognitoService from "../services/cognito.service";
import { User, UserModel } from "../schema/user.schema";

const authChecker: AuthChecker<Context> = async ({ context }) =>{
    console.log(`in auth checker`)
    console.log(`auth header:${JSON.stringify(context.req.headers)}`)
    if(context.req.headers.authorization){
        console.log(`token:${context.req.headers.authorization}`);
        const authToken:string = context.req.headers.authorization as string;
        
        const cognito = new CognitoService();
        console.log(`checking auth header`);
        const userInfo =await cognito.getUserInfo(authToken);
        const userAttributes = userInfo.UserAttributes;

        console.log(`userAttributes:${JSON.stringify(userInfo.UserAttributes)}`)
        let emailValue;

        for (const attribute of userAttributes) {
            if (attribute.Name === 'email') {
                emailValue = attribute.Value;
                break;
            }
        }

        console.log(`emailValue:${emailValue}`);

        const user = await UserModel.find().findByEmail(emailValue).lean();
        console.log(`user:${JSON.stringify(user)}`)
        context.user = user;
    }
    return !!context.user;;
}

export default authChecker;

