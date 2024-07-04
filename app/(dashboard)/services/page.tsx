import FormServices from "@/components/own/services/formService";
import TableServices from "@/components/own/services/tableService";
import { AccountForService } from "@/lib/mongodb/actions/serviceAction";
import React from "react";

const getServicesData = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}api/service`, {
    cache: "no-store",
  });
  const { services } = await res.json();
  return services;
};

const ServicePage = async () => {
  const services = await getServicesData();
  const res = await AccountForService();
  const { cashAccount, revenueAccount } = await res?.json();
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <FormServices />
      <TableServices
        services={services}
        cashAccount={cashAccount}
        revenueAccount={revenueAccount}
      />
    </div>
  );
};

export default ServicePage;
