var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from 'chalk';
import { homedir } from 'os';
import express from 'express';
import minimist from 'minimist';
import prettyMs from 'pretty-ms';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { existsSync, mkdirSync } from 'fs';
import Interceptor from './Listeners/Interceptor.js';
export default class Reqon {
    constructor() {
        this.reqonDir = join(homedir(), '.reqon');
        if (!existsSync(this.reqonDir)) {
            mkdirSync(this.reqonDir);
        }
        this.args = minimist(process.argv.slice(2), {
            string: [
                'port',
                'dashboard-port',
                'save-max',
                'save-file'
            ],
            boolean: [
                'save',
                'dashboard'
            ],
            default: {
                'port': 8080,
                'dashboard-port': 8081,
                'save-max': 100,
                'save-file': join(this.reqonDir, 'db.json'),
                'save': true,
                'dashboard': true
            }
        });
        this.listener = express();
        this.dashboard = express();
        this.db = null;
        if (this.args['save'] !== false) {
            const adapter = new JSONFile(this.args['save-file']);
            this.db = new Low(adapter);
        }
    }
    static run() {
        const reqon = new Reqon();
        reqon.setup()
            .then(() => {
            reqon.drawTitle()
                .initListener()
                .initDashboard();
        });
    }
    setup() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            process.stdout.write(String.fromCharCode(27) + "]0;" + "reqon - listening" + String.fromCharCode(7));
            if (this.db) {
                yield this.db.read();
                (_a = this.db).data || (_a.data = { entries: [] });
            }
            return this;
        });
    }
    drawTitle() {
        console.clear();
        console.log('');
        console.log(chalk.cyan.bold("┏━┓ ┏━━┓ ┏━━┓ ┏━━┓ ┏━┓ "));
        console.log(chalk.cyan.bold("┃┏┛ ┃┃━┫ ┃┏┓┃ ┃┏┓┃ ┃┏┓┓"));
        console.log(chalk.cyan.bold("┃┃  ┃┃━┫ ┃┗┛┃ ┃┗┛┃ ┃┃┃┃"));
        console.log(chalk.cyan.bold("┗┛  ┗━━┛ ┗━┓┃ ┗━━┛ ┗┛┗┛"));
        console.log(chalk.cyan.bold("           ┗┛          "));
        console.log('');
        return this;
    }
    initListener() {
        this.listener.use(express.json());
        this.listener.use(express.urlencoded({ extended: true }));
        this.listener.all('/*', (req, res) => {
            Interceptor.handle(req, res, this.db, this.args);
        });
        this.listener.listen(this.args['port'], () => {
            console.log(chalk.white('Listening for new requests'));
            console.log(chalk.cyan.bold.underline(`http://localhost:${this.args['port']}`));
            console.log('');
        });
        return this;
    }
    initDashboard() {
        this.dashboard.set('view engine', 'ejs');
        this.dashboard.set('views', join(dirname(fileURLToPath(import.meta.url)), '../lib/views'));
        this.dashboard.get('/', (req, res) => {
            var _a, _b;
            res.render('dashboard', {
                prettyMs: prettyMs,
                entries: (_b = (_a = this.db) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.entries.slice().sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
            });
        });
        if (this.args['dashboard'] !== false) {
            this.dashboard.listen(this.args['dashboard-port'], () => {
                console.log(chalk.white('View requests in the dashboard'));
                console.log(chalk.cyan.bold.underline(`http://localhost:${this.args['dashboard-port']}`));
                console.log('');
            });
        }
        return this;
    }
}
