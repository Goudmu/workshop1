"use client";
import { BackUpFileInfo } from "@/app/api/backup/route";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

const BackupPage = () => {
  const [backups, setBackups] = useState<BackUpFileInfo[]>([]);
  const [message, setMessage] = useState<string>("");

  const getBackupsData = async () => {
    const res = await fetch("/api/backup", { cache: "no-store" });
    const { filesInfo } = await res.json();
    setBackups(filesInfo);
  };

  const handleBackup = async () => {
    setMessage("Starting backup...");
    try {
      const response = await fetch("/api/backup", {
        method: "POST",
      });

      if (!response.ok) {
        const result = await response.json();
        setMessage(`Backup failed: ${result.error}`);
        return;
      }

      const { message } = await response.json();
      getBackupsData();
      setMessage(`Backup successful: ${message}`);
    } catch (error: any) {
      setMessage(`Backup failed: ${error.message}`);
    }
  };

  const deleteHandler = async (file: BackUpFileInfo) => {
    try {
      const res = await fetch("/api/backup", {
        method: "DELETE",
        body: JSON.stringify(file),
      });
      if (res.ok) {
        getBackupsData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const restoreHandler = async () => {
    setMessage("Starting Restore...");
    try {
      const response = await fetch("/api/restore", {
        method: "POST",
      });

      if (!response.ok) {
        const result = await response.json();
        setMessage(`Restore failed: ${result.error}`);
        return;
      }

      const { message } = await response.json();
      setMessage(`Restore successful: ${message}`);
    } catch (error: any) {
      setMessage(`Restore failed: ${error.message}`);
    }
  };

  useEffect(() => {
    getBackupsData();
  }, []);

  return (
    <div>
      <h1>Backup Database</h1>
      <button onClick={handleBackup}>Backup Now</button>
      <p>{message}</p>
      {/* TABLE */}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Full Path</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="hidden md:table-cell">Restore</TableHead>
              <TableHead className="hidden md:table-cell">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backups.map((file, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{file.name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {file.fullPath}
                </TableCell>
                <TableCell className="text-right">
                  {(file.sizeInBytes / 1024).toFixed(2)} KB
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {new Date(file.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  <Button size="sm" onClick={restoreHandler}>
                    Restore
                  </Button>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteHandler(file)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BackupPage;
