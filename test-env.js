// Script de teste para verificar carregamento de variáveis de ambiente
require('dotenv').config();

console.log('🔍 TESTE DE VARIÁVEIS DE AMBIENTE');
console.log('=' .repeat(50));

console.log('NASA_API_KEY:', process.env.NASA_API_KEY ? '✅ Encontrada' : '❌ Não encontrada');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Encontrada' : '❌ Não encontrada');
console.log('WHATSAPP_ACCESS_TOKEN:', process.env.WHATSAPP_ACCESS_TOKEN ? '✅ Encontrada' : '❌ Não encontrada');

console.log('\n📄 Arquivo .env existe?', require('fs').existsSync('.env') ? '✅ Sim' : '❌ Não');

if (process.env.OPENAI_API_KEY) {
    console.log('\n🤖 Testando conexão OpenAI...');
    try {
        const OpenAI = require('openai');
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        console.log('✅ Cliente OpenAI inicializado com sucesso!');
    } catch (error) {
        console.log('❌ Erro ao inicializar OpenAI:', error.message);
    }
} else {
    console.log('\n⚠️ Chave OpenAI não encontrada');
}