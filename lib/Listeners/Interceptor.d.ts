import { Request, Response } from "express";
import { Low } from "lowdb";
import { ParsedArgs } from "minimist";
import Entry from '../Interfaces/Entry.js';
export default class Interceptor {
    static handle(req: Request, res: Response, db: null | Low<{
        entries: Entry[];
    }>, args: ParsedArgs): Promise<void>;
    static output(req: Request, key: "headers" | "query" | "body", title: string): void;
}
