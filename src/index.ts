import { App } from './app';
import dotenv from 'dotenv';

dotenv.config();

const server = new App(); // port is not needed on Vercel

const expressApp = (async () => {
  await server.settings(); // make sure middlewares and routes are ready
  return server['app'];    // expose internal express Application
})();

module.exports = async (req: any, res: any) => {
  const app = await expressApp;
  return app(req, res); // let Vercel handle it
};
