import assert from "node:assert/strict"
import test from "node:test"
import getProjectName from "../../app/src/use-cases/init/getProjectName"
import { createReadlineMock } from "./testHelpers"

test("asks again when the project name is longer than 100 characters", async () => {
    const validProjectName = "valid-project-name"
    const rl = createReadlineMock(["a".repeat(101), validProjectName])

    const projectName = await getProjectName(rl)

    assert.strictEqual(projectName, validProjectName)
})

test("returns a project name no longer than 100 characters", async () => {
    const validProjectName = "Lorem ipsum dolor sit amet."
    const rl = createReadlineMock([validProjectName])

    const projectName = await getProjectName(rl)

    assert.strictEqual(projectName, validProjectName)
})
