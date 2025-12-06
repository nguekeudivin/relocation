@component('mail::message')

# {{ t('Service Completed') }}

{{ t('Hello :name', ['name' => $greetingName]) }}

{{ t('The service for booking #:id has been completed. We hope you are satisfied.', ['id' => $booking->id]) }}

@component('mail::button', ['url' => route('user.bookings')])
{{ t('View Booking') }}
@endcomponent

{{ t('Please consider leaving feedback to help us improve.') }}

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
