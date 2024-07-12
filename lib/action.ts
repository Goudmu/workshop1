"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export default async function revalidateAllPath() {
  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  revalidateTag("expenses");
}
