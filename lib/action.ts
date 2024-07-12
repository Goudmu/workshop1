"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateAll() {
  revalidatePath("/api/expenses");
  revalidatePath("/api/dashboard");
}
