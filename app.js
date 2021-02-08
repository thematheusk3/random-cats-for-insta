const axios = require('axios');
const fs = require('fs');
const jsonFile = 'cats.json';
const auth = require('./auth');
const insta = require('./insta');


const timerPost = 18000000;

let cats = {};
let numberCats = 0;


async function returnCatJSON() {
    const response = await axios.get(`https://api.thecatapi.com/v1/images/search`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': auth.api_key
        }
    });
    return response;
}


async function start() {
    console.log(`${dataTime()} Realizando uma postagem!`);
    const api = await returnCatJSON();
    let buscarId = cats.filter(cat => {
        return cat.id == api.data[0].id;
    });
    if (buscarId.length < 1) {
        try {
            console.log('Salvando o gato na base!');
            cats.push({ 'id': api.data[0].id, 'img_url': api.data[0].url });
            let upload = await insta(api.data[0].url, numberCats);
            console.table(upload);
            if (upload.status == 'Error') {
                setTimeout(start(), 3000);
                return null;
            }
            gravarJson(jsonFile, JSON.stringify(cats));
            numberCats++;

        } catch {

        }
    } else {
        console.log('Esse gato já está na base');
        start();
    }
}



fs.exists(jsonFile, (exists) => {
    if (exists) {
        console.log('Carregando o arquivo: ' + jsonFile);
        fs.readFile(jsonFile, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Arquivo carregado com Sucesso!')
                cats = JSON.parse(data);
                numberCats = cats.length;
            }
        });
    } else {
        console.log(`O arquivo: ${jsonFile} não existe!`);
        let json = [];
        cats = json;
        gravarJson(jsonFile, JSON.stringify(json));
    }
});

function gravarJson(path, content) {
    fs.writeFile(path, content, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

async function diario() {
    let timer = setInterval(() => {
        start();
    }, timerPost)

    let temp = timerPost;
    setInterval(() => {
        temp -= 1000;

        seconds = (temp / 1000) % 60
        minutes = (temp / (1000 * 60)) % 60
        hours = (temp / (1000 * 60 * 60)) % 24
			console.log('');
       // console.log(`Falta: ${ajuste(hours, 0)}:${ajuste(minutes, 0)}:${ajuste(seconds, 0)}`);
        if (temp <= 0) { temp = timerPost }

    }, 1000)


}


diario();
start();

function dataTime() {
    let today = new Date();
    let h = zero(today.getHours());
    let m = zero(today.getMinutes());
    let s = zero(today.getSeconds());

    let dia = zero(today.getDate());
    let mes = zero(today.getMonth() + 1);
    let ano = zero(today.getFullYear());

    let dataHora = `${dia}/${mes}/${ano}  ${h}:${m}:${s}`;
    return dataHora;
}

function zero(x) {
    if (x < 10) {
        return "0" + x;
    } else
        return `${x}`;
}

function ajuste(nr, casas) {
    const og = Math.pow(10, casas)
    return zero(Math.floor(nr * og) / og);
}
