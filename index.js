/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.App = void 0;\nconst cors_1 = __importDefault(__webpack_require__(/*! cors */ \"cors\"));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst database_1 = __webpack_require__(/*! ./db/database */ \"./src/db/database.ts\");\nconst routes_1 = __importDefault(__webpack_require__(/*! ./routes */ \"./src/routes/index.ts\"));\nprocess.env.PWD = process.cwd();\nconst bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\nclass App {\n    port;\n    app;\n    constructor(port) {\n        this.port = port;\n        this.app = (0, express_1.default)();\n        console.log('All Server Modules are loaded');\n    }\n    async settings() {\n        this.app.set('port', this.port);\n        this.middlewares();\n        await (0, database_1.getSequalizeClient)();\n        await this.routes();\n    }\n    async middlewares() {\n        this.app.use(bodyParser());\n        const corsOptions = {\n            origin: [\n                'http://localhost:4200',\n                'http://localhost:5000',\n                'https://wallet-ui-smoky.vercel.app',\n                `http://${process.env.BASE_URL}:4200`,\n            ],\n            methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],\n            credentials: true,\n            exposedHeaders: [\n                'Content-Type',\n                'ETag',\n                'Date',\n                'Connection',\n                'Bearer-Token',\n                'Set-Cookie',\n            ],\n        };\n        this.app.use((0, cors_1.default)(corsOptions));\n        console.log('Initializing Lite Middlewares');\n    }\n    routes() {\n        this.app.get('/', (req, res) => {\n            res.send('Hello World');\n        });\n        this.app.use(routes_1.default);\n    }\n    async listen() {\n        await this.app.listen(this.app.get('port'), process.env.BASE_URL);\n    }\n}\nexports.App = App;\n\n\n//# sourceURL=webpack://wallet-management/./src/app.ts?");

/***/ }),

/***/ "./src/configs/config.ts":
/*!*******************************!*\
  !*** ./src/configs/config.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.config = void 0;\nconst joi_1 = __importDefault(__webpack_require__(/*! joi */ \"joi\"));\n__webpack_require__(/*! dotenv/config */ \"dotenv/config\");\nconst envValidation = joi_1.default.object()\n    .keys({\n    PORT: joi_1.default.number().default(3400),\n    DB_NAME: joi_1.default.string().required(),\n    DB_HOST: joi_1.default.string().default(\"localhost\"),\n    DB_USER: joi_1.default.string().required(),\n    DB_PORT: joi_1.default.string().required(),\n    DB_PASSWORD: joi_1.default.string().required(),\n})\n    .unknown();\nconst { value: envVar, error } = envValidation\n    .prefs({ errors: { label: 'key' } })\n    .validate(process.env);\nif (error) {\n    throw new Error(`Config validation error: ${error.message}`);\n}\nexports.config = {\n    port: envVar.PORT,\n    dbPort: envVar.DB_PORT,\n    dbHost: envVar.DB_HOST,\n    dbUser: envVar.DB_USER,\n    dbPass: envVar.DB_PASSWORD,\n    dbName: envVar.DB_NAME,\n};\n\n\n//# sourceURL=webpack://wallet-management/./src/configs/config.ts?");

/***/ }),

