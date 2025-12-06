@component('mail::message')

# {{ t('New Booking Created') }}

{{ t('A new booking has just been created.') }}

- **{{ t('Booking ID') }}:** #{{ $booking->id }}
- **{{ t('Status') }}:** {{ $booking->status }}
- **{{ t('By') }}:** {{ $user ? ($user->first_name . ' ' . $user->last_name . " ({$user->email})") : $booking->email }}

## {{ t('Booking Summary') }}
- **{{ t('Date') }}:** {{ $booking->date->translatedFormat('M d, Y \a\t g:i A') }}
- **{{ t('Workers') }}:** {{ $booking->workers }}
- **{{ t('Duration') }}:** {{ $booking->duration }} {{ t('hours') }}
- **{{ t('Amount') }}:** €{{ number_format($booking->amount,2) }}

@component('mail::button', ['url' => route('admin.bookings', $booking)])
{{ t('View Bookings') }}
@endcomponent

{{ t('Regards') }},  
**{{ config('app.name') }}**

@endcomponent
