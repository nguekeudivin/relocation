@component('mail::message')

# {{ t('Booking Confirmed') }}

{{ t('Hello :name', ['name' => $greetingName]) }}

{{ t('Your booking has been confirmed.', ['id' => $booking->id]) }}

@component('mail::button', ['url' => route('user.bookings')])
{{ t('View Booking Details') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
