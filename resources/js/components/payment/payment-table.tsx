"use client";

import SimpleTable from "@/components/ui/table";
import { useSimpleForm } from "@/hooks/use-simple-form";
import useAppStore from "@/store";
import { useEffect } from "react";
import FullPagination from "@/components/shared/full-pagination";
import { PaymentTableColumns } from "./payment-meta";
import { SearchEngine } from "../shared/search-engine";

export default function PaymentTable() {
  const store = useAppStore();

  const searchForm = useSimpleForm({ keyword: "" });

  const search = ({ page = 1, perPage = 10 } = {}) => {
    store.payment.fetch({ page, perPage, ...searchForm.values });
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <>
      <SearchEngine
        autoComplete={(values: any) => {
          store.payment.paginate(
            store.payment.payments.filter((p: any) =>
              p.amount.toString().includes(values.keyword) ||
              p.method.includes(values.keyword.toLowerCase()) ||
              p.transaction_id?.includes(values.keyword)
            )
          );
        }}
        form={searchForm}
      />

      <SimpleTable
        items={store.payment.pagination.data}
        columns={PaymentTableColumns({
          onView: (payment: any) => {
            store.payment.setCurrent(payment);
            store.display.show("view_payment");
          },
          onDelete: (payment: any) => {
            store.payment.setCurrent(payment);
            store.display.show("delete_payment");
          },
        })}
      />

      <FullPagination
        className="mt-4"
        pagination={store.payment.pagination}
        onGoto={(page) => search({ page })}
        onPerPage={(perPage) => search({ perPage })}
      />
    </>
  );
}
