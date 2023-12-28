import express, { Request, Response} from 'express';


class HomeController {

    public path: string = '/';
    public router = express.Router()

    constructor(){
        this.initRoutes()
    }

    private initRoutes(){
        this.router.get('/',this.home);
    }

    home(req:Request, res: Response){
        res.send("success");
    }

}

export default HomeController;
