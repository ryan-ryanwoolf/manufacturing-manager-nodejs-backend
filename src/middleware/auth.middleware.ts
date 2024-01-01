import { Request, Response } from 'express';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import { User } from '../schema/user.schema';

let pems  = {}

class AuthMiddleware {
    private poolRegion: string = 'eu-north-1';
    private userPoolId = 'eu-north-1_Apv20dnjD';

    constructor() {
        this.setUp()
      }
    
      private verifyTokenRest(req: Request, resp: Response, next): void {

        const token = req.header('Auth');

        console.log(token)
        if (!token) {
            resp.status(401).end();
            return;
        }
        
    
        let decodedJwt: any = jwt.decode(token, { complete: true });
        if (decodedJwt === null) {
          resp.status(401).end()
          return
        }
        console.log(decodedJwt)
        let kid = decodedJwt.header.kid;
        let pem = pems[kid];
        console.log(pem)
        if (!pem) {
          resp.status(401).end()
          return
        }
        jwt.verify(token, pem, function (err: any, payload: any) {
          if (err) {
            resp.status(401).end()
            return
          } else {
            next()
          }
        })
      }

      public async verifyTokenGraphql(req: Request, resp: Response): Promise<User | null> {

        const token = req.header('Auth');

        if (!token) {
            resp.status(401).end();
            return null;
        }
        
    
        let decodedJwt: any = jwt.decode(token, { complete: true });

        console.log(`decodedJwt: ${JSON.stringify(decodedJwt)}`);
        // if (decodedJwt === null) {
          resp.status(401).end()
          return null;
        // }
        
        let kid = decodedJwt.header.kid;
        let pem = pems[kid];
        
        if (!pem) {
          resp.status(401).end()
          return null;
        }
        jwt.verify(token, pem, function (err: any, payload: any) {
          if (err) {
            resp.status(401).end()
            return null;
          } else {
            
          }
        })
      }
    
      private async setUp() {
        const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;
    
        try {
          const response = await fetch(URL);
          if (response.status !== 200) {
            throw 'request not successful'
          }
          const data = await response.json();
          const { keys } = data;
            for (let i = 0; i < keys.length; i++) {
              const key_id = keys[i].kid;
              const modulus = keys[i].n;
              const exponent = keys[i].e;
              const key_type = keys[i].kty;
              const jwk = { kty: key_type, n: modulus, e: exponent };
              const pem = jwkToPem(jwk);
              pems[key_id] = pem;
            }
        } catch (error) {
          console.log(error)
          console.log('Error! Unable to download JWKs');
        }
      }
    }
    
    export default AuthMiddleware