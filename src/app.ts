import cors, { CorsOptions } from 'cors';
import express, { Application } from 'express'; 
import { getSequalizeClient } from './db/database'; 
import router from './routes';
process.env.PWD = process.cwd();
const bodyParser = require('body-parser');

export class App {
    public app: Application;

    constructor(private port?: number | string) {
        this.app = express();
        this.settings();
        console.log('All Server Modules are loaded');
    }

    async settings() {
        this.app.set('port', this.port);

        this.middlewares(); 
        await getSequalizeClient();
        await this.routes();
    }
 

 
    async middlewares() {
         
        this.app.use(bodyParser());

        const corsOptions: CorsOptions = {
            origin: [
                'http://localhost:4200',
                'http://localhost:5000',
                'https://wallet-ui-smoky.vercel.app',
                `http://${process.env.BASE_URL as string}:4200`,
            ],
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
            credentials: true,
            exposedHeaders: [
                'Content-Type',
                'ETag',
                'Date',
                'Connection',
                'Bearer-Token',
                'Set-Cookie',
            ],
        };
        this.app.use(cors(corsOptions)); 
           console.log('Initializing Lite Middlewares');
    }

    routes() {
        this.app.get('/', (req, res) => {
  res.send('Hello World')
});

        this.app.use(router); 
    }

    async listen() {
        console.log(this.app.get('port'));
        await this.app.listen(3400);
    }
 
 
}
