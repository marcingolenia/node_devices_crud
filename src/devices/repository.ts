import { Device, DeviceNotFound } from './domain'

const inMemoryDb = new Map<string, Device>()

export const Save = async (device: Device): Promise<void> => {
    inMemoryDb.set(device.id, device)
}

export const ReadBy = async (id: string): Promise<Device> => {
    const device = inMemoryDb.get(id)
    return device ? device : Promise.reject(new DeviceNotFound(id))
}

export const List = async (): Promise<Device[]> =>
    [...inMemoryDb.values()]

export const SearchBy = async (brandName: string): Promise<Device[]> =>
        [...inMemoryDb.values()]
        .filter(device => device.brand.includes(brandName))

export const Delete = async (id: string): Promise<void> => {
    inMemoryDb.delete(id)
}