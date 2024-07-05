import path from "path";
import fs from "fs";
import { MongoClient } from "mongodb";
import archiver from "archiver";
import zlib from "zlib";
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

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collections = await db.collections();

    const output = fs.createWriteStream(backupPath);
    const gzip = zlib.createGzip();

    output.on("close", () => {
      console.log("Backup file size:", fs.statSync(backupPath).size);
      console.log("Backup created successfully");
    });

    gzip.on("error", (err) => {
      throw err;
    });

    gzip.pipe(output);

    for (const collection of collections) {
      const documents = await collection.find({}).toArray();
      const collectionData = JSON.stringify(documents);
      gzip.write(collectionData);
    }

    gzip.end();

    await client.close();

    return NextResponse.json({ message: "Backup created successfully" });
  } catch (error) {
    console.error("Error during backup:", error);
    await client.close();
    return NextResponse.json({ message: "Backup failed" }, { status: 500 });
  }
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
