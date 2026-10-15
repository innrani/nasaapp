require('dotenv').config();
const axios = require('axios');

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov/DONKI';

// Função para buscar eventos solares dos últimos 7 dias
async function fetchSolarEventsWeek() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    return await fetchSolarEventsInRange(startDateStr, endDateStr);
}

// Função para buscar eventos solares em um período específico
async function fetchSolarEventsInRange(startDate, endDate) {
    try {
        console.log(`📡 Buscando eventos solares de ${startDate} até ${endDate}...`);
        const endpoints = ['GST', 'CME', 'FLR', 'SEP', 'HSS'];

        let events = [];

        for (const endpoint of endpoints) {
            const url = `${NASA_BASE_URL}/${endpoint}?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_KEY}`;
            console.log(`🔍 Consultando ${endpoint}: ${url}`);

            const response = await axios.get(url, { timeout: 30000 });
            const payload = response.data;
            const data = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.items)
                    ? payload.items
                    : [];

            if (!data.length) {
                const hasApiError = payload && typeof payload === 'object' && (payload.error || payload.message || payload.code);
                if (hasApiError) {
                    console.warn(`⚠️ NASA DONKI (${endpoint}) respondeu com erro:`, payload.error || payload.message || payload.code);
                }
                continue;
            }

            const processedData = data.map(event => {
                const createSafeDate = (event) => {
                    const timeString = event.startTime || event.cmeStartTime || event.flrStartTime || event.hssStartTime || event.eventTime;
                    if (!timeString) return new Date();

                    const date = new Date(timeString);
                    if (isNaN(date.getTime())) {
                        console.warn(`⚠️ Data inválida encontrada: ${timeString}, usando data atual`);
                        return new Date();
                    }
                    return date;
                };

                const eventId = event.gstID || event.activityID || event.id || 'N/A';

                return {
                    id: eventId,
                    type: endpoint,
                    severity: endpoint === 'GST'
                        ? event.allKpIndex?.some(kp => kp.kpIndex > 7) ? 'alta' : 'moderada'
                        : 'indefinida',
                    description: `Evento solar (${endpoint}): ${event.note || event.summary || event.catalog || 'Sem descrição detalhada.'}`,
                    date: createSafeDate(event),
                    affectedAreas: ['América do Norte', 'Europa', 'Ásia'],
                    link: event.link || 'https://ccmc.gsfc.nasa.gov/donki/'
                };
            });

            events = events.concat(processedData);
        }

        return events;
    } catch (error) {
        console.error('❌ Erro ao obter dados da NASA:', error.message);
        if (error.response) {
            console.error('📌 Resposta da API:', error.response.status, error.response.data);
        }
        return [];
    }
}

async function fetchSolarEvents() {
    return await fetchSolarEventsWeek();
}

module.exports = { 
    fetchSolarEvents, 
    fetchSolarEventsWeek, 
    fetchSolarEventsInRange 
};
