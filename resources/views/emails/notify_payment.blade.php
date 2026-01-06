@component('mail::message')

# {{ t('Payment Notification Received') }}

{{ t('A customer has just notified us that they have sent the payment for their booking.') }}

**{{ t('Customer') }}:** @if($user) {{ $user->first_name }} {{ $user->last_name }} @else {{ $booking->first_name }} {{ $booking->last_name }} @endif  
**{{ t('Contact Email') }}:** {{ $email }}

---

## {{ t('Payment Details') }}

**{{ t('Declared Amount') }}:** **€{{ number_format($booking->amount, 2) }}** **{{ t('Booking Reference') }}:** #{{ $booking->id }}

## {{ t('Booking Summary') }}

**{{ t('Scheduled Date') }}:** {{ $booking->date->translatedFormat('M d, Y \\a\\t g:i A') }}

@component('mail::panel')
**{{ t('Pickup') }}:** {{ $booking->origin->full_address }}  
**{{ t('Destination') }}:** {{ $booking->destination->full_address }}
@endcomponent

---

{{ t('Please verify your bank account or payment gateway to confirm that the funds have been received before approving this booking.') }}

@component('mail::button', ['url' => config('app.url') . '/admin/bookings/' . $booking->id])
{{ t('View Booking in Dashboard') }}
@endcomponent

@endcomponent