import test from "node:test"
import fs from "node:fs"
import assert = require("node:assert")

interface GetProjectDocsPathInput {
    userLocation:string
    
    existingDocsFolderPath:string
    docsPathQuestion:string
    createDocsFolderQuestion:string
    customDocsFolderAddress:string
}

interface ProjectDocsPathResponse {
    ok:boolean
    errorNumber?:number
    errorInfo?:string
}

// Origional function import:
// import getProjectDocsPath from "../../app/src/use-cases/index"
function testGetProjectDocsPath({
    userLocation,

    existingDocsFolderPath,
    docsPathQuestion,
    createDocsFolderQuestion,
    customDocsFolderAddress
}:GetProjectDocsPathInput):ProjectDocsPathResponse{
// const docsPathQuestion:string = (await rl.question("do you already have a '/docs' in this proeject? (y/n): ")).toLocaleLowerCase()
    if (["yes", "y"].includes(docsPathQuestion.toLocaleLowerCase())){
        // YES: I HAVE EXISTING '/docs'

        // normalize input so either the docs folder or its parent can be entered
        const normalizedDocsFolderPath:string = existingDocsFolderPath.endsWith("/docs")
            ? existingDocsFolderPath
            : existingDocsFolderPath + "/docs"

        if (fs.existsSync(normalizedDocsFolderPath)){
            return { "ok":true, "errorNumber":-1, "errorInfo":""}
        } else {
            return { "ok":false, "errorNumber":1, "errorInfo":"Custom '/docs' path does not exist. Please enter a valid path or make one"}
        }
    } else if (["no", "n"].includes(docsPathQuestion.toLocaleLowerCase())){
        // Quesiton: do you want to create a new '/docs' at your current path?
        
        if (["yes", "y"].includes(createDocsFolderQuestion.toLocaleLowerCase())){
            return { "ok":true, "errorNumber":-1, "errorInfo":""}

        } else if (["no", "n"].includes(createDocsFolderQuestion.toLocaleLowerCase())){
            // NO I WANT TO CREATE A NEW '/docs' AT A CUSTOM LOCATION

            // normalize input to check path exists
            if (customDocsFolderAddress.endsWith("/docs")){
                customDocsFolderAddress = customDocsFolderAddress.slice(0, -5)
            }

            if (fs.existsSync(customDocsFolderAddress)){
                return { "ok":true, "errorNumber":-1, "errorInfo":""} 
            } else {
                // 'else' here, as usually this would loop roud with while()
                return { "ok":false, "errorNumber":2, "errorInfo":`custom new '/docs' path: ${customDocsFolderAddress}, does not exist`}
            }
        } else {
            return { "ok":false, "errorNumber":3, "errorInfo":"poor input for yes/no conditional at question: 'do you want to create a new '/docs' in your current path'"}
        }
    } else {
        return { "ok":false, "errorNumber":4, "errorInfo":"poor input for yes/no conditional at question: 'do you have '/docs' already in the project'"}
    }
}

// NOTE: mock '/docs' at '[proj-root]/test/test-proj-root/docs'
test("passes when testGetProjectDocsPath() finds an existing '/docs' path", () => {
    const getDocsPathTestParams:GetProjectDocsPathInput = {
        "userLocation":"user-location-not-needed-in-test",
        "docsPathQuestion":"yes", // YES, I have an existing docs path
        "existingDocsFolderPath":"./test/test-proj-root/docs",
        
        "createDocsFolderQuestion":"no", // !should not be hit in this test! NO I would not like create a new folder at my current location
        "customDocsFolderAddress":"custom-folder-address", // !should not be hit!
    }

    const r:ProjectDocsPathResponse = testGetProjectDocsPath(getDocsPathTestParams)
    assert.strictEqual(r.ok, true)
    assert.strictEqual(r.errorNumber, -1)
})

test("passes when testGetProjectDocsPath() is given the parent of an existing '/docs' path", () => {
    const getDocsPathTestParams:GetProjectDocsPathInput = {
        "userLocation":"user-location-not-needed-in-test",
        "docsPathQuestion":"yes", // YES, I have an existing docs path
        "existingDocsFolderPath":"./test/test-proj-root",

        "createDocsFolderQuestion":"no", // !should not be hit in this test! NO I would not like create a new folder at my current location
        "customDocsFolderAddress":"custom-folder-address", // !should not be hit!
    }

    const r:ProjectDocsPathResponse = testGetProjectDocsPath(getDocsPathTestParams)
    assert.strictEqual(r.ok, true)
    assert.strictEqual(r.errorNumber, -1)
})

test("passes when testGetProjectDocsPath() creates '/docs' at the current user location", () => {
    const getDocsPathTestParams:GetProjectDocsPathInput = {
        "userLocation":"./test/test-proj-root",
        "docsPathQuestion":"no", // NO, I do not already have a docs path
        "existingDocsFolderPath":"existing-folder-path-not-needed-in-test", // !should not be hit!

        "createDocsFolderQuestion":"yes", // YES I would like create a new folder at my current location
        "customDocsFolderAddress":"custom-folder-address-not-needed-in-test", // !should not be hit!
    }

    const r:ProjectDocsPathResponse = testGetProjectDocsPath(getDocsPathTestParams)
    assert.strictEqual(r.ok, true)
    assert.strictEqual(r.errorNumber, -1)
})

test("passes when testGetProjectDocsPath() creates '/docs' at a custom parent path", () => {
    const getDocsPathTestParams:GetProjectDocsPathInput = {
        "userLocation":"user-location-not-needed-in-test",
        "docsPathQuestion":"no", // NO, I do not already have a docs path
        "existingDocsFolderPath":"existing-folder-path-not-needed-in-test", // !should not be hit!

        "createDocsFolderQuestion":"no", // NO I would not like create a new folder at my current location
        "customDocsFolderAddress":"./test/test-proj-root",
    }

    const r:ProjectDocsPathResponse = testGetProjectDocsPath(getDocsPathTestParams)
    assert.strictEqual(r.ok, true)
    assert.strictEqual(r.errorNumber, -1)
})

test("passes when testGetProjectDocsPath() is given a custom path ending in '/docs'", () => {
    const getDocsPathTestParams:GetProjectDocsPathInput = {
        "userLocation":"user-location-not-needed-in-test",
        "docsPathQuestion":"no", // NO, I do not already have a docs path
        "existingDocsFolderPath":"existing-folder-path-not-needed-in-test", // !should not be hit!

        "createDocsFolderQuestion":"no", // NO I would not like create a new folder at my current location
        "customDocsFolderAddress":"./test/test-proj-root/docs",
    }

    const r:ProjectDocsPathResponse = testGetProjectDocsPath(getDocsPathTestParams)
    assert.strictEqual(r.ok, true)
    assert.strictEqual(r.errorNumber, -1)
})
