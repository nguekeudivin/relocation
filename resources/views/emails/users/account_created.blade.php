@component('mail::message')

# {{ t('Welcome to :app', ['app' => config('app.name')]) }}

{{ t('Hello :name', ['name' => $greetingName]) }}

{{ t('Your account has been successfully created. You can now create bookings, manage your profile, and view your reservations.') }}

@component('mail::button', ['url' => route('login')])
{{ t('Login to your account') }}
@endcomponent

{{ t('Thank you') }},  
**{{ config('app.name') }}**

@endcomponent
