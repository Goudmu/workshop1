import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IAccount } from "./mongodb/models/Account";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  if (string == undefined) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sortAccountsByID(accounts: IAccount[]): IAccount[] {
  return accounts.sort((a, b) => a.accountID.localeCompare(b.accountID));
}

export const uuidToId = (uuid: any) => {
  const hash = uuid.split("-").join("");
  return parseInt(hash.substr(0, 8), 16);
};

export function commafy(num: number) {
  var str = num.toString().split(",");
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1.");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ");
  }
  return str.join(",");
}

export function IDRFormat(num: number) {
  const converted = new Intl.NumberFormat("id", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
  return converted;
}

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getDayName = (date: Date, locale: string): string => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString(locale, { weekday: "long" });
};

export const WIBOptions = {
  timeZone: "Asia/Jakarta",
  hour12: false, // 24-hour format
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};
