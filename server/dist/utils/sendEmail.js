"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("../config/mail"));
const env_1 = require("../config/env");
const sendEmail = async ({ to, subject, html, }) => {
    await mail_1.default.sendMail({
        from: env_1.EMAIL_USER,
        to,
        subject,
        html,
    });
};
exports.default = sendEmail;
