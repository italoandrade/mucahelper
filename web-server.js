const rp = require('request-promise');
const express = require('express');
const cluster = require('cluster');
const fs = require('fs');
const compression = require('compression');
const os = require("os");
require('jsdom-global')();

const port = 1000;

function loadServer() {
    const app = express();
    const io = require('socket.io')(3223);

    io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });

        setInterval(async () => {
            await updateUsersInfo();
            // console.log(users);

            socket.emit('updateUsersInfo', users);
        }, 3000);
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

    filesPath = require('path').join(__dirname, '/dist');

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

const users = [];

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
                    thisUser.history.push({
                        level: thisUser.level,
                        date: thisUser.lastUpdate
                    });
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
