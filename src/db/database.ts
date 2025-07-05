 
import { Sequelize } from 'sequelize';
import { config } from '../configs/config';
import { initModels } from '../models/sequalize/init-models';

const DIALECT = "mysql"; 
export let sequelizeClient: Sequelize; 
 
export async function sequelizeConnect() {
    

    const sequelizeClientConnection = new Sequelize({
      database: config.dbName,
      username: config.dbUser,
      password: config.dbPass,
      host: config.dbHost,
      port: parseInt(config.dbPort || ""),
      dialect: DIALECT,
      timezone: "+05:30",
        minifyAliases: false,
      
    });

 

    await sequelizeClientConnection.authenticate();
    sequelizeClient = sequelizeClientConnection;
    await initModels(sequelizeClient);

    return sequelizeClientConnection;
}

export async function getSequalizeClient(): Promise<Sequelize> {
    if (sequelizeClient) {
        return sequelizeClient;
    }

    const mainConnection = await sequelizeConnect();

    return mainConnection;
}
