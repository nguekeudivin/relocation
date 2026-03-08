@component('mail::message')

# Buchung bestaetigt

Hallo {{ $greetingName }},

Ihre Umzugsbuchung wurde erfolgreich bestaetigt.

@component('mail::button', ['url' => route('user.bookings')])
Buchungsdetails ansehen
@endcomponent

Freundliche Grusse,  
**{{ config('app.name') }}**

@endcomponent
