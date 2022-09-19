import chalk from 'chalk'
import { Low } from 'lowdb'
import { ParsedArgs } from 'minimist'
import Entry from '../Interfaces/Entry.js'
import { Request, Response, Express } from 'express'
import pb from 'pretty-bytes'

export default class Interceptor {

    /**
     * Handle responses coming from the main express webserver
     * Outputs headers, query, and request body variables to the terminal
     * Records those same attributes to a LowDB database
     * Returns back a simple JSON object and an alternate status code if requested
     * @param req 
     * @param res 
     * @param db 
     * @param args 
     */
    static async handle(req: Request, res: Response, db: null|Low<{ entries: Entry[] }>, args: ParsedArgs) {
        console.log('')
        console.log(chalk.white.bold.bgGreen(' ' + req.method + ' ') + ' ' + chalk.green.bold(req.originalUrl))

        let date = new Date()
        console.log(chalk.grey.bold(date.toLocaleString('en-US')))

        Interceptor.output(req, 'headers', 'HEADERS')
        Interceptor.output(req, 'query', 'URL QUERY')
        Interceptor.output(req, 'body', 'REQUEST BODY')
        Interceptor.files(req)
        
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

        res.status(Interceptor.status(req)).json({ message: "received" })
    }

    /**
     * Helper method used in handle() to format and output request attributes to the terminal
     * Separates each section by a line, adds a header, and dumps out each attribute's variables
     * @param req 
     * @param key 
     * @param title 
     * @returns 
     */
    static output(req: Request, key: "headers" | "query" | "body", title: string): void {
        if (!req[key] || !Object.keys(req[key]).length) {
            return
        }
    
        console.log('')
        console.log(chalk.cyan.bold('_________________________________'))
        console.log(chalk.cyan.bold(title))
        Object.keys(req[key]).forEach(item => {
            console.log(chalk.grey.bold(item + ': ') + chalk.white(JSON.stringify(req[key][item], null, 2)))
        })
    }

    static files(req: Request): void {
        if (!req['files']) {
            return
        }
        
        console.log('')
        console.log(chalk.cyan.bold('_________________________________'))
        console.log(chalk.cyan.bold('FILES'))
        
        if (req.files.constructor === Array) {
            req.files.forEach((file: Express.Multer.File) => {
                console.log(chalk.grey.bold(file.fieldname + ': ') + chalk.white(file.originalname + ' [' + pb(file.size) + ']'))
            })
        }
    }

    /**
     * Helper function used in handle() to determine if there's a custom status requested
     * If reqon-status is present in a header or query variable,
     * And that status is one of the ones specified below,
     * Return that status code with the response back
     * @param req 
     * @returns 
     */
    static status(req: Request): number {
        let statuses = [200, 204, 301, 302, 304, 307, 308, 400, 401, 403, 404, 408, 410, 429, 500, 502, 503, 504]

        if (Object.keys(req.headers).includes('reqon-status')) {
            let status = req.headers['reqon-status'] ?? '200'
                status = Array.isArray(status) ? status.join('') : status

            if (statuses.includes(parseInt(status))) {
                return parseInt(status)
            }
        }

        if (Object.keys(req.query).includes('reqon-status')) {
            let status = req.query['reqon-status'] ?? '200'
                status = Array.isArray(status) ? status.join('').toString() : status.toString()
                
            if (statuses.includes(parseInt(status))) {
                return parseInt(status)
            }
        }

        return 200
    }
}