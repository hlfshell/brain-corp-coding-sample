import { Request, Response } from "express";

export interface RouteFunction {
    (req : Request, res : Response) : void | Promise<void>
} 

export interface Route {
    [key : string] : RouteFunction
}