const delay = ms => new Promise(res => setTimeout(res, ms));

const axios = require('axios')
const chalk = require('chalk');
const config = require('./config.json')
const httpsProxyAgent = require('https-proxy-agent');
const workerData = require('worker_threads');
const fs = require('fs');

(async function () {
    try {
        let finalProxies = workerData.workerData.finalProxies
        let vanitys = workerData.workerData.vanitys
            for(let i = 0; i < vanitys.length; i++) {
                let proxy = finalProxies[Math.floor(Math.random() * finalProxies.length)];
                let vanity = vanitys[i]
                await delay(config.vanityCheckDelay)
                const agent = new httpsProxyAgent(`http://${proxy.split(':')[0]}:${parseInt(proxy.split(':')[1])}`);
                await axios.get(`http://discord.com/api/v9/invites/${vanity}`, {
                    httpsAgent: agent,
                    timeout: config.finalTimeoutAxios,
                }).then(res => {
                    fs.appendFile('taken.txt', vanity, (err) => { if (err) throw err; })
                    console.log(chalk.red.bold(`${vanity}`))
                }).catch(err => {
                    fs.appendFile('available.txt', vanity, (err) => { if (err) throw err; })
                    console.log(chalk.green.bold(`${vanity}`))
                })
    }
    } catch (error) {
        console.log(error)
    }
})()