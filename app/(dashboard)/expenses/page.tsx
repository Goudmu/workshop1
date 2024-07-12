import FormExpenses from "@/components/own/expenses/formExpense";
import TableExpense from "@/components/own/expenses/tableExpense";
import RefreshClient from "@/components/own/refreshClient";
import {
  AccountForExpenses,
  getExpense,
} from "@/lib/mongodb/actions/expenseAction";
import React from "react";

export const revalidate = 60;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const getExpensesAccount = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}api/expenses`, {
    cache: "no-store",
  });
  const { expenses } = await res.json();
  return expenses;
};

const ExpensePage = async () => {
  const expenses = await getExpensesAccount();
  const res = await AccountForExpenses();
  const { cashAccount } = await res?.json();
  const resTable = await getExpense();
  const { thisExpenses } = await resTable?.json();

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col gap-10">
      <div>
        <RefreshClient />
      </div>
      <div>
        <FormExpenses expenses={expenses} cashAccount={cashAccount} />
      </div>
      <div>
        <TableExpense thisExpenses={thisExpenses} />
      </div>
    </div>
  );
};

export default ExpensePage;
