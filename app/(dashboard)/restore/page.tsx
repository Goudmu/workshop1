"use client";
import { useState } from "react";

const RestorePage = () => {
  const [message, setMessage] = useState<string>("");

  const handleRestore = async () => {
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

  return (
    <div>
      <h1>Restore Database</h1>
      <button onClick={handleRestore}>Restore Now</button>
      <p>{message}</p>
    </div>
  );
};

export default RestorePage;
