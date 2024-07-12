"use client";
import { IService } from "@/lib/mongodb/models/Service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IDRFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IAccount } from "@/lib/mongodb/models/Account";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { revalidateAll } from "@/lib/action";

const TableServices = ({
  services,
  cashAccount,
  revenueAccount,
}: {
  services: IService[];
  cashAccount: IAccount;
  revenueAccount: IAccount;
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const addService = async (service: IService) => {
    const newGeneralLedger = {
      dateGL: new Date(),
      descGL: `Service ${service.name}`,
      creditsGL: [
        {
          accountName: revenueAccount.name,
          accountID: revenueAccount.accountID,
          account_id: revenueAccount._id,
          amount: service.price,
        },
      ],
      debitsGL: [
        {
          accountName: cashAccount.name,
          accountID: cashAccount.accountID,
          account_id: cashAccount._id,
          amount: service.price,
        },
      ],
      typeGL: "jurnalumum",
    };

    try {
      const res = await fetch("/api/service/book", {
        method: "POST",
        body: JSON.stringify({
          date: newGeneralLedger.dateGL,
          description: newGeneralLedger.descGL,
          debits: newGeneralLedger.debitsGL,
          credits: newGeneralLedger.creditsGL,
          type: newGeneralLedger.typeGL,
        }),
      });
      if (res.ok) {
        toast({
          title: "Item Berhasil Ditambahkan",
        });
        // VERCEL
        await revalidateAll();
        router.push("/jurnalumum");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Desc</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services &&
          services.map((data, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium capitalize">
                {data.name}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {data.description}
              </TableCell>
              <TableCell className="text-right">
                {IDRFormat(data.price)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                <Button onClick={() => addService(data)} variant="outline">
                  Add This Service
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TableServices;
