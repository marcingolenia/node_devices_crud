import { test, expect } from 'bun:test';
import api from '../src/index'

test('api request says hello', async () => {
    const res = await api.request('/', {
        method: 'GET',
    })
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello!')
})

test('not exsiting path returns path with info that the path does not exist', async () => {
    const res = await api.request('/notexists', {
        method: 'GET',
    })
    expect(res.status).toBe(404)
    expect(await res.text()).toBe(`/notexists doesn't exist! 👻`)
})