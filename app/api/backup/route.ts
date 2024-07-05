import { NextApiResponse } from "next";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";

export interface BackUpFileInfo {
  name: string;
  fullPath: string;
  sizeInBytes: number;
  createdAt: Date;
}

const BACKUP_DIR = path.join(process.cwd(), "backups");
const DB_NAME = process.env.DB_NAME || "mydatabase";
const MONGODB_URI = process.env.MONGODB_URI2 || "";
const USERNAME = process.env.MONGODB_USERNAME || "";
const PASSWORD = process.env.MONGODB_PASSWORD || "";
const execAsync = promisify(exec);

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

  // Construct the mongodump command
  const command = `mongodump --uri="${MONGODB_URI}" --gzip --archive=./backups/${DB_NAME}-${date}.gz`;

  // Execute the command
  await execAsync(command);

  return NextResponse.json({ message: "good" });
}

export async function GET() {
  const folderPath = "./backups/";
  try {
    const filesInfo: BackUpFileInfo[] = [];

    const fileNames = fs.readdirSync(folderPath);

    fileNames.forEach((fileName) => {
      const fullPath = path.join(folderPath, fileName);
      const stats = fs.statSync(fullPath);

      const BackUpFileInfo: BackUpFileInfo = {
        name: fileName,
        fullPath: fullPath,
        sizeInBytes: stats.size,
        createdAt: stats.birthtime, // You can also use `stats.mtime` for last modified time
      };

      filesInfo.push(BackUpFileInfo);
    });

    return NextResponse.json({ filesInfo });
  } catch (error) {
    console.error("Error reading directory:", error);
  }
}

export async function DELETE(req: NextRequest) {
  const folderPath = "./backups/";
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ message: "File name is required" });
  }

  const filePath = path.join(folderPath, name);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ message: "File deleted successfully" });
    } else {
      return NextResponse.json({ message: "File not found" });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ message: "Error deleting file" });
  }
}
