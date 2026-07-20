"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dataBase_1 = __importDefault(require("./config/dataBase"));
const env_1 = require("./config/env");
// Connect to MongoDB
(0, dataBase_1.default)();
// Start server
app_1.default.listen(env_1.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env_1.PORT}`);
});
