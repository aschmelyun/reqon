import { Express } from 'express'

export default interface Entry {
    method: string,
    url: string,
    date: string,
    headers: object,
    query: object,
    body: object,
    files: Express.Multer.File[]
}