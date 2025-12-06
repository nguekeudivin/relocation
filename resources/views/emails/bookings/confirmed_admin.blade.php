@component('mail::message')

# {{ t('Booking Confirmed') }}

{{ t('Booking #:id has been confirmed.', ['id' => $booking->id]) }}

**{{ t('By') }}:** {{ $booking->user ? $booking->user->email : $booking->email }}
**{{ t('Date') }}:** {{ $booking->date->translatedFormat('M d, Y \a\t g:i A') }}

@component('mail::button', ['url' => route('admin.bookings.show', $booking)])
{{ t('Open Booking') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
