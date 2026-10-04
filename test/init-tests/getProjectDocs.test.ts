import assert from "node:assert/strict"
import test from "node:test"
import getProjectDocsPath from "../../app/src/use-cases/init/getProjectDocsPath"
import { createMockProject, createReadlineMock } from "./testHelpers"

test("returns an existing docs folder", async (t) => {
    const { docsPath } = createMockProject(t)
    const rl = createReadlineMock(["yes", docsPath])

    const result = await getProjectDocsPath("unused-user-location", rl)

    assert.strictEqual(result, docsPath)
})

test("accepts the parent of an existing docs folder", async (t) => {
    const { projectPath, docsPath } = createMockProject(t)
    const rl = createReadlineMock(["yes", projectPath])

    const result = await getProjectDocsPath("unused-user-location", rl)

    assert.strictEqual(result, docsPath)
})

test("treats a blank existing docs path as the current location", async (t) => {
    const { projectPath, docsPath } = createMockProject(t)
    const rl = createReadlineMock(["yes", ""])

    const result = await getProjectDocsPath(projectPath, rl)

    assert.strictEqual(result, docsPath)
})

test("returns a docs path at the current user location", async (t) => {
    const { projectPath, docsPath } = createMockProject(t)
    const rl = createReadlineMock(["no", "yes"])

    const result = await getProjectDocsPath(projectPath, rl)

    assert.strictEqual(result, docsPath)
})

test("returns a docs path at a custom parent location", async (t) => {
    const { projectPath, docsPath } = createMockProject(t)
    const rl = createReadlineMock(["no", "no", projectPath])

    const result = await getProjectDocsPath("unused-user-location", rl)

    assert.strictEqual(result, docsPath)
})

test("accepts a custom path ending in docs", async (t) => {
    const { docsPath } = createMockProject(t)
    const rl = createReadlineMock(["no", "no", docsPath])

    const result = await getProjectDocsPath("unused-user-location", rl)

    assert.strictEqual(result, docsPath)
})
