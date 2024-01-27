import { Device } from './domain'

export type DeviceDto = {
    id: string
    name: string
    brand: string
    createdAt: string
}

export const toDomain = (dto: DeviceDto): Device =>
    new Device(dto.id, dto.name, dto.brand, new Date(dto.createdAt))

export const fromDomain = (domain: Device): DeviceDto =>
({
    id: domain.id,
    name: domain.name,
    brand: domain.brand,
    createdAt: domain.createdAt.toISOString()
})
