import { Block } from "@/components/ui/block";
import BookingTable from "../booking-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useAppStore from "@/store";
import { useTranslation } from "@/hooks/use-translation";

export default function BookingListBlock() {
  const store = useAppStore();
  const { t } = useTranslation();

  return (
    <Block defaultClose={false} name="booking_list">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("Bookings")}</h2>
        <Button onClick={() => store.display.show("create_booking")}>
          <Plus className="w-4 h-4 mr-2" />
          {t("New Booking")}
        </Button>
      </header>
      <BookingTable />
    </Block>
  );
}
