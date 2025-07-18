const express = require('express');
const { request } = require('undici');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'https://transitoaovivo.com'
}));

app.get('/transito', async (req, res) => {
    try {
        const { body } = await request('https://www.cetsp.com.br/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const responseData = await body.text();
        const $ = cheerio.load(responseData);

        const norte = $('.info.norte h4').text().replace(' km', '') || '0';
        const oeste = $('.info.oeste h4').text().replace(' km', '') || '0';
        const centro = $('.info.centro h4').text().replace(' km', '') || '0';
        const leste = $('.info.leste h4').text().replace(' km', '') || '0';
        const sul = $('.info.sul h4').text().replace(' km', '') || '0';

        const total = parseInt(norte) + parseInt(oeste) + parseInt(centro) + parseInt(leste) + parseInt(sul);

        const dataHora = $('.boxTransito ul li:first-child').text() || new Date().toLocaleString('pt-BR');

        res.json({
            total,
            regioes: {
                norte: parseInt(norte),
                oeste: parseInt(oeste),
                centro: parseInt(centro),
                leste: parseInt(leste),
                sul: parseInt(sul)
            },
            dataHora,
            mensagem: 'Lentidão em km na cidade de São Paulo'
        });
    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).json({ error: 'Erro ao buscar dados', details: error.message });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor rodando!');
});