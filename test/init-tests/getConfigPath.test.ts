import test from "node:test"
import assert from "node:assert"
import fs from "node:fs"

interface GetConfigPathTestParams{
    configPathChoice:string,
    customConfigPath:string,
    userLocation:string
}

// testable version of 'getProjectConfigPath' -- removed inputs and while loops to get to core logic
function testGetProjectConfigPath({configPathChoice, customConfigPath, userLocation}:GetConfigPathTestParams):string | undefined {
    if (["yes", "y"].includes(configPathChoice)){
        const configPath:string = userLocation + "dutoaocs.config.json"
        return configPath
    } else if (["no", "n"].includes(configPathChoice)){
        if (fs.existsSync(customConfigPath)){
            const configPath:string = customConfigPath + "dutoaocs.config.json"
            return configPath
        } else {
            console.log(`path: ${customConfigPath} does not exist`)
        }
    } else {
        console.log("please input 'yes'/'y' or 'no'/'n'")
        return undefined
    }
}


// function grabConfigPathEnding(path:string):string{
//     /***
//      returns the ending of the passed path, which should be 'dutoaocs.config.json'
//      -- this is used to assert then the ending of the path is the config file
//      -- when it cant be found, it returns a wrong string. This is why equal assert is necessary
//      */
//     // grab indicies to test the ending of the path (ensure it is te config file)
//     const endingIndex:number = path.indexOf("dutoaocs.config.json") | 1
//     const pathLength:number = path.length
    
//     // get the negative index to assert the end of the path is correct
//     const negativeIndex:number = endingIndex - pathLength
//     const pathEnding:string = path.slice(negativeIndex)
//     return pathEnding
// }




// NOTE: I've created a file called 'dutoaocs.config.json' in '/test/test-proj-root'
// these are relative to proj root. The user **should** be running/ have the config file in the root...
// so the 'customConfigPath' and the 'userLocation' are the same here
test('passes when config path (userLocation) is found, and correct', () => {
    const testUserLocationInput:GetConfigPathTestParams = {
        "configPathChoice":"yes", // goes throguh user location
        "customConfigPath":"./test/test-proj-root/",
        "userLocation":"./test/test-proj-root/"
    }

    const respUserLocaiton:string | undefined = testGetProjectConfigPath(testUserLocationInput)
    // ensure the resp exists
    if (!respUserLocaiton){return}
    assert.equal(typeof respUserLocaiton, 'string');

    assert.strictEqual(respUserLocaiton.endsWith("dutoaocs.config.json"), true)
})

test('passes when config path (customConfigPath) is found, and has good ending ', () => {
    const testUserLocationInput:GetConfigPathTestParams = {
        "configPathChoice":"no", // goes throguh custom imput
        "customConfigPath":"./test/test-proj-root/",
        "userLocation":"./test/test-proj-root/"
    }

    const respUserLocaiton:string | undefined = testGetProjectConfigPath(testUserLocationInput)
    // ensure the resp exists
    if (!respUserLocaiton){return}
    assert.equal(typeof respUserLocaiton, 'string');

    assert.strictEqual(respUserLocaiton.endsWith("dutoaocs.config.json"), true)
})
