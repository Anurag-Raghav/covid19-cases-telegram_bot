const telegrambot=require('node-telegram-bot-api');
require('dotenv').config();
const request= require('request');
const token=process.env.TOKEN_KEY;
const options = {
    webHook: {
      port: process.env.PORT
    }
  }; 
  const url = process.env.APP_URL || 'https://covid19goldyy.herokuapp.com:443';
  const bot = new telegrambot(token, options);
  bot.setWebHook(`${url}/bot${token}`);
    bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "working ");
        
    });

    bot.on('message', msg => { 
    if (msg.text === '/start') {
        return;
    }
    const chatID=msg.chat.id;
    const countryname=msg.text;
    request(`https://disease.sh/v3/covid-19/countries/${countryname}`,function(error,response,body){
        if(!error){
            const res=JSON.parse(body);
            if (res.cod === '404') {
                bot.sendMessage(chatID, 'Invalid country name.', {reply_to_message_id: msg.message_id});
                return;
            }
             const flag=res.countryInfo.flag;
             const cases=res.cases;
             const today_cases=res.todayCases;
             bot.sendPhoto(chatID,flag);
             bot.sendMessage(chatID,`Total_cases: ${cases}\ntoday_cases:-${today_cases}`);
        }else{
            console.log(error);
        }
    })
});
