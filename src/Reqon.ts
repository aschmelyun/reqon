import chalk from 'chalk'
import multer from 'multer'
import { homedir } from 'os'
import prettyMs from 'pretty-ms'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import Draw from './Actions/Draw.js'
import { Low, JSONFile } from 'lowdb'
import Entry from './Interfaces/Entry.js'
import { existsSync, mkdirSync } from 'fs'
import minimist, { ParsedArgs } from 'minimist'
import Interceptor from './Listeners/Interceptor.js'
import express, { Application, Request, Response } from 'express'

export default class Reqon {
    db: null|Low<{ entries: Entry[] }>
    args: ParsedArgs
    reqonDir: string
    listener: Application
    dashboard: Application

    /**
     * Initialize the main class and start the application
     */
    static run(): void {
        const reqon = new Reqon()
        reqon.setup()
            .then(() => {
                Draw.title()
                reqon.initListener()
                    .initDashboard()
            })
    }

    /**
     * Set up reqon's data directory, by default at ~/.reqon
     * Parse arguments from the command-line and set their defaults
     * Set up the main reqon listener and the dashboard web server
     * Initialize the adapter for LowDB, by default at ~/.reqon/db.json
     */
    constructor() {
        this.reqonDir = join(homedir(), '.reqon')
        if (!existsSync(this.reqonDir)) {
            mkdirSync(this.reqonDir)
        }

        this.args = minimist(process.argv.slice(2), {
            string: [
                'port',
                'dashboard-port',
                'save-max',
                'save-file',
                'help',
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
            },
            alias: {
                h: 'help'
            }
        })

        this.listener = express()
        this.dashboard = express()

        this.db = null
        if (this.args['save'] !== false) {
            const adapter = new JSONFile<{ entries: Entry[] }>(this.args['save-file'])
            this.db = new Low(adapter)
        }
    }

    /**
     * Configures the terminal window title
     * Sets up the database
     * Determines if the --help argument was passed
     * @returns Promise<Reqon>
     */
    async setup(): Promise<Reqon> {
        process.stdout.write(
            String.fromCharCode(27) + "]0;" + "reqon - listening" + String.fromCharCode(7)
        )

        if (this.db) {
            await this.db.read()
            this.db.data ||= { entries: [] }
        }

        if (this.args.hasOwnProperty('help') || this.args._.includes('help')) {
            Draw.title()
            Draw.help()
            process.exit()
        }

        return this
    }
    
    /**
     * Fires off the listener for the main reqon express webserver
     * Listens to any urls, using any http method, and passes everything to the interceptor handler
     * @returns Reqon
     */
    initListener(): Reqon {
        const upload = multer({ dest: join(this.reqonDir, 'files') })

        this.listener.use(express.json())
        this.listener.use(express.urlencoded({ extended: true }))

        this.listener.all('/*', upload.any(), (req: Request, res: Response) => {
            Interceptor.handle(req, res, this.db, this.args)
        })

        this.listener.listen(this.args['port'], () => {
            console.log(chalk.white.bold.bgCyan(' Listening ') + ' ' + chalk.white.underline(`http://localhost:${this.args['port']}`))
            console.log('')
        })

        return this
    }

    /**
     * Fires off the listener for the reqon dashboard webserver
     * Listens to just the main root url, and returns back a dashboard view
     * If the user passes in the --no-dashboard argument, don't boot up the listener
     * @returns Reqon
     */
    initDashboard(): Reqon {
        this.dashboard.set('view engine', 'ejs')
        this.dashboard.set('views', join(dirname(fileURLToPath(import.meta.url)), '../lib/Views'))
        this.dashboard.get('/', (req: Request, res: Response) => {
            res.render('dashboard', {
                prettyMs: prettyMs,
                entries: this.db?.data?.entries.slice().sort((a: Entry, b: Entry) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
            })
        })

        if (this.args['dashboard'] !== false) {
            this.dashboard.listen(this.args['dashboard-port'], () => {
                console.log(chalk.white.bold.bgCyan(' Dashboard ') + ' ' + chalk.white.underline(`http://localhost:${this.args['dashboard-port']}`))
                console.log('')
            })
        }

        return this
    }
}
