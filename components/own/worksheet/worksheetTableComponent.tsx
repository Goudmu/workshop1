"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter, sortAccountsByID } from "@/lib/utils";
import { IAccount } from "@/lib/mongodb/models/Account";
import { IGeneralLedger } from "@/lib/mongodb/models/GeneralLedger";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon } from "lucide-react";
import { GetWorksheetData } from "@/lib/mongodb/actions/worksheetAction";

export default function WorksheetTableComponent() {
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(0, 0, 0, 1);
    return endOfDay;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 59);
    return endOfDay;
  });
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [ledgerEntries, setledgerEntries] = useState<IGeneralLedger[]>([]);
  const [adjustEntries, setadjustEntries] = useState<IGeneralLedger[]>([]);
  const [closingEntries, setclosingEntries] = useState<IGeneralLedger[]>([]);
  const [totalDebitledgerEntries, settotalDebitledgerEntries] = useState(0);
  const [totalCreditledgerEntries, settotalCreditledgerEntries] = useState(0);
  const [totalDebitledgerAdjust, settotalDebitledgerAdjust] = useState(0);
  const [totalCreditledgerAdjust, settotalCreditledgerAdjust] = useState(0);
  const [totalDebitledgerClosing, settotalDebitledgerClosing] = useState(0);
  const [totalCreditledgerClosing, settotalCreditledgerClosing] = useState(0);
  const [totalDebitReportRL, settotalDebitReportRL] = useState(0);
  const [totalCreditReportRL, settotalCreditReportRL] = useState(0);
  const [totalDebitNeraca, settotalDebitNeraca] = useState(0);
  const [totalCreditNeraca, settotalCreditNeraca] = useState(0);
  const [totalCreditRetainedEarning, settotalCreditRetainedEarning] =
    useState(0);
  const [trigger, setTrigger] = useState(false);

  const startDateHandler = (e: any) => {
    setStartDate(e);
  };
  const endDateHandler = (e: any) => {
    setEndDate(e);
  };

  const getDataAccount = async () => {
    const res = await fetch("/api/account?id=", { cache: "no-store" });
    const { account } = await res.json();
    setAccounts(sortAccountsByID(account));
  };

  const getDataGeneralLedger = async () => {
    let newtotalDebitledgerEntries = 0;
    let newtotalCreditledgerEntries = 0;
    let newtotalDebitadjustEntries = 0;
    let newtotalCreditadjustEntries = 0;
    let newtotalDebitclosingEntries = 0;
    let newtotalCreditclosingEntries = 0;
    let newtotalDebitReportRL = 0;
    let newtotalCreditReportRL = 0;
    let newtotalDebitNeraca = 0;
    let newtotalCreditNeraca = 0;

    const { generalLedger, accounts, adjustLedger, closingLedger }: any =
      await GetWorksheetData({ startDate, endDate });

    // GENERAL LEDGER
    generalLedger.map((dataLedger: IGeneralLedger) => {
      dataLedger.debits.map((dataDebits: any) => {
        newtotalDebitledgerEntries += dataDebits.amount;
        if (["4", "5"].includes(dataDebits.accountID.substring(0, 1))) {
          newtotalDebitReportRL += dataDebits.amount;
        } else if (["1"].includes(dataDebits.accountID.substring(0, 1))) {
          newtotalDebitNeraca += dataDebits.amount;
        } else if (["2", "3"].includes(dataDebits.accountID.substring(0, 1))) {
          newtotalCreditNeraca -= dataDebits.amount;
        }
        dataDebits.accountName = dataDebits.name;
        return;
      });
      dataLedger.credits.map((dataCredits: any) => {
        newtotalCreditledgerEntries += dataCredits.amount;
        if (["4", "5"].includes(dataCredits.accountID.substring(0, 1))) {
          newtotalCreditReportRL += dataCredits.amount;
        } else if (["2", "3"].includes(dataCredits.accountID.substring(0, 1))) {
          newtotalCreditNeraca += dataCredits.amount;
        } else if (["1"].includes(dataCredits.accountID.substring(0, 1))) {
          newtotalDebitNeraca -= dataCredits.amount;
        }
        dataCredits.accountName = dataCredits.name;
        return;
      });
    });

    // ADJUST LEDGER
    adjustLedger.map((dataAdjustLedger: IGeneralLedger) => {
      dataAdjustLedger.debits.map((dataDebits: any) => {
        newtotalDebitadjustEntries += dataDebits.amount;
        accounts.map((dataAccount: any) => {
          if (dataAccount._id.toString() == dataDebits.accountID) {
            if (["4", "5"].includes(dataAccount.accountID.substring(0, 1))) {
              newtotalDebitReportRL += dataDebits.amount;
            } else if (["1"].includes(dataAccount.accountID.substring(0, 1))) {
              newtotalDebitNeraca += dataDebits.amount;
            } else if (
              ["2", "3"].includes(dataAccount.accountID.substring(0, 1))
            ) {
              newtotalCreditNeraca -= dataDebits.amount;
            }
            dataDebits.accountName = dataAccount.name;
            return;
          }
        });
      });
      dataAdjustLedger.credits.map((dataCredits: any) => {
        newtotalCreditadjustEntries += dataCredits.amount;
        accounts.map((dataAccount: any) => {
          if (dataAccount._id.toString() == dataCredits.accountID) {
            if (["4", "5"].includes(dataAccount.accountID.substring(0, 1))) {
              newtotalCreditReportRL += dataCredits.amount;
            } else if (
              ["2", "3"].includes(dataAccount.accountID.substring(0, 1))
            ) {
              newtotalCreditNeraca += dataCredits.amount;
            } else if (["1"].includes(dataAccount.accountID.substring(0, 1))) {
              newtotalDebitNeraca -= dataCredits.amount;
            }
            dataCredits.accountName = dataAccount.name;
            return;
          }
        });
      });
    });

    // CLOSING LEDGER
    closingLedger.map((dataClosingLedger: IGeneralLedger) => {
      dataClosingLedger.debits.map((dataDebit) => {
        accounts.map((dataAccount: IAccount) => {
          if (dataDebit.accountID == dataAccount.accountID) {
            if (
              ["4", "5", "3"].includes(dataAccount.accountID.substring(0, 1))
            ) {
              newtotalCreditclosingEntries += dataDebit.amount;
            }
          }
        });
      });
      dataClosingLedger.credits.map((dataCredit) => {
        accounts.map((dataAccount: IAccount) => {
          if (dataCredit.accountID == dataAccount.accountID) {
            if (
              ["4", "5", "3"].includes(dataAccount.accountID.substring(0, 1))
            ) {
              newtotalDebitclosingEntries += dataCredit.amount;
            }
          }
        });
      });
    });
    settotalDebitledgerClosing(newtotalDebitclosingEntries);
    settotalCreditledgerClosing(newtotalCreditclosingEntries);

    // ADD RETAINED EARNING TO NERACA
    newtotalDebitNeraca += newtotalDebitadjustEntries - newtotalCreditReportRL;

    newtotalCreditNeraca +=
      newtotalCreditReportRL -
      newtotalDebitReportRL +
      newtotalDebitadjustEntries -
      newtotalCreditReportRL;

    settotalDebitledgerEntries(newtotalDebitledgerEntries);
    settotalCreditledgerEntries(newtotalCreditledgerEntries);
    settotalDebitledgerAdjust(newtotalDebitadjustEntries);
    settotalCreditledgerAdjust(newtotalCreditadjustEntries);
    settotalDebitReportRL(newtotalDebitReportRL - newtotalDebitadjustEntries);
    settotalCreditReportRL(newtotalCreditReportRL + newtotalCreditReportRL);
    settotalCreditRetainedEarning(
      newtotalCreditReportRL -
        newtotalDebitReportRL +
        newtotalDebitadjustEntries -
        newtotalCreditReportRL
    );
    settotalDebitNeraca(newtotalDebitNeraca);
    settotalCreditNeraca(newtotalCreditNeraca);

    setledgerEntries(generalLedger);
    setadjustEntries(adjustLedger);
    setclosingEntries(closingLedger);
  };

  useEffect(() => {
    getDataGeneralLedger();
    getDataAccount();
  }, [trigger]);

  return (
    <div className="rounded-lg overflow-auto my-10 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 font-normal"
            >
              <CalendarDaysIcon className="h-4 w-4" />
              <span>{startDate?.toDateString()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onDayClick={(e) => startDateHandler(e)}
              selected={startDate}
            />
          </PopoverContent>
        </Popover>
        <span className="text-muted-foreground">to</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 font-normal"
            >
              <CalendarDaysIcon className="h-4 w-4" />
              <span>{endDate?.toDateString()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onDayClick={(e) => endDateHandler(e)}
              selected={endDate}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={getDataGeneralLedger}>Filter</Button>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Work Sheet Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className=" w-[3%]">Account ID</TableHead>
                  <TableHead className=" w-[7%]">Name Account</TableHead>
                  <TableHead className="text-center w-[19%]" colSpan={2}>
                    Jurnal Umum
                  </TableHead>
                  <TableHead className="text-center w-[19%]" colSpan={2}>
                    Jurnal Penyesuaian
                  </TableHead>
                  <TableHead className="text-center w-[19%]" colSpan={2}>
                    Laporan Laba Rugi
                  </TableHead>
                  <TableHead className="text-center w-[19%]" colSpan={2}>
                    Laporan Penutup
                  </TableHead>
                  <TableHead className="text-center w-[19%]" colSpan={2}>
                    Neraca
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm"></TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm"></TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm">
                    Debit
                  </TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm">
                    Credit
                  </TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm">
                    Debit
                  </TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm">
                    Credit
                  </TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm">
                    Debit
                  </TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm">
                    Credit
                  </TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm">
                    Debit
                  </TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm">
                    Credit
                  </TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm">
                    Debit
                  </TableCell>
                  <TableCell className=" text-center py-1 border text-xs md:text-sm">
                    Credit
                  </TableCell>
                </TableRow>
                {accounts &&
                  accounts.map((dataAccount, index) => {
                    let debitGLAmount = 0;
                    let creditGLAmount = 0;
                    let debitAdjustAmount = 0;
                    let creditAdjustAmount = 0;
                    let debitClosingAmount = 0;
                    let creditClosingAmount = 0;
                    ledgerEntries.map((dataGE) => {
                      dataGE.debits.map((dataGEDebit) => {
                        if (dataAccount._id == dataGEDebit.account_id) {
                          debitGLAmount += dataGEDebit.amount;
                        }
                      });
                      dataGE.credits.map((dataGECredit) => {
                        if (dataAccount._id == dataGECredit.account_id) {
                          creditGLAmount += dataGECredit.amount;
                        }
                      });
                    });
                    adjustEntries.map((dataAdjustLedger) => {
                      dataAdjustLedger.debits.map((dataAdjustLedgerDebit) => {
                        if (
                          dataAccount._id == dataAdjustLedgerDebit.account_id
                        ) {
                          debitAdjustAmount += dataAdjustLedgerDebit.amount;
                        }
                      });
                      dataAdjustLedger.credits.map((dataAdjustLedgerCredit) => {
                        if (
                          dataAccount._id == dataAdjustLedgerCredit.account_id
                        ) {
                          creditAdjustAmount += dataAdjustLedgerCredit.amount;
                        }
                      });
                    });
                    closingEntries.map((dataClosingLedger) => {
                      dataClosingLedger.debits.map((dataClosingLedgerDebit) => {
                        if (
                          dataAccount._id == dataClosingLedgerDebit.account_id
                        ) {
                          creditClosingAmount += dataClosingLedgerDebit.amount;
                        }
                      });
                      dataClosingLedger.credits.map(
                        (dataClosingLedgerCredit) => {
                          if (
                            dataAccount._id ==
                            dataClosingLedgerCredit.account_id
                          ) {
                            debitClosingAmount +=
                              dataClosingLedgerCredit.amount;
                          }
                        }
                      );
                    });

                    return (
                      <TableRow key={index}>
                        <TableCell className="py-1 border text-xs md:text-sm">
                          {dataAccount.accountID}
                        </TableCell>
                        <TableCell className="py-1 border text-xs md:text-sm">
                          {capitalizeFirstLetter(dataAccount.name)}
                        </TableCell>
                        {/* GENERAL LEDGER */}
                        <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(debitGLAmount)}
                        </TableCell>
                        <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(creditGLAmount)}
                        </TableCell>
                        {/* ADJUST LEDGER */}
                        <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(debitAdjustAmount)}
                        </TableCell>
                        <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(creditAdjustAmount)}
                        </TableCell>
                        {/* REPORT REVENUE OR LOSS */}
                        <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(
                            ["5"].includes(
                              dataAccount.accountID.substring(0, 1)
                            )
                              ? debitGLAmount +
                                  debitAdjustAmount -
                                  creditAdjustAmount
                              : 0
                          )}
                        </TableCell>
                        <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(
                            ["4"].includes(
                              dataAccount.accountID.substring(0, 1)
                            )
                              ? creditGLAmount -
                                  debitAdjustAmount +
                                  creditAdjustAmount
                              : 0
                          )}
                        </TableCell>
                        {/* CLOSING LEDGER */}
                        <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(
                            ["4"].includes(
                              dataAccount.accountID.substring(0, 1)
                            )
                              ? debitClosingAmount -
                                  debitAdjustAmount +
                                  creditAdjustAmount
                              : 0
                          )}
                        </TableCell>
                        <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(
                            ["5"].includes(
                              dataAccount.accountID.substring(0, 1)
                            )
                              ? creditClosingAmount +
                                  debitAdjustAmount -
                                  creditAdjustAmount
                              : 0
                          )}
                        </TableCell>
                        {/* NERACA */}
                        <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(
                            ["1"].includes(
                              dataAccount.accountID.substring(0, 1)
                            ) || dataAccount.accountID === "3300"
                              ? debitGLAmount -
                                  creditGLAmount +
                                  debitAdjustAmount -
                                  creditAdjustAmount
                              : 0
                          )}
                        </TableCell>
                        <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(
                            dataAccount.accountID == "3200"
                              ? totalCreditRetainedEarning
                              : ["2", "3"].includes(
                                  dataAccount.accountID.substring(0, 1)
                                )
                              ? dataAccount.accountID == "3300"
                                ? 0
                                : creditGLAmount - debitGLAmount
                              : 0
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="py-1 border text-xs md:text-sm px-1 text-right"
                  >
                    TOTAL
                  </TableCell>
                  {/* General Ledger */}
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalDebitledgerEntries)}
                  </TableCell>
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalCreditledgerEntries)}
                  </TableCell>
                  {/* Adjusting Ledger */}
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalDebitledgerAdjust)}
                  </TableCell>
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalCreditledgerAdjust)}
                  </TableCell>
                  {/* Report RL */}
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalDebitReportRL)}
                  </TableCell>
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalCreditReportRL)}
                  </TableCell>
                  {/* Closing Ledger */}
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalDebitledgerClosing)}
                  </TableCell>
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalCreditledgerClosing)}
                  </TableCell>
                  {/* NERACA */}
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalDebitNeraca)}
                  </TableCell>
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalCreditNeraca)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  {/* Report RL */}
                  {totalCreditReportRL - totalDebitReportRL > 0 ? (
                    <>
                      <TableCell
                        colSpan={6}
                        className="py-1 border text-xs md:text-sm px-1 text-right"
                      >
                        Profit
                      </TableCell>
                      <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(totalCreditReportRL - totalDebitReportRL)}
                      </TableCell>
                      <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(0)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell
                        colSpan={6}
                        className="py-1 border text-xs md:text-sm px-1 text-right"
                      >
                        Loss
                      </TableCell>
                      <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(0)}
                      </TableCell>
                      <TableCell className="py-1 border text-xs md:text-sm px-1 text-center">
                        {new Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(totalDebitReportRL - totalCreditReportRL)}
                      </TableCell>
                    </>
                  )}
                  {/* Closing Ledger */}
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center"></TableCell>
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center"></TableCell>
                  {/* NERACA */}
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center"></TableCell>
                  <TableCell className="py-1 border text-xs md:text-sm px-1 text-center"></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
