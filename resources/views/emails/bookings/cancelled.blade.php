@component('mail::message')

# {{ t('Booking Cancelled') }}

{{ t('Hello :name', ['name' => $greetingName]) }}

{{ t('Your booking has been cancelled as requested.', ['id' => $booking->id]) }}

@component('mail::button', ['url' => route('user.bookings')])
{{ t('View My Bookings') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
