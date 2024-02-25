import AWS from 'aws-sdk';
import crypto from 'crypto'
import SignInUserResponse from '../types/signInUserResponse';

class CognitoService {
    private config = {
        region: 'eu-north-1'
    }
    private secretHash:string = 'pdrslikei2l251422mvjfmf4jus2p2bt4nphu8t1mqbvhrkjv3b';
    private clientId:string = '37h76okhn9u5bo2i5psfc4u6e';
    private cognitoIdentity;

    constructor(){
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config)
    }

    public async signUpUser(username:string, password:string, userAttr: Array<any>): Promise<boolean>{
    
        const params = {
            ClientId:this.clientId,
            Password:password,
            Username: username,
            SecretHash: this.generateHash(username),
            UserAttributes: userAttr
        }

        try{
            const data = await this.cognitoIdentity.signUp(params).promise();
            return true;
        }
        catch(error)
        {
            console.log(error);
            return false;
        }
    }

    public async verifyAccount(username: string, code:string): Promise<boolean>{
        const params = {
            ClientId: this.clientId,
            ConfirmationCode: code,
            SecretHash: this.generateHash(username),
            Username: username
        }

        try{

            console.log(`${JSON.stringify(params)}`);
            const data = await this.cognitoIdentity.confirmSignUp(params).promise();
            return true;
        }catch(error){
            console.log(error);
            return false;
        }
    }

    public async signInUser(username:string, password:string): Promise<SignInUserResponse>{
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                'USERNAME': username,
                'PASSWORD': password,
                'SECRET_HASH': this.generateHash(username)
            }

        }
        try{
            const data = await this.cognitoIdentity.initiateAuth(params).promise();
            console.log(`data: ${JSON.stringify(data.AuthenticationResult.AccessToken)}`);
            return {
                success:true,
                accessToken: data.AuthenticationResult.AccessToken
            };
        }
        catch(error){
            console.log(error);
            return {
                success:false,
                accessToken: ""
            };
        }
        
    }

    public async getUserInfo(token:string): Promise<any>{
        const params = {
            AccessToken: token
        }
        try{
            const data = await this.cognitoIdentity.getUser(params).promise();
            console.log("\n\n - data",data);
            return data;
        }
        catch(error){
            console.log(error);
            return false;
        }
        
    }

    private generateHash(username: string): string {
        return crypto.createHmac('SHA256',this.secretHash)
        .update(username + this.clientId)
        .digest('base64')
    }


}

export default CognitoService;