/***/ "./src/controllers/wallet.controller.ts":
/*!**********************************************!*\
  !*** ./src/controllers/wallet.controller.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst http_status_1 = __importDefault(__webpack_require__(/*! http-status */ \"http-status\"));\nconst database_1 = __webpack_require__(/*! ../db/database */ \"./src/db/database.ts\");\nconst wallet_service_1 = __importDefault(__webpack_require__(/*! ../services/wallet.service */ \"./src/services/wallet.service.ts\"));\nconst responseHandler_1 = __importDefault(__webpack_require__(/*! ../utils/responseHandler */ \"./src/utils/responseHandler.ts\"));\nclass WalletController {\n    walletService;\n    constructor() {\n        this.walletService = new wallet_service_1.default();\n    }\n    // 1. POST /setup - Create Wallet\n    postWalletDetails = async (req, res) => {\n        let transaction;\n        try {\n            await (0, database_1.getSequalizeClient)();\n            console.log('name, balance');\n            transaction = await database_1.sequelizeClient.transaction();\n            const { name, balance } = req.body;\n            const walletResponse = await this.walletService.createWallet(name, balance, transaction);\n            if (!walletResponse.response.status) {\n                await transaction.rollback();\n                return res.status(http_status_1.default.BAD_REQUEST).send(walletResponse.response);\n            }\n            await transaction.commit();\n            return res\n                .status(walletResponse.response.code)\n                .send(walletResponse.response);\n        }\n        catch (error) {\n            console.error(`Controller Error in create:`, error);\n            await transaction?.rollback();\n            return res\n                .status(http_status_1.default.INTERNAL_SERVER_ERROR)\n                .send(responseHandler_1.default.returnError(http_status_1.default.INTERNAL_SERVER_ERROR, \"Failed to create wallet\").response);\n        }\n    };\n    // 2. POST /transact/:walletId - Credit/Debit\n    postTransaction = async (req, res) => {\n        let transaction;\n        try {\n            await (0, database_1.getSequalizeClient)();\n            transaction = await database_1.sequelizeClient.transaction();\n            const { walletId } = req.params;\n            const { amount, description } = req.body;\n            const result = await this.walletService.transact(walletId, amount, description, transaction);\n            if (!result.response.status) {\n                await transaction.rollback();\n                return res.status(http_status_1.default.BAD_REQUEST).send(result.response);\n            }\n            await transaction.commit();\n            return res.status(result.response.code).send(result.response);\n        }\n        catch (err) {\n            await transaction?.rollback();\n            return res\n                .status(http_status_1.default.INTERNAL_SERVER_ERROR)\n                .send(responseHandler_1.default.returnError(http_status_1.default.INTERNAL_SERVER_ERROR, \"Failed to process transaction\").response);\n        }\n    };\n    // 3. GET /wallet/:walletId - Fetch Wallet\n    fetchWalletDetails = async (req, res) => {\n        try {\n            await (0, database_1.getSequalizeClient)();\n            const { walletId } = req.params;\n            const walletResponse = await this.walletService.getWalletById(walletId);\n            return res\n                .status(walletResponse.response.code)\n                .send(walletResponse.response);\n        }\n        catch (error) {\n            return res\n                .status(http_status_1.default.INTERNAL_SERVER_ERROR)\n                .send(responseHandler_1.default.returnError(http_status_1.default.INTERNAL_SERVER_ERROR, \"Failed to fetch wallet\").response);\n        }\n    };\n    // 4. GET /transactions - Fetch Wallet Transactions\n    fetchTransactions = async (req, res) => {\n        try {\n            await (0, database_1.getSequalizeClient)();\n            const { walletId, skip = 0, limit = 10 } = req.query;\n            if (!walletId) {\n                return res\n                    .status(http_status_1.default.BAD_REQUEST)\n                    .send(responseHandler_1.default.returnError(http_status_1.default.BAD_REQUEST, \"Missing walletId\").response);\n            }\n            const result = await this.walletService.getWalletTransactions(String(walletId), Number(skip), Number(limit));\n            return res.status(result.response.code).send(result.response);\n        }\n        catch (err) {\n            return res\n                .status(http_status_1.default.INTERNAL_SERVER_ERROR)\n                .send(responseHandler_1.default.returnError(http_status_1.default.INTERNAL_SERVER_ERROR, \"Failed to fetch transactions\").response);\n        }\n    };\n}\nexports[\"default\"] = WalletController;\n\n\n//# sourceURL=webpack://wallet-management/./src/controllers/wallet.controller.ts?");

/***/ }),

