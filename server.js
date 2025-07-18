const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.get('/transito', async (req, res) => {
    try {
        const response = await axios.get('https://www.cetsp.com.br/');
        const $ = cheerio.load(response.data);

        // Extrair dados das regiões
        const norte = $('.info.norte h4').text().replace(' km', '') || '0';
        const oeste = $('.info.oeste h4').text().replace(' km', '') || '0';
        const centro = $('.info.centro h4').text().replace(' km', '') || '0';
        const leste = $('.info.leste h4').text().replace(' km', '') || '0';
        const sul = $('.info.sul h4').text().replace(' km', '') || '0';

        // Calcular total somando as regiões
        const total = parseInt(norte) + parseInt(oeste) + parseInt(centro) + parseInt(leste) + parseInt(sul);

        // Extrair data
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
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor rodando!');
});