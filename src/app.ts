
import { ApolloServer } from 'apollo-server-express';
import express from 'express'
import { Application } from 'express'
import {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageProductionDefault,
  } from "apollo-server-core";

import { resolvers } from './resolvers';
import { buildSchema } from 'type-graphql';
import { connectToMongo } from './utils/mongo';
import AuthMiddleware from './middleware/auth.middleware';
import Context from './types/context';
import authChecker from './utils/authChecker';

class App {
    public app: Application
    public port: number
    schema;
    server: ApolloServer;
    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port

        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router)
        })
    }

    private async buildApolloSchema(){
        

        console.log(`done building schema`);
    }

    private async initializeApolloServer(){

        console.log(`about to initialize apollo server`)

        const schema = await buildSchema({
            resolvers,
            validate: { forbidUnknownValues: false }, 
            authChecker
        })

        this.server = new ApolloServer({
            schema,
            context: async (ctx: Context) =>{
                return ctx;
            },
            plugins: [
                process.env.NODE_ENV === 'production' ?
                ApolloServerPluginLandingPageProductionDefault() :
                ApolloServerPluginLandingPageGraphQLPlayground()
            ]
        })
        console.log(`done initializing apolloserver`);

    }

    private async  startApolloServer(){
        await this.server.start();
    }

    private async applyMiddlewareToApolloServer(){
        this.server.applyMiddleware({app: this.app});
    }

    public async  listen() {
        await this.buildApolloSchema();
        await this.initializeApolloServer();
        await this.startApolloServer();
        await this.applyMiddlewareToApolloServer();
        
        this.app.listen(this.port, async () => {
            console.log(`App listening on the http://localhost:${this.port}`)
            await connectToMongo();

        })
    }
}

export default App