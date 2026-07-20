"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
// Run every day at midnight
node_cron_1.default.schedule("0 0 * * *", async () => {
    console.log("Running Daily Cleanup Job...");
});
// Run every hour
node_cron_1.default.schedule("0 * * * *", async () => {
    console.log("Running Hourly Analytics Job...");
});
// Run every minute
node_cron_1.default.schedule("* * * * *", async () => {
    console.log("Cron Job Working...");
});
console.log("Cron Jobs Started Successfully");
