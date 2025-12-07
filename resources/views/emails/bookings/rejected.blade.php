@component('mail::message')

# {{ t('Booking Rejected') }}

{{ t('Hello :name', ['name' => $greetingName]) }}

{{ t('We regret to inform you that your booking has been rejected.', ['id' => $booking->id]) }}

{{ t('If you think this is a mistake please contact support.') }}

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
