export class DeviceNotFound extends Error {
    constructor(id: string) {
        super(`Device not found id: ${id}`);
        this.name = DeviceNotFound.name
    }
}

export class CannotBeEmpty extends Error {
    constructor(propName: string) {
        super(`${propName} Cannot be empty`);
        this.name = CannotBeEmpty.name
    }
}

export class ConnotBeFutureDate extends Error {
    constructor(propName: string) {
        super(`${propName} cannot be in the future`);
        this.name = CannotBeEmpty.name
    }
}

export class Device {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly brand: string,
        public readonly createdAt: Date,
    ) {
        if (!name || name.trim() === "") throw new CannotBeEmpty("name")
        if (!brand || name.trim() === "") throw new CannotBeEmpty("brand")
        if (createdAt.getTime() > new Date().getTime()) throw new ConnotBeFutureDate("createdAt")
    }

    rename = (targetName: string) =>
        new Device(this.id, targetName, this.brand, this.createdAt)

    rebrand = (targetBrand: string) =>
        new Device(this.id, this.name, targetBrand, this.createdAt)
}