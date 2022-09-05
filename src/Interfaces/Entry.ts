export default interface Entry {
    method: string,
    url: string,
    date: string,
    headers: object,
    query: object,
    body: object
}