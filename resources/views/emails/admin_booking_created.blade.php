{{-- resources/views/emails/admin_booking_submitted.blade.php --}}
@component('mail::message')

# Neue Buchung eingegangen {{ 'AR-' . $booking->id }}
**Empfaenger: {{ config('app.name', 'Arnold Umzug') }} (Admin)**

Hallo,

es wurde eine neue Umzugsbuchung erstellt. Der Kunde wird in Kuerze die Reservierungsgebuehr zahlen. Die Rechnung ist dieser E-Mail beigefuegt.

@component('mail::panel')
**Kunde:** {{ $booking->first_name.' '.$booking->last_name }}  
**E-Mail:** {{ $booking->email ?? $booking->user?->email }}  
**Auszugsadresse:** {{ $booking->origin?->city }}{{ $booking->origin?->street ? ' - ' . $booking->origin->street : '' }}  
**Einzugsadresse:** {{ $booking->destination?->city }}{{ $booking->destination?->street ? ' - ' . $booking->destination->street : '' }}  
**Datum & Uhrzeit:** {{ $booking->date?->translatedFormat('d.m.Y H:i') }}
@endcomponent

---

**Rechnungsnummer:** {{ 'AR-' . $booking->id }}  
**Gesamtbetrag:** **{{ number_format($booking->amount, 2, ',', ' ') }} €**  
**Reservierungsgebuehr:** **{{ number_format($booking->workers_tax + $booking->car_tax, 2, ',', ' ') }} €**  

@component('mail::button', ['url' => route('invoice', $booking->id)])
Rechnung ansehen
@endcomponent

Mit freundlichen Grussen  
**Systembenachrichtigung**

---
<small>Erstellt und versendet mit {{ config('app.name') }}.</small>

@endcomponent
