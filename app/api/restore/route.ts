import fs from "fs";
import path from "path";
import zlib from "zlib";
import { MongoClient, ObjectId } from "mongodb";
import { promisify } from "util";
import { NextResponse } from "next/server";

const BACKUP_DIR = path.join(process.cwd(), "backups");
const DB_NAME = process.env.DB_NAME || "mydatabase";
const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI environment variable inside .env.local"
  );
}

const gunzipAsync = promisify(zlib.gunzip);

interface BackUpFileInfo {
  name: string;
  fullPath: string;
  sizeInBytes: number;
  createdAt: Date;
}

export async function POST() {
  const backupPath = path.join(BACKUP_DIR, "workshop1-2024-07-05.gz");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // Read compressed data from file
    const compressedData = await fs.promises.readFile(backupPath);

    // Decompress data
    const jsonData = await gunzipAsync(compressedData);

    // Parse JSON data
    const collectionsData = JSON.parse(jsonData.toString());

    // Restore data into respective collections
    for (const collectionName in collectionsData) {
      if (
        Object.prototype.hasOwnProperty.call(collectionsData, collectionName)
      ) {
        const documents = collectionsData[collectionName];
        const collection = db.collection(collectionName);

        // Insert documents with ObjectId for _id and convert debits and credits arrays
        for (const document of documents) {
          try {
            // Convert _id to ObjectId if it's a string
            if (typeof document._id === "string") {
              document._id = ObjectId.createFromHexString(document._id);
            }

            // Convert date string to Date object with time set to 00:00:00.000
            if (typeof document.date === "string") {
              document.date = new Date(document.date); // Assuming date is in ISO format
            }

            // Convert debits and credits arrays
            if (Array.isArray(document.debits)) {
              document.debits.forEach((debit: any) => {
                if (typeof debit._id === "string") {
                  debit._id = ObjectId.createFromHexString(debit._id);
                }
              });
            }

            if (Array.isArray(document.credits)) {
              document.credits.forEach((credit: any) => {
                if (typeof credit._id === "string") {
                  credit._id = ObjectId.createFromHexString(credit._id);
                }
              });
            }

            // Insert document into collection
            await collection.insertOne(document);
            console.log(`Inserted document with _id: ${document._id}`);
          } catch (error: any) {
            // Handle duplicate key error
            if (error.code === 11000) {
              console.warn(
                `Skipping duplicate document with _id: ${document._id}`
              );
            } else {
              throw error;
            }
          }
        }

        console.log(
          `Restored ${documents.length} documents into ${collectionName}`
        );
      }
    }

    return NextResponse.json({
      message: "Restore completed successfully",
      path: backupPath,
    });
  } catch (error) {
    console.error("Error during restore:", error);
    throw error;
  } finally {
    await client.close();
  }
}
