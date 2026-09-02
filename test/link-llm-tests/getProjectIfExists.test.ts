import getProjectIfExists from "../../app/src/use-cases/add-llm/getProjectIfExists"
import assert from "node:assert"
import test from "node:test"
import { Project } from "../../app/src/entities/index"

test('passes true when project is returned from normalise-needed input', () =>{
    // pass in path to test route
    const path = 'test/test-proj-root'
    const project:Project | undefined = getProjectIfExists(path)
    assert.strictEqual(project instanceof Project, true)
})

test('passes true when project is returned from good input', () =>{
    // pass in path to test route
    const path = 'test/test-proj-root/dutoaocs.config.json'
    const project:Project | undefined = getProjectIfExists(path)
    assert.strictEqual(project instanceof Project, true)
})

test('passes when proejct is equal to undefined from bad input', () =>{
    // pass in path to test route
    const path = 'test/bad-path'
    const project:Project | undefined = getProjectIfExists(path)
    assert.strictEqual(project, undefined)
})
