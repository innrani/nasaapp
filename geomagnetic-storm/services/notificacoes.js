require('dotenv').config();
const axios = require('axios');

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const MY_PHONE_NUMBER = process.env.MY_PHONE_NUMBER;

function formatMessage(event) {
    if (!event) return "⚠️ Evento solar detectado, mas sem detalhes disponíveis.";

    let eventType = "";
    let eventDetails = "";

    switch (event.type) {
        case "GST":
            eventType = "⚠️ ALERTA DE TEMPESTADE GEOMAGNÉTICA ⚠️";
            eventDetails = `Foram detectadas tempestades geomagnéticas ${event.severity === 'alta' ? 'severas (Kp > 7)' : 'moderadas (Kp <= 7)'}.\n` +
                           `Impactos possíveis em sistemas de comunicação e GPS. Verifique seu dispositivo para possíveis problemas.`;
            break;
        case "CME":
            eventType = "⚡ ALERTA DE EJEÇÃO DE MASSA CORONAL (CME) ⚡";
            eventDetails = `Uma ejeção de massa coronal foi detectada! Isso pode impactar a magnetosfera da Terra e causar auroras intensas.`;
            break;
        case "FLR":
            eventType = "🌞 ALERTA DE EXPLOSÃO SOLAR (FLARE) 🌞";
            eventDetails = `Uma explosão solar foi registrada! Possíveis interferências em rádio e GPS podem ocorrer.`;
            break;
        case "HSS":
            eventType = "💨 ALERTA DE VENTO SOLAR RÁPIDO (HSS) 💨";
            eventDetails = `Correntes de vento solar de alta velocidade foram detectadas! Podem impactar satélites e redes elétricas.`;
            break;
        case "SEP":
            eventType = "☢️ ALERTA DE PARTÍCULAS ENERGÉTICAS SOLARES (SEP) ☢️";
            eventDetails = `Altos níveis de partículas solares foram detectados, podendo impactar astronautas e satélites.`;
            break;
        case "MPC":
            eventType = "🛡️ ALERTA DE CRUZAMENTO DA MAGNETOPAUSA (MPC) 🛡️";
            eventDetails = `Um cruzamento da magnetopausa foi registrado, indicando fortes interações com o vento solar.`;
            break;
        default:
            eventType = "⚠️ ALERTA DE ATIVIDADE SOLAR ⚠️";
            eventDetails = "Um evento solar significativo foi detectado.";
    }

    return `${eventType}\n\n${eventDetails}\n\n` +
           `🌐 Data e hora da detecção: ${event.date ? event.date.toLocaleString('pt-BR', { timeZone: 'UTC' }) : "Desconhecida"}\n` +
           `- Evento: ${event.description || "Sem descrição"}\n\n` +
           `🌍 Locais afetados: ${event.affectedAreas?.join(', ') || "Desconhecido"}\n` +
           `🔗 Mais informações: ${event.link || 'Não disponível'}`;
}

/*Envia alertas via WhatsApp para eventos solares detectados
 */
async function sendAlerts(events) {
    if (!events || events.length === 0) return;

    for (const event of events) {
        const message = formatMessage(event);

        try {
            console.log(`🚀 Enviando alerta para ${MY_PHONE_NUMBER}`);
            await axios.post(
                `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: MY_PHONE_NUMBER,
                    type: "text",
                    text: { body: message },
                },
                {
                    headers: {
                        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(`✅ Alerta enviado para ${MY_PHONE_NUMBER}`);
        } catch (error) {
            console.error(`❌ Erro ao enviar alerta:`, error.response?.data || error.message);
        }
    }
}

module.exports = { sendAlerts };
