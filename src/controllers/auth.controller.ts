import express, { Request, Response} from 'express';
import {body, validationResult} from 'express-validator'
import CognitoService from '../services/cognito.service';
import { CreateUserInput, UserModel } from '../schema/user.schema';


class AuthController {

    public path: string = '/auth';
    public router = express.Router()

    constructor(){
        this.initRoutes()
    }

    private initRoutes(){
        this.router.post('/signUp',this.validateBody("signUp"),this.signUp);
        this.router.post('/signIn',this.validateBody("signIn"),this.signIn);
        this.router.post('/verify',this.validateBody("verify"),this.verify);
        this.router.get('/getUserAttributes',this.validateBody("getUserAttributes"),this.getUserAttributes);

        console.log(`initialized routes`);
    }

    signUp(req:Request, res: Response){
        const result = validationResult(req);
        if(!result.isEmpty()){
            return res.status(422).json({errors: result.array()});
        }

        const {username, password, email, name, family_name, birthdate} = req.body;

        let userAttr = [];
        userAttr.push({Name: 'email', Value: email});
        userAttr.push({Name: 'name', Value: name});
        userAttr.push({Name: 'family_name', Value: family_name});
        userAttr.push({Name: 'birthdate', Value: birthdate});


        const cognito = new CognitoService();
        let success = cognito.signUpUser(username,password, userAttr)
        .then(async success => {

            console.log(`success:${success}`);
            if(success){

                try{

                    console.log(`about to populate CreateUserInput`)
                    const input:CreateUserInput ={
                        name: name,
                        email: email,
                        familyName: family_name,
                        birthdate: new Date(birthdate)
                    }
                    console.log(`about to create mongodb user`)
    
                    const createdUser = await UserModel.create(input)
                }
                catch(error)
                {
                    res.status(500).end();
                }
                
                res.status(200).end();
            }
            else
            {
                res.status(500).end();
            }
            
        });

        return res.status(200).end();
    }

    async signIn(req:Request, res: Response){
        const result = validationResult(req);
        if(!result.isEmpty){
            return res.status(422).json({errors: result.array()});
        }

        const { username, password } = req.body;

        const cognito = new CognitoService();
        await cognito.signInUser(username, password)
        .then(response => {
            if(response.success){
                res.status(200).json(response).end()
            }
            else
            {
                res.status(500).end();
            }
        }).catch(err =>{
            res.status(500).end();
        })
    }

    verify(req:Request, res: Response){
        const result = validationResult(req);
        if(!result.isEmpty){
            return res.status(422).json({errors: result.array()});
        }

        const { username, code } = req.body;

        const cognito = new CognitoService();

        cognito.verifyAccount(username, code)
        .then(success => {
            if(success){
                res.status(200).end();
            }
            else
            {
                res.status(500).end();
            }
        })

        return res.status(200).end();
    }

    getUserAttributes(req: Request, res: Response){
        console.log(`in getUserAttributes`)
        const token = req.header('Auth')
        const cognito = new CognitoService();
        cognito.getUserInfo(token).then((data) => {
            res.status(200).json(data).end();
        });
    }

    private validateBody(type: string){
        switch(type){
            case 'signUp':
                return [
                    body('username').notEmpty().isLength({min:6}),
                    body('email').notEmpty().normalizeEmail().isEmail(),
                    body('password').isString().isLength({min:8}),
                    body('birthdate').exists().isISO8601(),
                    body('name').notEmpty().isString(),
                    body('family_name').notEmpty().isString()
                ]
                
            case 'signIn':
                return [
                    body('username').notEmpty().isLength({min:6}),
                    body('password').isString().isLength({min:8}),
                ]
            case 'verify':
                return [
                    body('username').notEmpty().isLength({min:6}),
                    body('code').isString().isLength({min:6, max:6}),
                ]
            case 'getUserAttributes':
                return [] 
        }
    }
}

export default AuthController;
