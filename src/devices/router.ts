import { Hono } from 'hono'
import { DeviceDto, fromDomain, toDomain } from './dtos'
import { Device, DeviceNotFound, CannotBeEmpty, ConnotBeFutureDate } from './domain'

export type DevicesDeps = {
    readBy: (id: string) => Promise<Device>
    searchBy: (brandName: string) => Promise<Device[]>
    save: (device: Device) => Promise<void>
    delete: (id: string) => Promise<void>
}

export const routeDevices = (deps: DevicesDeps): Hono => {
    const devicesApi = new Hono()

    devicesApi.put('/', async ctx => {
        const dto: DeviceDto = await ctx.req.json()
        try {
            deps.save(toDomain(dto))
            ctx.header('Location', `${ctx.req.url}/${dto.id}`)
            return ctx.text('Created', 201)
        } catch (error) {
            if (error instanceof ConnotBeFutureDate) {
                return ctx.text(error.message, 400)
            }
            if (error instanceof CannotBeEmpty) {
                return ctx.text(error.message, 400)
            }
        }
        return ctx.json('Internal Server Error', 500);
    })

    devicesApi.options('/', async ctx => {
        return ctx.json(devicesApi.routes)
    })

    devicesApi.put('/:id/brand/:brand', async ctx => {
        const id = ctx.req.param('id')
        const brand = ctx.req.param('brand')
        try {
            const device = await deps.readBy(id)
            await deps.save(device.rebrand(brand))
            return ctx.text("OK", 200)
        } catch (error) {
            if (error instanceof DeviceNotFound) {
                return ctx.text(error.message, 404)
            }
            if (error instanceof CannotBeEmpty) {
                return ctx.text(error.message, 400)
            }
        }
        return ctx.json('Internal Server Error', 500);
    })

    devicesApi.put('/:id/name/:name', async ctx => {
        const id = ctx.req.param('id')
        const name = ctx.req.param('name')
        try {
            const device = await deps.readBy(id)
            await deps.save(device.rename(name))
            return ctx.text("OK", 200)
        } catch (error) {
            if (error instanceof DeviceNotFound) {
                return ctx.text(error.message, 404)
            }
            if (error instanceof CannotBeEmpty) {
                return ctx.text(error.message, 400)
            }
        }
        return ctx.json('Internal Server Error', 500);
    })

    devicesApi.get('/:id', async (ctx) => {
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

    devicesApi.delete('/:id', async (ctx) => {
        const id = ctx.req.param('id')
        await deps.delete(id)
        return ctx.body(null, 204)
    })

    devicesApi.get('/', async (ctx) => {
        const brandName = ctx.req.query('brand') ?? ''
        const filteredDevices = await deps.searchBy(brandName)
        return ctx.json((filteredDevices.map(fromDomain)), 200)
    })

    return devicesApi
}
