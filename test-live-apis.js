require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

(async () => {
  const report = {
    env: {
      NASA_API_KEY: !!process.env.NASA_API_KEY,
      GROQ_API_KEY: !!process.env.GROQ_API_KEY,
      WHATSAPP_ACCESS_TOKEN: !!process.env.WHATSAPP_ACCESS_TOKEN,
      WHATSAPP_PHONE_NUMBER_ID: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
      MY_PHONE_NUMBER: !!process.env.MY_PHONE_NUMBER
    },
    nasa: null,
    groq: null
  };

  const nasaKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const groqKey = process.env.GROQ_API_KEY || 'demo';

  try {
    const url = `https://api.nasa.gov/DONKI/GST?startDate=2025-01-01&endDate=2025-01-03&api_key=${nasaKey}`;
    const res = await axios.get(url, { timeout: 20000 });
    report.nasa = {
      status: res.status,
      count: Array.isArray(res.data) ? res.data.length : 'non-array',
      sample: res.data && res.data[0] ? {
        id: res.data[0].gstID || res.data[0].activityID || 'n/a',
        startTime: res.data[0].startTime || 'n/a'
      } : { empty: true }
    };
  } catch (error) {
    report.nasa = {
      status: error.response ? error.response.status : 'error',
      message: error.message
    };
  }

  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Responda em uma frase: teste de conectividade Groq.' }],
        max_tokens: 20,
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );
    report.groq = {
      status: res.status,
      answer: res.data && res.data.choices && res.data.choices[0] && res.data.choices[0].message
        ? res.data.choices[0].message.content
        : 'sem conteúdo'
    };
  } catch (error) {
    report.groq = {
      status: error.response ? error.response.status : 'error',
      message: error.message
    };
  }

  const outputPath = 'api-live-check.json';
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`RESULT_SAVED:${outputPath}`);
})();
