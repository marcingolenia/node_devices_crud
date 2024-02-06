import { Hono } from 'hono'
import { routeDevices } from './devices/router'
import { ReadBy, Save, SearchBy, Delete } from "./devices/repository"

const app = new Hono()
app.get('/', c => c.text('Hello!'))
app.route('/devices', routeDevices({
    readBy: ReadBy,
    save: Save,
    searchBy: SearchBy,
    delete: Delete,
}))
app.notFound(ctx => ctx.text(`${ctx.req.path} doesn't exist! 👻`, 404))
export default app
