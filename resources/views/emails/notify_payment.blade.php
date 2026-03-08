@component('mail::message')

# Zahlungsbestaetigung erhalten

Ein Kunde hat uns soeben informiert, dass die Zahlung fuer seine Umzugsbuchung ueberwiesen wurde.

**Kunde:** @if($user) {{ $user->first_name }} {{ $user->last_name }} @else {{ $booking->first_name }} {{ $booking->last_name }} @endif  
**Kontakt E-Mail:** {{ $email }}

---

## Details

@component('mail::panel')
Gesamtkosten der Dienstleistung: **{{ number_format($booking->amount, 2) }}€**  <br/>
Reservierungsgebuehr: **{{ number_format($booking->workers_tax + $booking->car_tax, 2) }}€**  <br/>
Geplanter Termin: **{{ $booking->date->translatedFormat('M d, Y \\a\\t g:i A') }}**
@endcomponent

---

Bitte pruefen Sie Ihr Bankkonto oder Zahlungsportal, bevor Sie diese Buchung freigeben, um den Zahlungseingang zu bestaetigen.

@component('mail::button', ['url' => config('app.url') . '/admin/bookings/' . $booking->id])
Buchung im Dashboard anzeigen
@endcomponent

@endcomponent
