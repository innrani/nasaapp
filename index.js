require('dotenv').config();
const { fetchSolarEvents } = require('./geomagnetic-storm/services/nasa.js');
const { sendAlerts } = require('./geomagnetic-storm/services/notificacoes.js');

async function main() {
    console.log("📡 Buscando eventos solares...");
    const events = await fetchSolarEvents();

    if (!events || events.length === 0) {
        console.log("✅ Nenhum evento solar detectado.");
        return;
    }

    console.log(`🌞 ${events.length} eventos solares detectados:`);
    events.forEach(event => {
        console.log(`📌 [${event.type}] ${event.description} - Data: ${event.date?.toISOString() || "Desconhecida"}`);
    });

    // Filtra eventos relevantes para alertas
    const relevantEvents = events.filter(event => {
        if (event.type === 'GST') {
            return event.severity === 'alta'; // Apenas tempestades severas
        }
        return true; // Outros eventos solares são sempre enviados
    });

    if (relevantEvents.length > 0) {
        console.log("🚀 Enviando alertas para eventos solares significativos...");
        await sendAlerts(relevantEvents);
    } else {
        console.log("✅ Nenhum evento crítico necessitando alerta.");
    }
}

main();
