"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const RefreshClient = () => {
  const router = useRouter();

  return <Button onClick={() => router.refresh()}>Refresh</Button>;
};

export default RefreshClient;
