import { App } from './app'; 

import dotenv from 'dotenv';

dotenv.config();


async function main() {
    const EPIC = await process.env.PORT;
    const app = new App(EPIC); 
    await app.listen();
}

main();
