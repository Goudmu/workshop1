import { exec } from "child_process";
import path from "path";
import cron from "node-cron";

const BACKUP_DIR = path.join(__dirname, "..", "backups");
const DB_NAME = process.env.DB_NAME || "mydatabase";
const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

function backupDatabase() {
  const date = new Date().toISOString().slice(0, 10);
  const backupPath = path.join(BACKUP_DIR, `${DB_NAME}-${date}.gz`);
  const command = `mongodump --uri=${MONGODB_URI} --gzip --archive=${backupPath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating backup: ${stderr}`);
      return;
    }
    console.log(`Backup created at ${backupPath}`);
  });
}

// Schedule the backup to run daily at midnight
cron.schedule("0 0 * * *", backupDatabase);
