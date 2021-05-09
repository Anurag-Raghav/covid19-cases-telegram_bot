const telegrambot=require('node-telegram-bot-api');
const request= require('request');
const token=process.env.TOKEN_KEY || '1864197850:AAH-g-QwmNqnXbEo_4j90TB7LJ05VilzBt4';
const options = {
    webHook: {
      port: process.env.PORT
    }
  }; 
  const url = process.env.APP_URL || 'https://covid19goldyy.herokuapp.com:443';
  const bot = new telegrambot(token, options);
  
    bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Please enter the country name for the covid cases count.. ");
        
    });
    bot.setWebHook(`${url}/bot${token}`);
    bot.on('message', msg => { 
    if (msg.text === '/start') {
        return;
    }
    const chatID=msg.chat.id;
    const countryname=msg.text;
    request(`https://disease.sh/v3/covid-19/countries/${countryname}`,function(error,response,body){
        if(!error){
            const res=JSON.parse(body);
            if (res.status=== '404') {
                bot.sendMessage(chatID, 'Invalid country name.', {reply_to_message_id: msg.message_id});
                return;
            }
             const flag=res.countryInfo.flag;
             const cases=res.cases;
             const today_cases=res.todayCases;
             const deaths=res.deaths;
             const today_deaths=res.todayDeaths;
             const recovered=res.recovered;
             const today_recovered=res.todayRecovered
             const active=res.active;
             const critical=res.critical;
             bot.sendPhoto(chatID,flag);
             bot.sendMessage(chatID, `Total cases: ${cases}\nToday cases:${today_cases}\nTotal Deaths:${deaths}\nToday Deaths:${today_deaths}\nTotal Recovered:${recovered}\nToday Recoeverd:${today_recovered}\nTotal Active:${active}\nCritical Cases:${critical}`);
        }else{
            console.log(error);
        }
    })
});


