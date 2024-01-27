import { test, expect } from 'bun:test'
import api from '../src/index'
import { DeviceDto } from '../src/devices/dtos'
import { faker, ne } from '@faker-js/faker'
import { randomUUID } from 'crypto'

test('/devices [PUT] creates a device which can be retrieved from location header', async () => {
    // Arrange
    const deviceDto: DeviceDto = {
        id: randomUUID(),
        name: faker.animal.type(),
        brand: faker.company.name(),
        createdAt: faker.date
            .between({ from: '2020-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' })
            .toISOString()
    }
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
    let devices: DeviceDto[] = [...Array(5).keys()].map(_ => ({
        id: randomUUID(),
        name: faker.animal.type(),
        brand: brand,
        createdAt: faker.date
            .between({ from: '2020-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' })
            .toISOString()
    }))
    // Act
    await Promise.all(
        devices.map(
            device => api.request('/devices', { method: 'PUT', body: JSON.stringify(device) })
        )
    )
    // Assert
    const resp = await api.request(`/devices/search?brand=${brand}`, { method: 'GET' })
    expect(resp.status).toBe(200)
    expect(await resp.json()).toStrictEqual(devices)
})

test('/devices [DELETE] deletes a device', async () => {
    // Arrange
    const deviceDto: DeviceDto = {
        id: randomUUID(),
        name: faker.animal.type(),
        brand: faker.company.name(),
        createdAt: faker.date
            .between({ from: '2020-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' })
            .toISOString()
    }
    await api.request('/devices', {
        method: 'PUT',
        body: JSON.stringify(deviceDto)
    })
    // Act
    await api.request(`/devices/${deviceDto.id}`, {
        method: 'DELETE',
    })
    // Assert
    const resp = await api.request(`/devices`, { method: 'GET' })
    expect(await resp.json()).not.toContainEqual(deviceDto)
})

test('/devices/:id/name/:name [PUT] updates device name', async () => {
    // Arrange
    const deviceDto: DeviceDto = {
        id: randomUUID(),
        name: faker.animal.type(),
        brand: faker.company.name(),
        createdAt: faker.date
            .between({ from: '2020-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' })
            .toISOString()
    }
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
    const deviceDto: DeviceDto = {
        id: randomUUID(),
        name: faker.animal.type(),
        brand: faker.company.name(),
        createdAt: faker.date
            .between({ from: '2020-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' })
            .toISOString()
    }
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