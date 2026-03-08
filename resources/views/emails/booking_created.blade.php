@component('mail::message')

# Rechnung {{ 'AR-' . $booking->id }}
**Von {{ config('app.name', 'Arnold Umzug') }}**

Hallo {{ $greetingName }},

vielen Dank, dass Sie unseren Umzugsservice nutzen. Ihre Rechnung finden Sie im Anhang dieser E-Mail.  
Bitte beachten Sie die Zahlungsbedingungen sowie unsere Allgemeinen Geschäftsbedingungen.

@component('mail::panel')
**Hinweis:** Sobald die Buchungskosten bei uns eingegangen sind, bestätigen wir Ihren Umzugstermin verbindlich in unserem Kalender.
@endcomponent

---

**Kunde:** {{ $booking->user->full_name ?? $booking->email }}   
**Fälligkeitsdatum:** {{ $booking->date->addDays(5)->translatedFormat('d.m.Y') }}   
**Gesamtbetrag:** **{{ number_format($booking->amount, 2, ',', ' ') }} €** 

@component('mail::button', ['url' => url('/invoice?lang='.$lang.'&token='.$booking->token)])
Rechnung ansehen
@endcomponent   

Mit freundlichen Grussen  
**B. Arnold** 

---
<small>Erstellt und versendet mit {{ config('app.name') }}.</small>

@endcomponent
