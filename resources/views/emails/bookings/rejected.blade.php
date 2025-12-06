@component('mail::message')

# {{ t('Booking Rejected') }}

{{ t('Hello :name', ['name' => $greetingName]) }}

{{ t('We regret to inform you that your booking #:id has been rejected by the administrator.', ['id' => $booking->id]) }}

{{ t('If you think this is a mistake please contact support.') }}

@component('mail::button', ['url' => route('contact')])
{{ t('Contact Support') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
