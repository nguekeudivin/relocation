@component('mail::message')

# {{ t('Booking Rejected') }}

{{ t('Booking #:id has been rejected by admin.', ['id' => $booking->id]) }}

**{{ t('Customer') }}:** {{ $booking->email }}
**{{ t('Reason') }}:** {{ $booking->observation ?? t('Not specified') }}

@component('mail::button', ['url' => route('admin.bookings.show', $booking)])
{{ t('Open Booking') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
