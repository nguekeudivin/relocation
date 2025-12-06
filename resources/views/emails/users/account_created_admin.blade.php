@component('mail::message')

# {{ t('New User Registered') }}

{{ t('A new user has registered on the platform.') }}

- **{{ t('Name') }}:** {{ $user->first_name ?? '-' }} {{ $user->last_name ?? '' }}
- **{{ t('Email') }}:** {{ $user->email }}
- **{{ t('Phone') }}:** {{ $user->phone_number ?? t('Not provided') }}

@component('mail::button', ['url' => route('admin.users', $user)])
{{ t('View users') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
