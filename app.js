'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const axios = require('axios')

const app = new Koa();
const router = new Router();

const api_key = 'ce89541b80484bfebca111038242006'

router.get('/weather', async (ctx) => {

    const current_weather_api = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${ctx.query.city}`;

    try{
        const weather_api_response = await axios.get(current_weather_api);

        const response = {
            city: weather_api_response.data.location.name,
            temp_c: weather_api_response.data.current.temp_c,
            temp_f: weather_api_response.data.current.temp_f,
            condition: weather_api_response.data.current.condition.text
        }

        ctx.body = response;

    } catch(e) {
        ctx.status = 422;
        ctx.body = e.message;
    }
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen('3000')
