require('dotenv').config();
const axios = require('axios');

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov/DONKI';

// Função para buscar e processar múltiplos eventos solares
async function fetchSolarEvents() {
    try {
        console.log('📡 Buscando eventos solares na NASA...');
        const endpoints = ['GST', 'CME', 'FLR', 'SEP', 'HSS'];
        
        let events = [];

        for (const endpoint of endpoints) {
            const url = `${NASA_BASE_URL}/${endpoint}?api_key=${NASA_API_KEY}`;
            const response = await axios.get(url);
            const data = response.data;

            if (data.length === 0) continue;

            // Processa os dados conforme o tipo de evento
            const processedData = data.map(event => ({
                id: event[event.hasOwnProperty('gstID') ? 'gstID' : 'activityID'] || 'N/A',
                type: endpoint, // Indica o tipo de evento (ex: GST, CME, etc.)
                severity: endpoint === 'GST' 
                    ? event.allKpIndex?.some(kp => kp.kpIndex > 7) ? 'alta' : 'moderada' 
                    : 'indefinida', // Apenas tempestades geomagnéticas (GST) possuem um KpIndex
                description: `Evento solar (${endpoint}): ${event.note || 'Sem descrição detalhada.'}`,
                date: new Date(event.startTime || event.cmeStartTime || event.flrStartTime || event.hssStartTime),
                affectedAreas: ['América do Norte', 'Europa', 'Ásia'], // Ajustável conforme necessário
                link: event.link || 'https://ccmc.gsfc.nasa.gov/donki/' // Link para mais informações
            }));

            events = events.concat(processedData);
        }

        return events;
    } catch (error) {
        console.error('❌ Erro ao obter dados da NASA:', error.message);
        return [];
    }
}

module.exports = { fetchSolarEvents };
