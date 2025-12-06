@component('mail::message')

# {{ t('Booking Cancelled by Customer') }}

{{ t('Booking #:id has been cancelled by the customer.', ['id' => $booking->id]) }}

**{{ t('Customer email') }}:** {{ $booking->email }}

@component('mail::button', ['url' => route('admin.bookings', $booking)])
{{ t('View Bookings') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
