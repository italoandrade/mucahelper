const rp = require('request-promise');
const express = require('express');
const cluster = require('cluster');
const fs = require('fs');
const compression = require('compression');
const os = require("os");
require('jsdom-global')();

const port = 3222;

const users = [];

function loadServer() {
    const app = express();
    const io = require('socket.io')(3223);

    io.on('connection', function (socket) {
        setInterval(async () => {
            await updateUsersInfo();
            // console.log(users);
            await verifyReset();
            await verifyDead();
            socket.emit('updateUsersInfo', users);
        }, 3000);

        async function verifyReset() {
            users.forEach(user => {
                if (!user.reseted) {
                    let reseted;

                    switch (user.name) {
                        case 'Zortrax':
                        case 'Adrik':
                            reseted = (user.resets <= 15 && user.level >= 300)
                                || (user.resets <= 25 && user.level >= 325)
                                || (user.resets <= 55 && user.level >= 350)
                                || (user.resets <= 170 && user.level >= 375)
                                || (user.resets <= 250 && user.level >= 400);
                            break;
                        case 'Manndy':
                            reseted = (user.resets <= 5 && user.level >= 300)
                                || (user.resets <= 10 && user.level >= 325)
                                || (user.resets <= 50 && user.level >= 350)
                                || (user.resets <= 100 && user.level >= 375)
                                || (user.resets <= 250 && user.level >= 400);
                            break;
                        default:
                            reseted = (user.resets <= 3 && user.level >= 300)
                                || (user.resets <= 10 && user.level >= 325)
                                || (user.resets <= 35 && user.level >= 350)
                                || (user.resets <= 80 && user.level >= 375)
                                || (user.resets <= 250 && user.level >= 400);
                    }

                    if (reseted) {
                        socket.emit('userReseted', {
                            name: user.name
                        });

                        user.reseted = true;
                    }
                } else if (user.level < 10) {
                    user.reseted = false;
                }
            });
        }

        async function verifyDead() {
            users.forEach(user => {
                if (user.lastUpdate) {
                    const currentDate = new Date().getTime();
                    const lastUpdateDate = user.lastUpdate.getTime();

                    if ((currentDate - lastUpdateDate) > 600000) {
                        if (!user.dead) {
                            socket.emit('userDead', {
                                name: user.name
                            });
                            user.dead = true;
                        }
                    } else {
                        user.dead = false;
                    }
                }
            });
        }
    });

    app.get('/api', async (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");

        const data = await rp({
            method: 'POST',
            url: 'https://www.mucabrasil.com.br/?go=guild&n=Brothers',
            headers: {
                "cache-control": "no-cache",
            }
        });

        res.send(data);
    });


    let filesPath;

    filesPath = require('path').join(__dirname, '/dist-prod');

    app.use(compression());
    app.use(express.static(filesPath));

    app.set('views', filesPath);

    app.get('/*', (req, res) => {
        fs.readFile(`${filesPath}/index.html`, 'utf8', (err, text) => {
            res.send(text);
        });
    });

    app.listen(port, () => {
        console.log(`[${new Date()}]: Web server listening on port ${port}`);
    });
}

if (cluster.isMaster) {
    let cpuCount = 1 || os.cpus().length;

    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`[${new Date()}]: Worker ${worker.id} died`);
        cluster.fork();
    });
} else {
    loadServer();
}

async function updateUsersInfo() {
    const data = await rp({
        method: 'POST',
        url: 'https://www.mucabrasil.com.br/?go=guild&n=Brothers',
        headers: {
            "cache-control": "no-cache",
        }
    });

    const updatedUsers = [];

    const mucaInspection = document.createElement('div');

    mucaInspection.innerHTML = data;

    const $tabela = mucaInspection.querySelectorAll('.tabela');

    const search =
        [
            ...Array.prototype.filter.call($tabela[1].querySelectorAll('tr'), (item, index) => index > 1),
            ...Array.prototype.filter.call($tabela[2].querySelectorAll('tr'), (item, index) => index > 0)
        ];

    search.forEach(item => {
        updatedUsers.push({
            name: item.querySelectorAll('td')[1].innerHTML,
            level: parseInt(item.querySelectorAll('td')[2].innerHTML, 10),
            resets: parseInt(item.querySelectorAll('td')[3].innerHTML, 10),
            history: []
        });
    });

    updatedUsers.forEach(user => {
        let found = false;
        users.forEach(thisUser => {
            if (user.name === thisUser.name) {
                found = true;

                if (user.level !== thisUser.level) {
                    thisUser.lastUpdate = new Date();
                }

                thisUser.name = user.name;
                thisUser.level = user.level;
                thisUser.resets = user.resets;
            }
        });

        if (!found) {
            users.push({
                ...user
            });
        }
    });
}
