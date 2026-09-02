import test from 'node:test'
import assert from "node:assert"
import JsonProjectStore from '../../app/src/infrastructure/json-project-store'

test('passes when file does not exist at given path', () => {
    const store = new JsonProjectStore("bad-path")
    assert.strictEqual(store.exists(), false)
})
