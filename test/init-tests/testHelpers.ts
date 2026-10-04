import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import readline from "node:readline/promises"
import type { TestContext } from "node:test"

export function createReadlineMock(answers: string[]): readline.Interface {
    return {
        question: async () => {
            const answer = answers.shift()

            if (answer === undefined) {
                throw new Error("No test answer available")
            }

            return answer
        },
    } as unknown as readline.Interface
}

export function createMockProject(t: TestContext): {
    projectPath: string
    docsPath: string
} {
    const projectPath = fs.mkdtempSync(path.join(os.tmpdir(), "dutoaocs-init-"))
    const docsPath = path.join(projectPath, "docs")

    fs.mkdirSync(docsPath)
    t.after(() => fs.rmSync(projectPath, { recursive: true, force: true }))

    return { projectPath, docsPath }
}
