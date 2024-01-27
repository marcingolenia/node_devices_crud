import { Device, CannotBeEmpty, ConnotBeFutureDate } from '../domain'
import { test, expect } from 'bun:test'
import { randomUUID } from 'crypto'
import { faker } from '@faker-js/faker'

test('Device name and brand cannot be empty', () => {
    expect(() => new Device(randomUUID(), "", "test", new Date()))
        .toThrow(new CannotBeEmpty("name"))
    expect(() => new Device(randomUUID(), "brand", "", new Date()))
        .toThrow(new CannotBeEmpty("brand"))
})

test('Device createdAt cannot be in future', () => {
    expect(() => new Device(randomUUID(), "test", "test", faker.date.future()))
        .toThrow(new ConnotBeFutureDate("createdAt"))
})
