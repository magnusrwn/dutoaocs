import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import getProjectConfigPath from "../../app/src/use-cases/init/getProjectConfigPath"
import { createMockProject, createReadlineMock } from "./testHelpers"

test("returns a config path at the user's current location", async (t) => {
    const { projectPath } = createMockProject(t)
    const rl = createReadlineMock(["yes"])

    const configPath = await getProjectConfigPath(projectPath, rl)

    assert.strictEqual(configPath, path.join(projectPath, "dutoaocs.config.json"))
})

test("returns a config path at an existing custom location", async (t) => {
    const { projectPath } = createMockProject(t)
    const rl = createReadlineMock(["no", projectPath])

    const configPath = await getProjectConfigPath("unused-user-location", rl)

    assert.strictEqual(configPath, path.join(projectPath, "dutoaocs.config.json"))
})

test("joins the current location and config filename with a path separator", async (t) => {
    const { projectPath } = createMockProject(t)
    const rl = createReadlineMock(["y"])

    const configPath = await getProjectConfigPath(projectPath, rl)

    assert.notStrictEqual(configPath, `${projectPath}dutoaocs.config.json`)
    assert.strictEqual(fs.existsSync(path.dirname(configPath)), true)
})
