@component('mail::message')

# {{ t('Booking Completed') }}

{{ t('Booking #:id has been marked as completed.', ['id' => $booking->id]) }}

**{{ t('Customer') }}:** {{ $booking->user ? $booking->user->email : $booking->email }}
**{{ t('Date') }}:** {{ $booking->date->translatedFormat('M d, Y \a\t g:i A') }}

@component('mail::button', ['url' => route('admin.bookings.show', $booking)])
{{ t('Open Booking') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
