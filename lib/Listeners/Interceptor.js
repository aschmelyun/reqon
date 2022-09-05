var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
export default class Interceptor {
    static handle(req, res, db, args) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('');
            console.log(chalk.white.bold.bgGreen(' ' + req.method + ' ') + ' ' + chalk.green.bold(req.originalUrl));
            let date = new Date();
            console.log(chalk.grey.bold(date.toLocaleString('en-US')));
            Interceptor.output(req, 'headers', 'HEADERS');
            Interceptor.output(req, 'query', 'URL QUERY');
            Interceptor.output(req, 'body', 'REQUEST BODY');
            console.log('');
            if (db) {
                (_a = db === null || db === void 0 ? void 0 : db.data) === null || _a === void 0 ? void 0 : _a.entries.push({
                    method: req.method,
                    url: req.originalUrl,
                    date: date.toLocaleString('en-US'),
                    headers: req.headers,
                    query: req.query,
                    body: req.body
                });
                if (((_b = db === null || db === void 0 ? void 0 : db.data) === null || _b === void 0 ? void 0 : _b.entries.length) && ((_c = db === null || db === void 0 ? void 0 : db.data) === null || _c === void 0 ? void 0 : _c.entries.length) > args['save-max']) {
                    (_d = db === null || db === void 0 ? void 0 : db.data) === null || _d === void 0 ? void 0 : _d.entries.splice(0, 1);
                }
                yield db.write();
            }
            res.send('Receieved!');
        });
    }
    static output(req, key, title) {
        if (!req[key] || !Object.keys(req[key]).length) {
            return;
        }
        console.log('');
        console.log(chalk.cyan.bold('_________________________________'));
        console.log(chalk.cyan.bold(title));
        Object.keys(req[key]).forEach(item => {
            console.log(chalk.grey.bold(item + ': ') + chalk.white(req[key][item]));
        });
    }
}
