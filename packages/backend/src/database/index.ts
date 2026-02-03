import { config } from 'dotenv';
config({ quiet: true });
import {Pool} from 'pg';


export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'travel_tips_web',
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT)
});

pool.on('connect',() =>{
    console.log('connected to db');
})

