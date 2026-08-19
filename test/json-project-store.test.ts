import JsonProjectStore from '../app/src/infrastructure/json-project-store'
import assert from 'node:assert'
import test from 'node:test'


test('returns false when file does not exist at given path', () => {
    const store = new JsonProjectStore("bad-path")
    assert.strictEqual(store.exists(), false)
})
