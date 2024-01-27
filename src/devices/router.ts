import { Hono } from 'hono'
import { DeviceDto, fromDomain, toDomain } from './dtos'
import { Device, DeviceNotFound, CannotBeEmpty } from './domain'

export type DevicesDeps = {
    readBy: (id: string) => Promise<Device>
    searchBy: (brandName: string) => Promise<Device[]>
    save: (device: Device) => Promise<void>
    list: () => Promise<Device[]>
    delete: (id: string) => Promise<void>
}

export const routeDevices = (deps: DevicesDeps): Hono => {
    const devices = new Hono()

    devices.put('/', async ctx => {
        const dto: DeviceDto = await ctx.req.json()
        deps.save(toDomain(dto))
        ctx.header('Location', `${ctx.req.url}/${dto.id}`)
        return ctx.text('Created', 201)
    })

    devices.put('/:id/brand/:brand', async ctx => {
        const id = ctx.req.param('id')
        const brand = ctx.req.param('brand')
        try {
            const device = await deps.readBy(id)
            await deps.save(device.rebrand(brand))
            return ctx.status(200)
        } catch (error) {
            if (error instanceof DeviceNotFound || error instanceof CannotBeEmpty) {
                return ctx.text(error.message, 404)
            }
        }
        return ctx.json('Internal Server Error', 500);
    })

    devices.put('/:id/name/:name', async ctx => {
        const id = ctx.req.param('id')
        const name = ctx.req.param('name')
        try {
            const device = await deps.readBy(id)
            await deps.save(device.rename(name))
            return ctx.status(200)
        } catch (error) {
            if (error instanceof DeviceNotFound || error instanceof CannotBeEmpty) {
                return ctx.text(error.message, 404)
            }
        }
        return ctx.json('Internal Server Error', 500);
    })

    devices.get('/search', async (ctx) => {
        const brandName = ctx.req.query('brand') ?? ''
        const filteredDevices = await deps.searchBy(brandName)
        return ctx.json((filteredDevices.map(fromDomain)), 200)
    })

    devices.get('/:id', async (ctx) => {
        const id = ctx.req.param('id')
        try {
            const device = await deps.readBy(id)
            return ctx.json((fromDomain(device)), 200)
        } catch (error) {
            if (error instanceof DeviceNotFound) {
                return ctx.text(error.message, 404)
            }
        }
        return ctx.json('Internal Server Error', 500);
    })

    devices.delete('/:id', async (ctx) => {
        const id = ctx.req.param('id')
        await deps.delete(id)
    })

    devices.get('/', async (ctx) => ctx.json(await deps.list(), 200))

    return devices
}
