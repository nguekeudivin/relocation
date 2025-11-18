import { Block } from "@/components/ui/block";
import PaymentTable from "../payment-table";
import { useTranslation } from "@/hooks/use-translation";

export default function PaymentListBlock() {
  const { t } = useTranslation();

  return (
    <Block defaultClose={false} name="payment_list">
      <header className="mb-6">
        <h2 className="text-2xl font-bold">{t("Payments")}</h2>
      </header>
      <PaymentTable />
    </Block>
  );
}
