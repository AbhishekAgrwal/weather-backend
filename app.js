'use strict';

import Koa from 'koa';
import KoaRouter from '@koa/router';
import axios from 'axios';
import activites from './activity.js'


// Instantiation
const app = new Koa();
const router = new KoaRouter();


// Route for current weather
router.get('/currentweather', async (ctx) => {

    const current_weather_url = `http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${ctx.query.city}`;

    try{
        const weather_api_response = await axios.get(current_weather_url);
        
        // Categorize / bucket the weather condition
        const condition = weather_api_response.data.current.condition.text;
        let condition_category;

        if (condition.toLowerCase().indexOf('cloud') > -1 || condition.toLowerCase().indexOf('mist') > -1)  {
            condition_category = 'Cloudy';
        } else if(condition.toLowerCase().indexOf('rain') > -1 ) {
            condition_category = 'Rainy';
        } else if(condition.toLowerCase().indexOf('sun') > -1) {
            condition_category = 'Sunny';
        }
        
        // Build response from a subset of fields in the response from external API.
        const filtered_response = {
            city: weather_api_response.data.location.name,
            temp_c: weather_api_response.data.current.temp_c,
            temp_f: weather_api_response.data.current.temp_f,
            condition: condition,
            condition_category: condition_category,
            recommended_activites: activites[condition_category]
        };

        ctx.body = filtered_response;
        
    } catch(e) {
        ctx.status = 500;
        ctx.body = e.message;
    }
});


app.use(router.routes()).use(router.allowedMethods());
app.listen(process.env.PORT || 3000)