/***/ "./src/dao/sequalize/SuperDao.sequalize.ts":
/*!*************************************************!*\
  !*** ./src/dao/sequalize/SuperDao.sequalize.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass SequalizeSuperDao {\n    model;\n    constructor(model) {\n        this.model = model;\n    }\n    async create(data, transaction) {\n        try {\n            return await this.model.create(data, { transaction });\n        }\n        catch (err) {\n            console.error(`DAO Error in create:`, err);\n            throw err;\n        }\n    }\n    async bulkCreate(data, transaction) {\n        try {\n            return await this.model.bulkCreate(data, { transaction });\n        }\n        catch (err) {\n            console.error(`DAO Error in bulkCreate:`, err);\n            throw err;\n        }\n    }\n    async updateWhere(data, where, transaction) {\n        try {\n            return await this.model.update(data, { where, transaction });\n        }\n        catch (err) {\n            console.error(`DAO Error in updateWhere:`, err);\n            throw err;\n        }\n    }\n    async findByWhere(where, include = [], options = {}) {\n        try {\n            const queryOptions = {\n                where,\n                include,\n                ...options,\n            };\n            const result = await this.model.findAll(queryOptions);\n            return result.map((record) => {\n                return record.toJSON();\n            });\n        }\n        catch (err) {\n            console.error(`DAO Error in findByWhere:`, err);\n            throw err;\n        }\n    }\n    async findOneByWhere(where, transaction, include = [], lock) {\n        try {\n            const result = await this.model.findOne({\n                where,\n                include,\n                transaction,\n                lock,\n            });\n            return result.get({ plain: true });\n        }\n        catch (err) {\n            console.error(\"DAO Error in findOneByWhere:\", err);\n            throw err;\n        }\n    }\n    async deleteByWhere(where, transaction) {\n        try {\n            return await this.model.destroy({ where, transaction });\n        }\n        catch (err) {\n            console.error(`DAO Error in deleteByWhere:`, err);\n            throw err;\n        }\n    }\n    async getCountByWhere(where) {\n        try {\n            return await this.model.count({ where });\n        }\n        catch (err) {\n            console.error(`DAO Error in getCountByWhere:`, err);\n            throw err;\n        }\n    }\n    async isDataExists(where) {\n        try {\n            const count = await this.model.count({ where });\n            return count > 0;\n        }\n        catch (err) {\n            console.error(`DAO Error in isDataExists:`, err);\n            throw err;\n        }\n    }\n}\nexports[\"default\"] = SequalizeSuperDao;\n\n\n//# sourceURL=webpack://wallet-management/./src/dao/sequalize/SuperDao.sequalize.ts?");

/***/ }),

/***/ "./src/db/database.ts":
/*!****************************!*\
  !*** ./src/db/database.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.getSequalizeClient = exports.sequelizeConnect = exports.sequelizeClient = void 0;\nconst sequelize_1 = __webpack_require__(/*! sequelize */ \"sequelize\");\nconst config_1 = __webpack_require__(/*! ../configs/config */ \"./src/configs/config.ts\");\nconst init_models_1 = __webpack_require__(/*! ../models/sequalize/init-models */ \"./src/models/sequalize/init-models.ts\");\nconst mysql2_1 = __importDefault(__webpack_require__(/*! mysql2 */ \"mysql2\"));\nconst DIALECT = \"mysql\";\nasync function sequelizeConnect() {\n    const sequelizeClientConnection = new sequelize_1.Sequelize({\n        database: config_1.config.dbName,\n        username: config_1.config.dbUser,\n        password: config_1.config.dbPass,\n        host: config_1.config.dbHost,\n        port: parseInt(config_1.config.dbPort || \"\"),\n        dialect: DIALECT,\n        dialectModule: mysql2_1.default,\n        timezone: \"+05:30\",\n        minifyAliases: false,\n    });\n    await sequelizeClientConnection.authenticate();\n    exports.sequelizeClient = sequelizeClientConnection;\n    await (0, init_models_1.initModels)(exports.sequelizeClient);\n    return sequelizeClientConnection;\n}\nexports.sequelizeConnect = sequelizeConnect;\nasync function getSequalizeClient() {\n    if (exports.sequelizeClient) {\n        return exports.sequelizeClient;\n    }\n    const mainConnection = await sequelizeConnect();\n    return mainConnection;\n}\nexports.getSequalizeClient = getSequalizeClient;\n\n\n//# sourceURL=webpack://wallet-management/./src/db/database.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst app_1 = __webpack_require__(/*! ./app */ \"./src/app.ts\");\nconst dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ \"dotenv\"));\ndotenv_1.default.config();\nconst server = new app_1.App(); // port is not needed on Vercel\nconst expressApp = (async () => {\n    await server.settings(); // make sure middlewares and routes are ready\n    return server['app']; // expose internal express Application\n})();\nmodule.exports = async (req, res) => {\n    const app = await expressApp;\n    return app(req, res); // let Vercel handle it\n};\n\n\n//# sourceURL=webpack://wallet-management/./src/index.ts?");

