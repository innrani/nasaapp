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
            
            const response = await axios.get(url);
            const data = response.data;

            if (data.length === 0) continue;

            // Processa os dados conforme o tipo de evento
            const processedData = data.map(event => {
                // Função para criar data segura
                const createSafeDate = (event) => {
                    const timeString = event.startTime || event.cmeStartTime || event.flrStartTime || event.hssStartTime;
                    if (!timeString) return new Date();
                    
                    const date = new Date(timeString);
                    // Verifica se a data é válida
                    if (isNaN(date.getTime())) {
                        console.warn(`⚠️ Data inválida encontrada: ${timeString}, usando data atual`);
                        return new Date();
                    }
                    return date;
                };

                return {
                    id: event[event.hasOwnProperty('gstID') ? 'gstID' : 'activityID'] || 'N/A',
                    type: endpoint, // Indica o tipo de evento (ex: GST, CME, etc.)
                    severity: endpoint === 'GST' 
                        ? event.allKpIndex?.some(kp => kp.kpIndex > 7) ? 'alta' : 'moderada' 
                        : 'indefinida', // Apenas tempestades geomagnéticas (GST) possuem um KpIndex
                    description: `Evento solar (${endpoint}): ${event.note || 'Sem descrição detalhada.'}`,
                    date: createSafeDate(event),
                    affectedAreas: ['América do Norte', 'Europa', 'Ásia'], // Ajustável conforme necessário
                    link: event.link || 'https://ccmc.gsfc.nasa.gov/donki/' // Link para mais informações
                };
            });

            events = events.concat(processedData);
        }

        return events;
    } catch (error) {
        console.error('❌ Erro ao obter dados da NASA:', error.message);
        return [];
    }
}

// Função original mantida para compatibilidade
async function fetchSolarEvents() {
    return await fetchSolarEventsWeek();
}

module.exports = { 
    fetchSolarEvents, 
    fetchSolarEventsWeek, 
    fetchSolarEventsInRange 
};
