const getRandom = () => {
    let randomValue = ""
    for (let index = 0; index < 4; index++) {
        const random = Math.floor(Math.random() * 9)
        randomValue += String(random)
    }
    return randomValue
}
const newFunction = () =>{

}
module.exports = {getRandom, newFunction}

// const allExport = {getRandom}