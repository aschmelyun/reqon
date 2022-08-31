import chalk from 'chalk'
import { join } from 'path'
import { Low, JSONFile } from 'lowdb'
import { homedir } from 'os'
import { existsSync, mkdirSync } from 'fs'

const log = console.log
const __dirname = join(homedir(), '.reqon')

if (!existsSync(__dirname)) {
    mkdirSync(__dirname)
}

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()
db.data ||= { entries: [] }

const output = (req, key, title) => {
    if (!req[key] || !Object.keys(req[key]).length) {
        return;
    }

    log('')
    log(chalk.cyan.bold('_________________________________'))
    log(chalk.cyan.bold(title))
    Object.keys(req[key]).forEach(item => {
        log(chalk.grey.bold(item + ': ') + chalk.white(req[key][item]))
    })
}

export default async (req, res) => {
    log('')
    log(chalk.white.bold.bgGreen(' ' + req.method + ' ') + ' ' + chalk.green.bold(req.originalUrl))

    let date = new Date()
    log(chalk.grey.bold(date.toLocaleString('en-US')))

    output(req, 'headers', 'HEADERS')
    output(req, 'query', 'URL QUERY')
    output(req, 'body', 'REQUEST BODY')
    
    log('')

    db.data.entries.push({
        headers: req.headers,
        query: req.query,
        body: req.body
    });
    await db.write();

    res.send('Receieved!')
}