/***/ }),

/***/ "./src/models/sequalize/init-models.ts":
/*!*********************************************!*\
  !*** ./src/models/sequalize/init-models.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.initModels = exports.wallets = exports.transactions = void 0;\nconst transactions_1 = __webpack_require__(/*! ./transactions */ \"./src/models/sequalize/transactions.ts\");\nObject.defineProperty(exports, \"transactions\", ({ enumerable: true, get: function () { return transactions_1.transactions; } }));\nconst wallets_1 = __webpack_require__(/*! ./wallets */ \"./src/models/sequalize/wallets.ts\");\nObject.defineProperty(exports, \"wallets\", ({ enumerable: true, get: function () { return wallets_1.wallets; } }));\nfunction initModels(sequelize) {\n    const transactions = transactions_1.transactions.initModel(sequelize);\n    const wallets = wallets_1.wallets.initModel(sequelize);\n    transactions.belongsTo(wallets, { as: \"wallet\", foreignKey: \"wallet_id\" });\n    wallets.hasMany(transactions, { as: \"transactions\", foreignKey: \"wallet_id\" });\n    return {\n        transactions: transactions,\n        wallets: wallets,\n    };\n}\nexports.initModels = initModels;\n\n\n//# sourceURL=webpack://wallet-management/./src/models/sequalize/init-models.ts?");

/***/ }),

/***/ "./src/models/sequalize/transactions.ts":
/*!**********************************************!*\
  !*** ./src/models/sequalize/transactions.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.transactions = void 0;\nconst Sequelize = __importStar(__webpack_require__(/*! sequelize */ \"sequelize\"));\nconst sequelize_1 = __webpack_require__(/*! sequelize */ \"sequelize\");\nclass transactions extends sequelize_1.Model {\n    id;\n    wallet_id;\n    amount;\n    balance;\n    description;\n    type;\n    date;\n    // transactions belongsTo wallets via wallet_id\n    wallet;\n    getWallet;\n    setWallet;\n    createWallet;\n    static initModel(sequelize) {\n        return transactions.init({\n            id: {\n                type: sequelize_1.DataTypes.CHAR(36),\n                allowNull: false,\n                primaryKey: true\n            },\n            wallet_id: {\n                type: sequelize_1.DataTypes.CHAR(36),\n                allowNull: false,\n                references: {\n                    model: 'wallets',\n                    key: 'id'\n                }\n            },\n            amount: {\n                type: sequelize_1.DataTypes.DECIMAL(20, 4),\n                allowNull: false\n            },\n            balance: {\n                type: sequelize_1.DataTypes.DECIMAL(20, 4),\n                allowNull: false\n            },\n            description: {\n                type: sequelize_1.DataTypes.STRING(255),\n                allowNull: true\n            },\n            type: {\n                type: sequelize_1.DataTypes.ENUM('CREDIT', 'DEBIT'),\n                allowNull: false\n            },\n            date: {\n                type: sequelize_1.DataTypes.DATE,\n                allowNull: true,\n                defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')\n            }\n        }, {\n            sequelize,\n            tableName: 'transactions',\n            timestamps: false, underscored: true,\n            indexes: [\n                {\n                    name: \"PRIMARY\",\n                    unique: true,\n                    using: \"BTREE\",\n                    fields: [\n                        { name: \"id\" },\n                    ]\n                },\n                {\n                    name: \"idx_wallet_id\",\n                    using: \"BTREE\",\n                    fields: [\n                        { name: \"wallet_id\" },\n                    ]\n                },\n                {\n                    name: \"idx_wallet_id_date\",\n                    using: \"BTREE\",\n                    fields: [\n                        { name: \"wallet_id\" },\n                        { name: \"date\" },\n                    ]\n                },\n                {\n                    name: \"idx_type\",\n                    using: \"BTREE\",\n                    fields: [\n                        { name: \"type\" },\n                    ]\n                },\n                {\n                    name: \"idx_wallet_id_amount\",\n                    using: \"BTREE\",\n                    fields: [\n                        { name: \"wallet_id\" },\n                        { name: \"amount\" },\n                    ]\n                },\n            ]\n        });\n    }\n}\nexports.transactions = transactions;\n\n\n//# sourceURL=webpack://wallet-management/./src/models/sequalize/transactions.ts?");

