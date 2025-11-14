# 🔭 GUIA DE USO - ASTRONOMY ALERTS

Sistema completo de alertas astronômicos com **Groq AI gratuita** para astrônomos amadores.

## 🚀 **INÍCIO RÁPIDO - 3 PASSOS**

### **1. 🔑 Configure IA Gratuita (2 minutos)**
```bash
# Acesse: https://console.groq.com/
# Registre-se grátis (sem cartão)
# Gere API Key
# Cole no arquivo .env: GROQ_API_KEY=sua_chave
```

### **2. 📱 Configure WhatsApp (opcional)**
```bash
# Acesse: https://developers.facebook.com/
# Crie app WhatsApp Business
# Cole tokens no .env
```

### **3. ▶️ Execute**
```bash
npm start    # App principal para astrônomos
```

---

## 🎯 **COMANDOS PRINCIPAIS**

### **🔭 Alertas Astronômicos:**
```bash
npm start                    # App interativo principal
npm run aurora-alert         # Verificar auroras AGORA
npm run check-conditions     # Condições de observação
npm run monitor-24h          # Monitor contínuo 24h
```

---

## 🔭 **O QUE O SISTEMA FAZ PARA ASTRÔNOMOS**

### **1. 🌈 Alertas de Aurora**: 
- Detecta tempestades geomagnéticas (GST)
- Calcula probabilidade de aurora por região
- Indica melhor horário e direção para observação

### **2. 📊 Condições de Observação**: 
- Analisa interferência electromagnética
- Avalia risco para equipamentos sensíveis  
- Recomenda configurações de câmera

### **3. 🌙 Correlação Lunar**:
- Calcula fase da lua atual
- Sugere objetos ideais para cada condição
- Otimiza sessões de astrofotografia

### **4. 📱 Alertas WhatsApp Personalizados**:
- Mensagens focadas em astronomia
- Dicas específicas de configuração
- Previsões para próximas 24h

---

## 🔧 **CONFIGURAÇÃO COMPLETA**

### **Arquivo .env necessário:**
```env
# 🌌 NASA API (obrigatório)
NASA_API_KEY=sua_chave_nasa

# 🤖 IA GRATUITA - GROQ (recomendado)
GROQ_API_KEY=gsk_sua_chave_groq

# 📱 WhatsApp (opcional)  
WHATSAPP_ACCESS_TOKEN=seu_token_whatsapp
WHATSAPP_PHONE_NUMBER_ID=seu_phone_id
MY_PHONE_NUMBER=seu_numero

# 💰 OpenAI (backup opcional - pago)
OPENAI_API_KEY=sk_sua_chave_openai
```

### **Como obter cada chave:**

#### **🌌 NASA API (GRATUITO):**
```
🔗 https://api.nasa.gov/
📝 Registre-se grátis
🔑 Gere API Key instantaneamente  
💡 Limite: 1000 requests/hora gratuito
```

#### **🤖 Groq AI (GRATUITO):**
```
🔗 https://console.groq.com/
📝 Registre-se com email
🔑 Gere API Key (sem cartão)
💡 Limite: 30 requests/min gratuito
⚡ Velocidade: Ultra-rápida
```

#### **📱 WhatsApp Business:**
```
🔗 https://developers.facebook.com/
📝 Crie app WhatsApp Business
🔑 Configure webhook e tokens
💡 Para envio real de mensagens
```

---

## 📈 **EXEMPLO DE EXECUÇÃO COMPLETA**

### **Comando:** `npm run ai-only`

