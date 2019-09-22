// Pacotes Usados
const fetch = require('node-fetch');
const fs = require("fs");

//Constantes do Projeto
const cidades_ids = require('./cidades_ids.json').data;
const config = require('./config.json');
const previsoes = config.previsoes;

const years = Array.from({
    length: config.endYear - config.startYear + 1
}, (v, k) => k + config.startYear);
const options = {
    method: 'GET',
    headers: {
        'cookie': 'PHPSESSID=e9da63d28795029a741f4a9450d4b64f; __cfduid=deee04098767a0109b1aafbe71270e2ea1569156949; __tawkuuid=e::smac.climatempo.com.br::4OcNqFUYQwiiIdXjLyVWFRhrYlclP2K++Ab3out0iKXL2SxzTsHcmeRchOKTna0O::2; alertBeep=false; TawkConnectionTime=0'
    },
};

(async () => {
    // Iterações
    for (const previsao of previsoes) {
        for (const cidade_id of cidades_ids) {
            for (const year of years) {
                await callApiAndSaveToJson(previsao, cidade_id, year);
            }
        }
    }
})();


// Main 
async function callApiAndSaveToJson(previsao, id, year) {
    try {
        console.log(`Iniciada aquisicao do ${id}-${previsao}-${year}`);

        var dir = `./dados_historico_${previsao}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        let filename = `${dir}/${id}-${year}.json`;
        if (fs.existsSync(filename)) {
            console.log(`${filename} já existe!`)
            return;
        }

        var url = `https://smac.climatempo.com.br/dadosPassados/getLocaleHistoricData/view${previsao}?localeIds=${id}&dateBegin=${year}-01-01&dateEnd=${year}-12-31`
        let res = await fetch(url, options).catch(err => console.error(err));
        if (!res.ok) {
            console.log(`${filename} nao deu 200OK! (${res.status})`)
            return;
        }
        let body = await res.json().catch(err => console.error(err));
        let jsonContent = JSON.stringify(body[0], null, 4);
        fs.writeFileSync(filename, jsonContent, 'utf8', function (err) {
            console.log('Ocorreu um erro ao salvar o json ' + err)
        })
        console.log(`ID ${id} salvo com sucesso!`);

    } catch (err) {
        console.log(err);
    }
};