/***/ }),

/***/ "./src/models/sequalize/wallets.ts":
/*!*****************************************!*\
  !*** ./src/models/sequalize/wallets.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.wallets = void 0;\nconst sequelize_1 = __webpack_require__(/*! sequelize */ \"sequelize\");\nclass wallets extends sequelize_1.Model {\n    id;\n    name;\n    balance;\n    created_at;\n    updated_at;\n    // wallets hasMany transactions via wallet_id\n    transactions;\n    getTransactions;\n    setTransactions;\n    addTransaction;\n    addTransactions;\n    createTransaction;\n    removeTransaction;\n    removeTransactions;\n    hasTransaction;\n    hasTransactions;\n    countTransactions;\n    static initModel(sequelize) {\n        return wallets.init({\n            id: {\n                type: sequelize_1.DataTypes.CHAR(36),\n                allowNull: false,\n                primaryKey: true\n            },\n            name: {\n                type: sequelize_1.DataTypes.STRING(255),\n                allowNull: false\n            },\n            balance: {\n                type: sequelize_1.DataTypes.DECIMAL(20, 4),\n                allowNull: false,\n                defaultValue: 0.0000\n            }\n        }, {\n            sequelize,\n            tableName: 'wallets',\n            timestamps: true,\n            underscored: true,\n            indexes: [\n                {\n                    name: \"PRIMARY\",\n                    unique: true,\n                    using: \"BTREE\",\n                    fields: [\n                        { name: \"id\" },\n                    ]\n                },\n                {\n                    name: \"idx_wallet_name\",\n                    using: \"BTREE\",\n                    fields: [\n                        { name: \"name\" },\n                    ]\n                },\n            ]\n        });\n    }\n}\nexports.wallets = wallets;\n\n\n//# sourceURL=webpack://wallet-management/./src/models/sequalize/wallets.ts?");

/***/ }),

/***/ "./src/routes/index.ts":
/*!*****************************!*\
  !*** ./src/routes/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst express_1 = __webpack_require__(/*! express */ \"express\");\nconst walletRoutes_1 = __importDefault(__webpack_require__(/*! ./walletRoutes */ \"./src/routes/walletRoutes.ts\"));\nconst router = (0, express_1.Router)();\nconst defaultRoutes = [\n    {\n        path: \"\",\n        route: walletRoutes_1.default,\n    },\n];\ndefaultRoutes.forEach((route) => {\n    router.use(route.path, route.route);\n});\nexports[\"default\"] = router;\n\n\n//# sourceURL=webpack://wallet-management/./src/routes/index.ts?");

/***/ }),

/***/ "./src/routes/walletRoutes.ts":
/*!************************************!*\
  !*** ./src/routes/walletRoutes.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst express_1 = __webpack_require__(/*! express */ \"express\");\nconst wallet_controller_1 = __importDefault(__webpack_require__(/*! ../controllers/wallet.controller */ \"./src/controllers/wallet.controller.ts\"));\nconst wallet_validator_1 = __importDefault(__webpack_require__(/*! ../validators/wallet.validator */ \"./src/validators/wallet.validator.ts\"));\nconst router = (0, express_1.Router)();\nconst walletController = new wallet_controller_1.default();\nconst walletValidator = new wallet_validator_1.default();\nrouter.post(\"/setup\", walletValidator.createWalletValidator, walletController.postWalletDetails);\nrouter.post(\"/transact/:walletId\", walletValidator.transactValidator, walletController.postTransaction);\nrouter.get(\"/wallet/:walletId\", walletValidator.getWalletValidator, walletController.fetchWalletDetails);\nrouter.get(\"/transactions\", walletValidator.getTransactionsValidator, walletController.fetchTransactions);\nexports[\"default\"] = router;\n\n\n//# sourceURL=webpack://wallet-management/./src/routes/walletRoutes.ts?");

