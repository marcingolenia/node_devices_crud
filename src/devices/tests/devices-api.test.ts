import { test, expect } from 'bun:test'
import api from '../../index'
import { DeviceDto } from '../dtos'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

const someDevice = (overrides?: Partial<DeviceDto>): DeviceDto => ({
    id: overrides?.id ?? randomUUID(),
    name: overrides?.name ?? faker.animal.type(),
    brand: overrides?.brand ?? faker.company.name(),
    createdAt: overrides?.createdAt ?? faker.date
        .between({ from: '2020-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' })
        .toISOString()
})

test('/devices [PUT] creates a device which can be retrieved from location header', async () => {
    // Arrange
    const deviceDto = someDevice();
    // Act
    const res = await api.request('/devices', {
        method: 'PUT',
        body: JSON.stringify(deviceDto)
    })
    // Assert
    let ressourceLocation = res.headers.get('Location') as string
    const resp = await api.request(ressourceLocation, { method: 'GET' })
    expect(await resp.json()).toEqual(deviceDto)
})

test('/devices [PUT] with future cratedAt date returns 400 with proper message', async () => {
    // Arrange
    const deviceDto = someDevice({ createdAt: faker.date.future().toISOString() })
    // Act
    const res = await api.request('/devices', {
        method: 'PUT',
        body: JSON.stringify(deviceDto)
    })
    // Assert
    expect(res.status).toBe(400)
    expect(await res.text()).toBe("createdAt cannot be in the future")
})

test('/devices [PUT] with empty name returns 400 with proper message', async () => {
    // Arrange
    const deviceDto = someDevice({ name: '' })
    // Act
    const res = await api.request('/devices', {
        method: 'PUT',
        body: JSON.stringify(deviceDto)
    })
    // Assert
    expect(res.status).toBe(400)
    expect(await res.text()).toBe("name Cannot be empty")
})

test('/devices [PUT] with empty brand returns 400 with proper message', async () => {
    // Arrange
    const deviceDto = someDevice({ brand: '' })
    // Act
    const res = await api.request('/devices', {
        method: 'PUT',
        body: JSON.stringify(deviceDto)
    })
    // Assert
    expect(res.status).toBe(400)
    expect(await res.text()).toBe("brand Cannot be empty")
})

test('/devices/:id [GET] return 404 when device does not exists', async () => {
    // Arrange
    const deviceId = randomUUID();
    // Act
    const resp = await api.request(`/devices/${deviceId}`, { method: 'GET' })
    expect(await resp.text()).toBe(`Device not found id: ${deviceId}`)
    expect(resp.status).toBe(404)
})

test('/devices/search?brand={brand} returns devices of brand that includes the keyword', async () => {
    // Arrange
    const brand = faker.company.name()
    const devices: DeviceDto[] = [...Array(5).keys()].map(_ => someDevice({ brand }))
    // Act
    await Promise.all(
        devices.map(
            device => api.request('/devices', { method: 'PUT', body: JSON.stringify(device) })
        )
    )
    // Assert
    const resp = await api.request(`/devices/search?brand=${devices[0].brand}`, { method: 'GET' })
    expect(resp.status).toBe(200)
    expect(await resp.json()).toStrictEqual(devices)
})

test('/devices [DELETE] deletes a device', async () => {
    // Arrange
    const deviceDto = someDevice()
    await api.request('/devices', {
        method: 'PUT',
        body: JSON.stringify(deviceDto)
    })
    // Act
    const deleteResponse = await api.request(`/devices/${deviceDto.id}`, {
        method: 'DELETE',
    })
    // Assert
    expect(deleteResponse.status).toBe(200)
    const resp = await api.request(`/devices`, { method: 'GET' })
    expect(await resp.json()).not.toContainEqual(deviceDto)
})

test('/devices/:id/name/:name [PUT] updates device name', async () => {
    // Arrange
    const deviceDto = someDevice()
    const newName = faker.animal.type() + "_modified"
    await api.request('/devices', {
        method: 'PUT',
        body: JSON.stringify(deviceDto)
    })
    // Act
    await api.request(`/devices/${deviceDto.id}/name/${newName}`, {
        method: 'PUT',
    })
    // Assert
    const resp = await api.request(`/devices/${deviceDto.id}`, { method: 'GET' })
    expect(await resp.json()).toStrictEqual({ ...deviceDto, name: newName })
})

test('/devices/:id/brand/:brand [PUT] updates device name', async () => {
    // Arrange
    const deviceDto = someDevice()
    const newbrand = faker.company.name()
    await api.request('/devices', {
        method: 'PUT',
        body: JSON.stringify(deviceDto)
    })
    // Act
    await api.request(`/devices/${deviceDto.id}/brand/${newbrand}`, {
        method: 'PUT',
    })
    // Assert
    const resp = await api.request(`/devices/${deviceDto.id}`, { method: 'GET' })
    expect(await resp.json()).toStrictEqual({ ...deviceDto, brand: newbrand })
})