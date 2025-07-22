const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'https://transitoaovivo.com' }));
app.use(express.json());

console.log('Versão do Axios:', axios.VERSION);

app.get('/transito', async (req, res) => {
  try {
    const response = await axios.get('https://www.cetsp.com.br/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10 segundos
    });
    const $ = cheerio.load(response.data);

    const norte = parseInt($('.info.norte h4').text().replace(' km', '')) || 0;
    const oeste = parseInt($('.info.oeste h4').text().replace(' km', '')) || 0;
    const centro = parseInt($('.info.centro h4').text().replace(' km', '')) || 0;
    const leste = parseInt($('.info.leste h4').text().replace(' km', '')) || 0;
    const sul = parseInt($('.info.sul h4').text().replace(' km', '')) || 0;

    const total = norte + oeste + centro + leste + sul;
    const dataHora = $('.boxTransito ul li:first-child').text() || new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    res.json({
      total,
      regioes: { norte, oeste, centro, leste, sul },
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