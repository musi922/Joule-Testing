const cds = require('@sap/cds');

module.exports = async function () {
    
    this.on('callGeminiAI', async (req) => {
        
        const { message } = req.data;
        const axios = require('axios');

        try {
            if (!message || message.trim() === '') {
                return req.error(400, "Message is required");
            }

            const tokenUrl = 'https://924b88d5trial.authentication.us10.hana.ondemand.com/oauth/token';
            const clientId = 'sb-1a77c837-ac48-4a56-91f7-d0d09a0c5872!b499548|it-rt-924b88d5trial!b26655';
            const clientSecret = '62e2cece-4d2e-4c7a-87b8-db7c9d0d0bd1$RaXcAdY85AO0BZOGBDK0w4Mznv5F5ot7RmBXC87azSM=';

            const tokenResponse = await axios.post(tokenUrl,
                'grant_type=client_credentials',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
                    }
                }
            );

            const accessToken = tokenResponse.data.access_token;
            const messageText =  "answer in a friendly and not very many words but not few" + message ;
            console.log("the message",messageText);
            
            
            const cpiResponse = await axios.post(
                'https://924b88d5trial.it-cpitrial05-rt.cfapps.us10-001.hana.ondemand.com/http/gemini',
                messageText,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'text/plain'
                    }
                }
            );
            return {
                success: true,
                response: cpiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         cpiResponse.data.response || 
                         cpiResponse.data.message || 
                         cpiResponse.data.content || 
                         JSON.stringify(cpiResponse.data),
                error: null
            };

        } catch (error) {
            console.error('Failed to call Gemini API:', error.response?.data || error.message);
            return {
                success: false,
                response: null,
                error: `AI service error: ${error.message}`
            };
        }
    });
};