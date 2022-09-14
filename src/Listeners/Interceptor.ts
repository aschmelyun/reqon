import chalk from "chalk"
import { Request, Response } from "express"
import { Low } from "lowdb"
import { ParsedArgs } from "minimist"
import Entry from '../Interfaces/Entry.js'

export default class Interceptor {
    static async handle(req: Request, res: Response, db: null|Low<{ entries: Entry[] }>, args: ParsedArgs) {
        console.log('')
        console.log(chalk.white.bold.bgGreen(' ' + req.method + ' ') + ' ' + chalk.green.bold(req.originalUrl))

        let date = new Date()
        console.log(chalk.grey.bold(date.toLocaleString('en-US')))

        Interceptor.output(req, 'headers', 'HEADERS')
        Interceptor.output(req, 'query', 'URL QUERY')
        Interceptor.output(req, 'body', 'REQUEST BODY')
        
        console.log('')

        if (db) {
            db?.data?.entries.push({
                method: req.method,
                url: req.originalUrl,
                date: date.toLocaleString('en-US'),
                headers: req.headers,
                query: req.query,
                body: req.body
            })

            if (db?.data?.entries.length && db?.data?.entries.length > args['save-max']) {
                db?.data?.entries.splice(0, 1)
            } 

            await db.write()
        }

        res.send('Receieved!')
    }
    static output(req: Request, key: "headers" | "query" | "body", title: string) {
        if (!req[key] || !Object.keys(req[key]).length) {
            return
        }
    
        console.log('')
        console.log(chalk.cyan.bold('_________________________________'))
        console.log(chalk.cyan.bold(title))
        Object.keys(req[key]).forEach(item => {
            console.log(chalk.grey.bold(item + ': ') + chalk.white(JSON.stringify(req[key][item])))
        })
    }
}