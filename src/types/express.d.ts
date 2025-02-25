import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: any; // Define `user` property (Modify type as needed)
  }
}
