import { Modal } from "@/components/ui/modal";
import useAppStore from "@/store";
import { Booking } from "@/store/Booking";
import { formatDate, formatTime } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { InfoElement } from "@/components/shared/details";

export function ViewBookingModal() {
  const name = "view_booking";
  const store = useAppStore();
  const { t } = useTranslation();
  const booking = store.booking.current as Booking | null;

  if (!booking) return null;

  const details = [
    { label: t("Date & Time"), value: `${formatDate(booking.date)} ${formatTime(booking.date)}` },
    { label: t("Origin"), value: booking.origin?.name || booking.origin_id },
    { label: t("Destination"), value: booking.destination?.name || booking.destination_id },
    { label: t("Workers"), value: booking.workers },
    { label: t("Cars"), value: booking.cars ?? 0 },
    { label: t("Duration"), value: `${booking.duration} h` },
    { label: t("Amount"), value: booking.amount.toFixed(2) },
    { label: t("Observation"), value: booking.observation || "—" },
    { label: t("Created At"), value: booking.created_at ? formatDate(booking.created_at) : "—" },
  ];

  return (
    <Modal title={t("Booking Details")} name={name} className="w-[700px] max-w-[95vw]">
      <div className="space-y-6">
        <section className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">{t("Booking Information")}</h3>
          <ul className="grid grid-cols-2 gap-4 text-sm">
            {details.map((d) => (
              <InfoElement key={d.label} detail={d} />
            ))}
          </ul>
        </section>
      </div>
    </Modal>
  );
}