/***/ }),

/***/ "./src/services/wallet.service.ts":
/*!****************************************!*\
  !*** ./src/services/wallet.service.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst http_status_1 = __importDefault(__webpack_require__(/*! http-status */ \"http-status\"));\nconst SuperDao_sequalize_1 = __importDefault(__webpack_require__(/*! ../dao/sequalize/SuperDao.sequalize */ \"./src/dao/sequalize/SuperDao.sequalize.ts\"));\nconst wallets_1 = __webpack_require__(/*! ../models/sequalize/wallets */ \"./src/models/sequalize/wallets.ts\");\nconst responseHandler_1 = __importDefault(__webpack_require__(/*! ../utils/responseHandler */ \"./src/utils/responseHandler.ts\"));\nconst uuid_1 = __webpack_require__(/*! uuid */ \"uuid\");\nconst transactions_1 = __webpack_require__(/*! ../models/sequalize/transactions */ \"./src/models/sequalize/transactions.ts\");\n// import _ from 'lodash';\nclass WalletService {\n    constructor() { }\n    async createWallet(name, balance, transaction) {\n        try {\n            const walletId = (0, uuid_1.v4)();\n            const walletDao = new SuperDao_sequalize_1.default(wallets_1.wallets);\n            const transactionDao = new SuperDao_sequalize_1.default(transactions_1.transactions);\n            const newWallet = await walletDao.create({\n                id: walletId,\n                name,\n                balance: balance.toFixed(4),\n            }, transaction);\n            await transactionDao.create({\n                id: (0, uuid_1.v4)(),\n                wallet_id: walletId,\n                amount: balance.toFixed(4),\n                balance: balance.toFixed(4),\n                description: \"Setup\",\n                type: \"CREDIT\",\n            }, transaction);\n            return responseHandler_1.default.returnSuccess(http_status_1.default.OK, \"Wallet created\", {\n                id: walletId,\n                balance,\n                name,\n                transactionId: null,\n                date: newWallet.createdAt,\n            });\n        }\n        catch (e) {\n            console.error(\"Create Wallet Error:\", e);\n            return responseHandler_1.default.returnError(http_status_1.default.INTERNAL_SERVER_ERROR, \"Failed to create wallet\");\n        }\n    }\n    async transact(walletId, amount, description, transaction) {\n        try {\n            const walletDao = new SuperDao_sequalize_1.default(wallets_1.wallets);\n            const transactionDao = new SuperDao_sequalize_1.default(transactions_1.transactions);\n            const wallet = await walletDao.findOneByWhere({ id: walletId }, transaction, [], transaction.LOCK.UPDATE);\n            const currentBalance = parseFloat(wallet.balance.toString());\n            const newBalance = parseFloat((currentBalance + amount).toFixed(4));\n            if (newBalance < 0) {\n                return responseHandler_1.default.returnError(http_status_1.default.BAD_REQUEST, \"Insufficient balance\");\n            }\n            // Record transaction\n            const txn = await transactionDao.create({\n                id: (0, uuid_1.v4)(),\n                wallet_id: walletId,\n                amount: amount.toFixed(4),\n                balance: newBalance.toFixed(4),\n                description,\n                type: amount > 0 ? \"CREDIT\" : \"DEBIT\",\n            }, transaction);\n            // Update wallet balance\n            const updateResponse = await walletDao.updateWhere({ balance: newBalance.toFixed(4) }, { id: walletId }, transaction);\n            if (!txn || !updateResponse) {\n                return responseHandler_1.default.returnError(http_status_1.default.INTERNAL_SERVER_ERROR, \"Transaction failed\");\n            }\n            return responseHandler_1.default.returnSuccess(http_status_1.default.OK, \"Transaction successful\", {\n                transactionId: txn.id,\n                balance: newBalance,\n            });\n        }\n        catch (err) {\n            console.error(\"Transaction error:\", err);\n            return responseHandler_1.default.returnError(http_status_1.default.INTERNAL_SERVER_ERROR, \"Transaction processing failed\");\n        }\n    }\n    async getWalletById(walletId) {\n        try {\n            const walletDao = new SuperDao_sequalize_1.default(wallets_1.wallets);\n            const wallet = await walletDao.findByWhere({ id: walletId });\n            console.log(wallet, walletId);\n            if (!wallet || wallet.length === 0) {\n                return responseHandler_1.default.returnError(http_status_1.default.NOT_FOUND, \"Wallet not found\");\n            }\n            const { id, balance, name, createdAt } = wallet[0];\n            return responseHandler_1.default.returnSuccess(http_status_1.default.OK, \"Wallet fetched\", {\n                id,\n                balance: parseFloat(balance),\n                name,\n                date: createdAt,\n            });\n        }\n        catch (err) {\n            console.error(\"Get Wallet Error:\", err);\n            return responseHandler_1.default.returnError(http_status_1.default.INTERNAL_SERVER_ERROR, \"Failed to fetch wallet\");\n        }\n    }\n    async getWalletTransactions(walletId, skip = 0, limit = 10) {\n        try {\n            const transactionDao = new SuperDao_sequalize_1.default(transactions_1.transactions);\n            const transactionList = await transactionDao.findByWhere({ wallet_id: walletId }, [], {\n                order: [[\"date\", \"DESC\"]],\n                offset: skip,\n                limit,\n            });\n            const result = transactionList.map((txn) => ({\n                id: txn.id,\n                walletId: txn.wallet_id,\n                amount: parseFloat(txn.amount),\n                balance: parseFloat(txn.balance),\n                description: txn.description,\n                date: txn.date,\n                type: txn.type,\n            }));\n            return responseHandler_1.default.returnSuccess(http_status_1.default.OK, \"Transactions fetched\", result);\n        }\n        catch (err) {\n            console.error(\"Fetch Transactions Error:\", err);\n            return responseHandler_1.default.returnError(http_status_1.default.INTERNAL_SERVER_ERROR, \"Failed to fetch transactions\");\n        }\n    }\n}\nexports[\"default\"] = WalletService;\n\n\n//# sourceURL=webpack://wallet-management/./src/services/wallet.service.ts?");

