import test from "node:test"
import assert from "node:assert"
import readline from "node:readline/promises"
import { stdin as input, stdout as output } from 'node:process';

// Origional function import:
// import getProjectName from "../../app/src/use-cases/index"
function testGetProjectName(rl:readline.Interface, projectName:string):boolean{
    if (projectName.length > 100){
        return false
    } else {
        return true
    }
}

const rl:readline.Interface = readline.createInterface({input, output})


test('passes when input is > 100 chars and functions returns false', () => {
    const testProjectNameError:string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore extra-chars-were needed here."
    const rErr:boolean = testGetProjectName(rl, testProjectNameError)

    assert.strictEqual(rErr, false)
    
})

test("passes when input is <= 100 and function returns true", ()=>{
    const testProjectNamePass:string = "Lorem ipsum dolor sit amet."
    const rPass:boolean = testGetProjectName(rl, testProjectNamePass)

    assert.strictEqual(rPass, true)
})

rl.close()