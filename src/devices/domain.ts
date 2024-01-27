export class DeviceNotFound extends Error {
    constructor(id: string) {
        super(`Device not found id: ${id}`);
        this.name = DeviceNotFound.name
    }
}

export class CannotBeEmpty extends Error {
    constructor(propName: string) {
        super(` ${propName} Cannot be empty`);
        this.name = CannotBeEmpty.name
    }
}

export class Device {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly brand: string,
        public readonly createdAt: Date,
    ) { }
    rename(targetName: string): Device {
        if (!targetName) {
            throw new CannotBeEmpty("name")
        }
        return { ...this, name: targetName };
    }
    rebrand(targetBrand: string): Device {
        if (!targetBrand) {
            throw new CannotBeEmpty("brand")
        }
        return { ...this, brand: targetBrand };
    }
}