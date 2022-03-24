import {NextFunction, Request, Response} from "express";

export const header = (req: Request, res: Response, next: NextFunction) => {
    res.header("Cache-control", "no-cache, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Access-Control-Allow-Methods", "GET HEAD PUT PATCH POST DELETE");
    res.header("Access-Control-Allow-Credentials", "true")
    next();
};