/***/ }),

/***/ "./src/utils/responseHandler.ts":
/*!**************************************!*\
  !*** ./src/utils/responseHandler.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst logError = (err) => {\n    console.error(err);\n};\nconst logErrorMiddleware = (err, req, res, next) => {\n    logError(err);\n    next(err);\n};\nconst returnError = (statusCode, message) => {\n    const response = {\n        statusCode,\n        response: {\n            status: false,\n            code: statusCode,\n            message,\n        },\n    };\n    return response;\n};\nconst returnSuccess = (statusCode, message, data) => {\n    const response = {\n        statusCode,\n        response: {\n            status: true,\n            code: statusCode,\n            message,\n            data,\n        },\n    };\n    return response;\n};\nconst getPaginationData = (rows, page, limit) => {\n    const { count: totalItems, rows: data } = rows;\n    const currentPage = page ? +page : 0;\n    const totalPages = Math.ceil(totalItems / limit);\n    const response = {\n        totalItems,\n        data,\n        totalPages,\n        currentPage,\n    };\n    return response;\n};\nexports[\"default\"] = {\n    logError,\n    logErrorMiddleware,\n    returnError,\n    returnSuccess,\n    getPaginationData,\n};\n\n\n//# sourceURL=webpack://wallet-management/./src/utils/responseHandler.ts?");

/***/ }),

