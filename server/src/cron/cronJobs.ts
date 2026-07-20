import cron from "node-cron";



// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running Daily Cleanup Job...");
});



// Run every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running Hourly Analytics Job...");
});



// Run every minute
cron.schedule("* * * * *", async () => {
  console.log("Cron Job Working...");
});



console.log("Cron Jobs Started Successfully");