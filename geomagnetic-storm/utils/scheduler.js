const schedule = require('node-schedule');
const { fetchSolarEvents } = require('./geomagnetic-storm/services/nasa.js');
const { sendAlerts } = require('./geomagnetic-storm/services/notificacoes.js');

async function checkForSolarEvents() {
    console.log("🔍 Verificando eventos solares...");

    try {
        const events = await fetchSolarEvents();

        if (events.length > 0) {
            console.log(`☀️ ${events.length} eventos solares detectados! Enviando alertas...`);
            await sendAlerts(events);
        } else {
            console.log("✅ Nenhum evento solar significativo detectado.");
        }
    } catch (error) {
        console.error("❌ Erro ao buscar eventos solares:", error.message);
    }
}

// Agendamento para rodar a cada 1 hora
schedule.scheduleJob('0 * * * *', () => {
    console.log("⏳ Executando verificação programada...");
    checkForSolarEvents();
});

// Executa uma verificação inicial ao iniciar
checkForSolarEvents();