/***/ "./src/utils/validator.ts":
/*!********************************!*\
  !*** ./src/utils/validator.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.validatorWrapper = void 0;\nfunction validatorWrapper(schema, data) {\n    const { value, error } = schema.validate(data, {\n        abortEarly: false,\n        allowUnknown: false,\n        stripUnknown: true,\n        convert: true,\n    });\n    if (error) {\n        const errorMessage = error.details.map((d) => d.message).join(\", \");\n        throw new Error(errorMessage);\n    }\n    return value;\n}\nexports.validatorWrapper = validatorWrapper;\n\n\n//# sourceURL=webpack://wallet-management/./src/utils/validator.ts?");

/***/ }),

/***/ "./src/validators/wallet.validator.ts":
/*!********************************************!*\
  !*** ./src/validators/wallet.validator.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst joi_1 = __importDefault(__webpack_require__(/*! joi */ \"joi\"));\nconst http_status_1 = __importDefault(__webpack_require__(/*! http-status */ \"http-status\"));\nconst validator_1 = __webpack_require__(/*! ../utils/validator */ \"./src/utils/validator.ts\");\nclass WalletValidator {\n    async createWalletValidator(req, res, next) {\n        try {\n            const schema = joi_1.default.object({\n                name: joi_1.default.string().trim().required(),\n                balance: joi_1.default.number().precision(4).min(0).required(),\n            });\n            req.body = (0, validator_1.validatorWrapper)(schema, req.body);\n            next();\n        }\n        catch (err) {\n            res.status(http_status_1.default.BAD_REQUEST).json({\n                status: false,\n                message: err.message || \"Invalid wallet data\",\n            });\n        }\n    }\n    async transactValidator(req, res, next) {\n        try {\n            const bodySchema = joi_1.default.object({\n                amount: joi_1.default.number().precision(4).required(),\n                description: joi_1.default.string().required(),\n            });\n            const paramsSchema = joi_1.default.object({\n                walletId: joi_1.default.string().guid({ version: \"uuidv4\" }).required(),\n            });\n            req.body = (0, validator_1.validatorWrapper)(bodySchema, req.body);\n            req.params = (0, validator_1.validatorWrapper)(paramsSchema, req.params);\n            next();\n        }\n        catch (err) {\n            res.status(http_status_1.default.BAD_REQUEST).json({\n                status: false,\n                message: err.message || \"Invalid transaction input\",\n            });\n        }\n    }\n    async getWalletValidator(req, res, next) {\n        try {\n            const schema = joi_1.default.object({\n                walletId: joi_1.default.string().guid({ version: \"uuidv4\" }).required(),\n            });\n            req.params = (0, validator_1.validatorWrapper)(schema, req.params);\n            next();\n        }\n        catch (err) {\n            res.status(http_status_1.default.BAD_REQUEST).json({\n                status: false,\n                message: err.message || \"Invalid wallet ID\",\n            });\n        }\n    }\n    async getTransactionsValidator(req, res, next) {\n        try {\n            const schema = joi_1.default.object({\n                walletId: joi_1.default.string().guid({ version: \"uuidv4\" }).required(),\n                skip: joi_1.default.number().integer().min(0).optional(),\n                limit: joi_1.default.number().integer().min(1).max(100).optional(),\n            });\n            req.query = (0, validator_1.validatorWrapper)(schema, req.query);\n            next();\n        }\n        catch (err) {\n            res.status(http_status_1.default.BAD_REQUEST).json({\n                status: false,\n                message: err.message || \"Invalid query params\",\n            });\n        }\n    }\n}\nexports[\"default\"] = WalletValidator;\n\n\n//# sourceURL=webpack://wallet-management/./src/validators/wallet.validator.ts?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "dotenv/config":
/*!********************************!*\
  !*** external "dotenv/config" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "http-status":
/*!******************************!*\
  !*** external "http-status" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("http-status");

/***/ }),

/***/ "joi":
/*!**********************!*\
  !*** external "joi" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("joi");

/***/ }),

/***/ "mysql2":
/*!*************************!*\
  !*** external "mysql2" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("mysql2");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("sequelize");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
