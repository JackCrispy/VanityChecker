
const delay = ms => new Promise(res => setTimeout(res, ms));

const fs = require('fs')
const axios = require('axios')
const httpsProxyAgent = require('https-proxy-agent');
const chalk = require('chalk');
const proxy_check = require('proxy-check');
const config = require('./config.json')
const { Worker } = require("worker_threads");
const yesno = require('yesno');

let vanitys = []
let tempProxies = []
let finalProxies = []

const LoadVanityText = new Promise((resolve, reject) => {
    fs.readFile('vanitys.txt', function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        vanitys = array
        console.log(chalk.green.bold('---------------------\n'+'Loaded ' + array.length + ' vanitys.'+'\n---------------------'));
        resolve()
    });
});

const LoadProxies = new Promise((resolve, reject) => {
    fs.readFile('proxies.txt', function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        tempProxies = array
        console.log(chalk.green.bold('---------------------\n'+'Loaded ' + array.length + ' proxies.'+'\n---------------------'));
        resolve()
    });
});

LoadVanityText.then(LoadProxies, console.log)
LoadProxies.then(checkProxies, console.log)

async function checkProxies() {
    try {
        let goodProxies = 0, badProxies = 0
        for(let i = 0; i < tempProxies.length; i++) {
            let proxy = tempProxies[i]
            await delay(config.proxyCheckDelay)
            const proxyConfig = {
                host: proxy.split(':')[0].toString(),
                port: parseInt(proxy.split(':')[1]),
                };        
                proxy_check(proxyConfig).then(r => {
                    finalProxies.push(proxy)
                    goodProxies++
                }).catch(e => {
                    badProxies++
                });
                console.log('\033c' + chalk.magenta.bold('---------------------\n'+`Checking Proxies (${i}/${tempProxies.length})\nTimeout: ${config.proxyCheckDelay}`+'\n---------------------\n') + chalk.green.bold(goodProxies + ' good proxies\n') + chalk.red(badProxies + ' bad proxies.'))
                if (i == tempProxies.length - 1) {
                    console.log(chalk.green.bold('---------------------\n'+'Checked ' + tempProxies.length + ' proxies.'+'\n---------------------\n'))
                    console.log(chalk.green.bold('---------------------\n'+'Found ' + finalProxies.length + ' good proxies.'+'\n---------------------\n'))
                    fs.writeFile('Finalproxies.txt', finalProxies.join('\n'), function(err) {
                        if(err) {
                            return console.log(err);
                        }
                        console.log(chalk.green.bold('---------------------\n'+'Saved ' + finalProxies.length + ' good proxies.'+'\n---------------------\n'));                    
                        workersStart()
                    });
                }
        }
    } catch (error) {
        console.log(error)
    }
}

function chunkVanitys(array, size) {
    let result = []
    for (value of array){
        let lastArray = result[result.length -1 ]
        if(!lastArray || lastArray.length == size){
            result.push([value])
        } else{
            lastArray.push(value)
        }
    }
    return result
}

async function workersStart() {
    (function () {
        let workerAmount = vanitys.length / config.arrChunkSize
        let allVans = chunkVanitys(vanitys, config.arrChunkSize)
        console.log(chalk.magenta.bold('---------------------\n'+'Checking Vanitys'+`\nVanitys: ${vanitys.length} \\ Chunk Size: ${config.arrChunkSize} \\ Workers: ${workerAmount} \\ Vanitys Split: ${allVans.length} \\ Total Proxies: ${finalProxies.length}`+'\n---------------------\n'))
        for (let i = 0; i < workerAmount; i++) {
            new Worker("./checkVanity.js", {
            workerData: {
                vanitys: allVans[i],
                finalProxies: finalProxies
            }
        })
    }
})()
}
