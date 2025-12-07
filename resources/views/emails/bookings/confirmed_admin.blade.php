@component('mail::message')

# {{ t('Booking Confirmed') }}

{{ t('Booking #:id has been confirmed.', ['id' => $booking->id]) }}

- **{{ t('By') }}:** {{ $booking->user ? $booking->user->email : $booking->email }}
- **{{ t('Date') }}:** {{ $booking->date->translatedFormat('M d, Y \a\t g:i A') }}

@component('mail::button', ['url' => route('admin.bookings')])
{{ t('Open Bookings') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
