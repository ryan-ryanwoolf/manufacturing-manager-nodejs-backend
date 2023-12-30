import express, { Request, Response} from 'express';
import AuthMiddleware from '../middleware/auth.middleware'


class ProtectedController {

    public path: string = '/protected';
    public router = express.Router()
    private authMiddleware;

    constructor(){
        this.authMiddleware = new AuthMiddleware();
        this.initRoutes()
    }

    private initRoutes(){
        this.router.use(this.authMiddleware.verifyTokenRest);
        this.router.get('/secret',this.protected);
    }

    protected(req:Request, res: Response){
        res.send("the secret is cupcakes");
    }

}

export default ProtectedController;
