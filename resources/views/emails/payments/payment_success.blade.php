@component('mail::message')

# {{ t('Payment Successful') }}

{{ t('Hello :name,', ['name' => $greetingName]) }}

{{ t('We confirm that your payment has been successfully received.') }}

## {{ t('Booking Summary') }}

**{{ t('Date') }}:**  
{{ $booking->date->translatedFormat('M d, Y \\a\\t g:i A') }}

## {{ t('Locations') }}

@component('mail::panel')
**{{ t('Pickup Location') }}:**  
{{ $booking->origin->full_address }}

**{{ t('Delivery Location') }}:**  
{{ $booking->destination->full_address }}
@endcomponent

## {{ t('Payment') }}
**{{ t('Amount Paid') }}:** **€{{ number_format($booking->amount, 2) }}**

@if($user)
@component('mail::button', ['url' => route('user.bookings')])
{{ t('View My Bookings') }}
@endcomponent
@endif

{{ t('Thank you for your trust.') }}  
**{{ config('app.name') }}**

@endcomponent
