import chalk from 'chalk'

const log = console.log
const output = (req, key, title) => {
    if (!req[key] || !Object.keys(req[key]).length) {
        return
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
    })
    await db.write()

    res.send('Receieved!')
}