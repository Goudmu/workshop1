"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { capitalizeFirstLetter, sortAccountsByID } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { TrashIcon } from "@/lib/icon/icon";
import { IAccount } from "@/lib/mongodb/models/Account";
import AlertDelete from "../alertDelete";
import { useRouter } from "next/navigation";
import { revalidateAll } from "@/lib/action";

export default function TableAndFormAccountComponent() {
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [newAccount, setNewAccount] = useState({
    accountID: "",
    name: "",
    balance: "debit",
    amount: 0,
  });
  const router = useRouter();

  const getData = async () => {
    const res = await fetch("/api/account?id=", { cache: "no-store" });
    const { account } = await res.json();
    setAccounts(sortAccountsByID(account));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleInputChange = (e: any) => {
    setNewAccount({
      ...newAccount,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/account", {
        method: "POST",
        body: JSON.stringify(newAccount),
      });
      if (res.ok) {
        getData();
        toast({
          title: "Akun Berhasil Ditambahkan",
        });
        // VERCEL
        await revalidateAll();
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    } finally {
      router.refresh();
    }
    setNewAccount({
      accountID: "",
      name: "",
      balance: "debit",
      amount: 0,
    });
  };

  const deleteHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
        body: JSON.stringify({ _id: e.currentTarget.id }),
      });
      if (res.ok) {
        getData();
        toast({
          title: "Akun Berhasil Dihapus",
        });
        // VERCEL
        await revalidateAll();
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* FORM */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Add New Account ?</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Accounting Form</CardTitle>
                <CardDescription>
                  Enter your account information below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountID">Account ID</Label>
                      <Input
                        id="accountID"
                        name="accountID"
                        type="text"
                        value={newAccount.accountID}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={newAccount.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="balance">Debit/Credit</Label>
                      <Select
                        value={newAccount.balance}
                        onValueChange={(e: any) =>
                          setNewAccount({
                            ...newAccount,
                            balance: e,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debit">Debit</SelectItem>
                          <SelectItem value="credit">Credit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit">Add Account</Button>
                </form>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Debit/Credit</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Edit / Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account, index) => (
                <TableRow key={index}>
                  <TableCell className=" py-1">{account.accountID}</TableCell>
                  <TableCell className=" py-1">
                    {capitalizeFirstLetter(account.name)}
                  </TableCell>
                  <TableCell className=" py-1">
                    {capitalizeFirstLetter(account.balance)}
                  </TableCell>
                  <TableCell className=" py-1">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(account.amount)}
                  </TableCell>
                  <TableCell className=" py-1">
                    <AlertDelete
                      deleteFuntion={deleteHandler}
                      id={account._id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
