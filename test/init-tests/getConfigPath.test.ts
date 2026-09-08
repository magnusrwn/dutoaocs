import test from "node:test"
import assert from "node:assert"
import fs from "node:fs"
import path from "node:path"
import readline from "node:readline/promises"
import getProjectConfigPath from "../../app/src/use-cases/init/getProjectConfigPath"

function createReadlineMock(answers:string[]):readline.Interface {
    return {
        question: async () => {
            const answer = answers.shift()
            if (answer === undefined){
                throw new Error("No test answer available")
            }
            return answer
        }
    } as readline.Interface
}

// NOTE: I've created a file called 'dutoaocs.config.json' in '/test/test-proj-root'
// these are relative to proj root. The user **should** be running/ have the config file in the root...
// so the 'customConfigPath' and the 'userLocation' are the same here
test('passes when config path (userLocation) is found, and correct', async () => {
    const userLocation = path.join(".", "test", "test-proj-root")
    const rl = createReadlineMock(["yes"])

    const respUserLocation:string = await getProjectConfigPath(userLocation, rl)

    assert.equal(typeof respUserLocation, 'string');
    assert.strictEqual(respUserLocation, path.join(userLocation, "dutoaocs.config.json"))
})

test('passes when config path (customConfigPath) is found, and has good ending ', async () => {
    const customConfigPath = path.join(".", "test", "test-proj-root")
    const rl = createReadlineMock(["no", customConfigPath])

    const respUserLocation:string = await getProjectConfigPath("unused-user-location", rl)

    assert.equal(typeof respUserLocation, 'string');
    assert.strictEqual(respUserLocation, path.join(customConfigPath, "dutoaocs.config.json"))
})

test("does not join current location and config filename without a path separator", async () => {
    const userLocation = path.join(".", "test", "test-proj-root")
    const rl = createReadlineMock(["y"])

    const respUserLocation:string = await getProjectConfigPath(userLocation, rl)

    assert.notStrictEqual(respUserLocation, `${userLocation}dutoaocs.config.json`)
    assert.strictEqual(fs.existsSync(path.dirname(respUserLocation)), true)
})
