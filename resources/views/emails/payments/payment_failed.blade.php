@component('mail::message')

# {{ t('Payment Failed') }}

{{ t('Hello :name', ['name' => $greetingName]) }}

{{ t('We were unable to process the payment for booking #:id. Please try again or contact support.', ['id' => $booking->id]) }}

@component('mail::button', ['url' => route('user.bookings')])
{{ t('Retry Payment') }}
@endcomponent

{{ t('If you need help contact us') }}

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