### **Output esperado:**
```bash
🔧 Verificando configurações...
✅ Groq configurada - IA GRATUITA habilitada
📡 Buscando eventos solares dos últimos 7 dias...

🔍 Consultando NASA APIs...
  ├── GST: Tempestades Geomagnéticas  
  ├── CME: Ejeções de Massa Coronal
  ├── FLR: Explosões Solares
  ├── SEP: Partículas Energéticas
  └── HSS: Ventos Solares

✅ 57 eventos encontrados

🤖 Usando Groq AI (gratuito)...
📊 ANÁLISE COMPLETA GERADA:
════════════════════════════════════════
Com base nos 57 eventos solares detectados, 
observamos atividade geomagnética intensa...
════════════════════════════════════════

📈 ANÁLISE PREDITIVA:
🔄 Tendência: DECRESCENTE  
🎯 Predição: Redução gradual da atividade
📊 Confiança: 85%

⚡ SCORE DE RISCO: 845/100 (CRÍTICO)
📋 Fatores:
  • Tempestades Geomagnéticas (+75)
  • Ejeções de Massa Coronal (+560) 
  • Explosões Solares (+90)
  • Alta Frequência (+120)

🏢 IMPACTOS POR SETOR:
  📡 Telecomunicações: ALTO (100%)
  ⚡ Energia Elétrica: ALTO (85%)
  ✈️ Aviação: ALTO (100%)
  🛰️ Satélites: ALTO (100%)

💡 RECOMENDAÇÕES:
  📡 Monitorar sistemas GPS críticos
  ⚡ Verificar estabilidade da rede
  ✈️ Rotas alternativas polares

🎉 ANÁLISE CONCLUÍDA!
📧 Sistema funcionando perfeitamente
🤖 Modo: GROQ (Gratuito)
```

---

## 🛠️ **SOLUÇÃO DE PROBLEMAS**

### **❌ Erro: "Groq API Key não encontrada"**
```bash
# Solução:
1. Acesse https://console.groq.com/
2. Registre-se gratuitamente
3. Gere nova API Key
4. Adicione no .env: GROQ_API_KEY=sua_chave
```

### **❌ Erro: "NASA API Quota Exceeded"**
```bash
# Solução:
1. Aguarde 1 hora (limite: 1000/hora)
2. Ou gere nova chave NASA (gratuito)
```

### **❌ WhatsApp token inválido:**
```bash
# Solução:
1. Acesse Facebook Developers
2. Regenere token temporário
3. Substitua no .env
```

---

## 📊 **STATUS DO SISTEMA**

| Componente | Status | Observações |
|------------|---------|-------------|
| 🌌 **NASA API** | ✅ FUNCIONANDO | Dados em tempo real |
| 🤖 **IA Groq** | ✅ GRATUITA | Ultra-rápida e precisa |
| 📊 **ML Próprio** | ✅ FUNCIONANDO | Análise offline sempre disponível |
| 📱 **WhatsApp** | ⚙️ CONFIGURÁVEL | Depende dos tokens |
| ⏰ **Scheduler** | ✅ FUNCIONANDO | Sistema 24/7 |

---

## 🎯 **CASES DE USO**

### **👨‍🔬 Para Pesquisadores:**
```bash
npm run ai-only
# Análise científica completa com IA
# Dados históricos de 7 dias
# Padrões e correlações automatizadas
```

### **🏢 Para Empresas de Telecom:**
```bash
npm run report-weekly
# Relatório semanal com impactos específicos
# Score de risco para telecomunicações  
# Recomendações operacionais
```

### **📱 Para Usuários Finais:**
```bash
npm run demo-whatsapp
# Relatórios automáticos formatados
# Linguagem acessível
# Alertas por setor
```

### **🤖 Para Desenvolvedores:**
```bash
npm run scheduler
# Sistema autônomo 24/7
# APIs integradas
# Logs detalhados
```

---

## 🔮 **RECURSOS AVANÇADOS**

### **🧪 Modo Teste:**
```env
# No .env:
ENABLE_TEST_MODE=true

# Scheduler executará a cada 15min
npm run scheduler
```

### **📈 Análise Histórica:**
```bash
# Modifique datas no código para períodos específicos
# Sistema suporta qualquer range de 7 dias
```

### **🔄 Fallback Automático:**
```bash
# Prioridade automática:
1. Groq AI (gratuito) 🆓
2. OpenAI (pago) 💰
3. Análise offline 🔧
```

---

## 💡 **DICAS DE PERFORMANCE**

### **🚀 Otimizações:**
- Use Groq para velocidade máxima
- Configure scheduler para horários baixos
- Monitore rate limits das APIs

### **📊 Monitoramento:**
- Acompanhe logs detalhados
- Verifique score de risco diário
- Configure alertas críticos

### **🔧 Manutenção:**
- Atualize tokens antes do vencimento
- Monitore quotas das APIs
- Faça backup das configurações

---

**🎉 Sistema completamente funcional com IA GRATUITA!**
**🚀 Pronto para produção e uso científico profissional!**