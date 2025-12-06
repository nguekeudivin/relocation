@component('mail::message')

# {{ t('Payment Failure Notice') }}

{{ t('A payment attempt for booking #:id has failed.', ['id' => $booking->id]) }}

**{{ t('Customer email') }}:** {{ $booking->email }}

@component('mail::button', ['url' => route('admin.bookings', $booking)])
{{ t('View Booking') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
