import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

const BACKUP_DIR = path.join(process.cwd(), "backups");
const DB_NAME = process.env.DB_NAME || "mydatabase";
const MONGODB_URI = process.env.MONGODB_URI2 || "";
const USERNAME = process.env.MONGODB_USERNAME || "";
const PASSWORD = process.env.MONGODB_PASSWORD || "";

if (!MONGODB_URI || !USERNAME || !PASSWORD) {
  throw new Error(
    "Please define MONGODB_URI, MONGODB_USERNAME, and MONGODB_PASSWORD environment variables inside .env.local"
  );
}

// Ensure the backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

export async function POST() {
  const date = new Date().toISOString().slice(0, 10);
  const backupPath = path.join(BACKUP_DIR, `${DB_NAME}-${date}.gz`);

  // Construct the mongodump command
  const command = `mongorestore --uri="${MONGODB_URI}" --gzip --archive=${backupPath}`;
  console.log(command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating backup: ${stderr}`);
      return NextResponse.json({ message: "Backup failed", error: stderr });
    }
    console.log(`Restore Completed at ${backupPath}`);
    return NextResponse.json({
      message: "Restore Completed",
      path: backupPath,
    });
  });
  return NextResponse.json({ message: "Restore Completed", path: backupPath });
}

// mongorestore --uri="mongodb+srv://nextjsgoudmu:0RuUR1gErDLLpnPD@workshop1.bjrwb5h.mongodb.net/workshop1" --gzip --archive=C:\Users\goudm\OneDrive\Documents\JS\project18workshop\workshop1\backups\workshop1-2024-07-05.gz
// mongorestore --uri="mongodb+srv://nextjsgoudmu:0RuUR1gErDLLpnPD@workshop1.bjrwb5h.mongodb.net/workshop1" --gzip --archive=C:\Users\goudm\OneDrive\Documents\JS\project18workshop\workshop1\backups\workshop1-2024-07-05.gz --nsInclude=workshop1.workshop1
