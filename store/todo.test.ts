import {setActivePinia, createPinia} from 'pinia'
import {describe, test, expect, beforeAll, beforeEach, afterEach} from "vitest";
import {useTodoStore} from "./todo";
import {use} from "h3";

beforeAll(() => {
    setActivePinia(createPinia())
})

describe('useTodoStore', () => {
    let store: ReturnType<typeof useTodoStore>

    beforeEach(()=> {
        store = useTodoStore()
    })

    afterEach(()=> {
        store.$reset()
    })

    test('creates a store', () => {
        const store = useTodoStore()
        expect(store).toBeDefined()
    })

    test('initializes with empty items', () => {
        expect(store.items).toStrictEqual([])
    })

    test('create a todo', () => {
        store.add({title: 'Test my code!'})
        expect(store.items[0]).toBeDefined()
        expect(store.items[0].title).toBe('Test my code!')
    })

    test('gets by id', () => {
        store.add({title: 'Test'});
        const item = store.items[0]
        const todo = store.getById(item.id)
        expect(todo).toStrictEqual(item)
    })

    test('gets ordered todos without mutating state', () => {
        const items = [
            {
                createdAt: new Date(2020, 2, 14)
            },
            {
                createdAt: new Date(2019, 1, 14)
            },
            {
                createdAt: new Date(2021, 3, 14)
            },
            {
                createdAt: new Date(2023, 10, 15)
            },
        ]
        //@ts-ignore
        store.items = items
        const orderedTodos = store.getOrderedTodos
        expect(orderedTodos[0].createdAt.getFullYear()).toBe(2019);
        expect(orderedTodos[1].createdAt.getFullYear()).toBe(2020);
        expect(orderedTodos[2].createdAt.getFullYear()).toBe(2021);
        expect(orderedTodos[3].createdAt.getFullYear()).toBe(2023);
        expect(store.items[0].createdAt.getFullYear()).toBe(2020);
    })

    test('removes a todo', () => {
        store.add({title: 'Test my code!'})
        const todo = store.items[0]
        store.remove(todo.id)
        expect(store.items).toStrictEqual([])
    })

    test('updates a todo status', () => {
        store.add({title: 'Test my code!'})
        const todo = store.items[0]
        store.update(todo.id, {done: true})
        const updated = store.items[0]
        expect(updated.done).toBe(true)
    })

    test('updates a todo title', () => {
        store.add({title: 'Test my code!'})
        const todo = store.items[0]
        store.update(todo.id, {title: 'Test update'})
        const updated = store.items[0]
        expect(updated.title).toBe('Test update')
    })
})
