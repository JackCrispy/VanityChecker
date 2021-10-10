# Discord Vanity Checker ⚡
Discord Vanity URL Checker. Uses Node workers and proxies to check vanity urls at a high speed.
___________


# Example 👀
![Example of code running](https://cdn.discordapp.com/attachments/576156209799757834/896237159139389490/nOcKTGYvyW.gif)


# Installation 🛠️
```bash
git clone https://github.com/JackCrispy/VanityChecker.git
npm install
npm run start
```
- Put your proxies in proxies.txt (https://proxyscrape.com/free-proxy-list)
- Make sure there is a vanitys.txt file, I already provide one which has over 3000+ possible vanity names.

# Results 🤖
The **taken** vanitys will go to a taken.txt file. Same with **avabilable** vanitys.
Once running the script, those .txt files will not erase, you need to erase them manually.

# Settings & Config 📘
The settings are automcatically applied based off of your vanity length and Array Chunk Size value in the config.json file.

Default Config:
```json
 "proxyCheckDelay": 25,
 "vanityCheckDelay": 1,
 "arrChunkSize": 150,
 "finalTimeoutAxios": 3500
``` 
### proxyCheckDelay
- The delay between the checks of each proxy. Lower = faster but you will not get as many proxys.

### vanityCheckDelay
- Delay between the workers checking each vanity. Leave it on 1

### arrChunkSize
- The amount of arrays that should be split up and given to workers. The lower you go the faster but more inaccurate it is. It uses more memory and CPU as well..
- I recommend you use 150 as it is fast but still accurate.

### finalTimeoutAxios
- The max time for a request to wait before cancelling it.

#### vanityTotal / arrayChunk = workerAmount
