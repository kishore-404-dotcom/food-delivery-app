"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailService = void 0;
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const sendMailService = async (to, subject, html) => {
    await (0, sendEmail_1.default)({
        to,
        subject,
        html,
    });
};
exports.sendMailService = sendMailService;
