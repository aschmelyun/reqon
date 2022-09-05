import { Application } from 'express';
import { ParsedArgs } from 'minimist';
import { Low } from 'lowdb';
import Entry from './Interfaces/Entry.js';
export default class Reqon {
    db: null | Low<{
        entries: Entry[];
    }>;
    args: ParsedArgs;
    reqonDir: string;
    listener: Application;
    dashboard: Application;
    static run(): void;
    constructor();
    setup(): Promise<Reqon>;
    drawTitle(): Reqon;
    initListener(): Reqon;
    initDashboard(): Reqon;
}
