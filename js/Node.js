const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  const data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.REDIRECT_URI,
    scope: 'identify'
  };

  try {
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenRes.data.access_token}`
      }
    });

    const user = userRes.data;
    console.log(`User ${user.username}#${user.discriminator} visited the site.`);

    // You could now:
    // - Show a welcome message
    // - Log their visit in a database
    // - Send to a Discord channel via a bot webhook

    res.send(`Hello, ${user.username}#${user.discriminator}!`);
  } catch (err) {
    console.error(err);
    res.send("Error during Discord login");
  }
});

app.listen(3000, () => console.log('Listening on port 3000'));

