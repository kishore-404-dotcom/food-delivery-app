"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCache = exports.setCache = exports.getCache = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const getCache = async (key) => {
    return await redis_1.default.get(key);
};
exports.getCache = getCache;
const setCache = async (key, value, expiry = 3600) => {
    await redis_1.default.set(key, JSON.stringify(value), {
        EX: expiry,
    });
};
exports.setCache = setCache;
const deleteCache = async (key) => {
    await redis_1.default.del(key);
};
exports.deleteCache = deleteCache;
