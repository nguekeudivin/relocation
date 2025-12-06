@component('mail::message')

# {{ t('A New Payment Has Been Received') }}

{{ t('A booking has just been paid by a customer.') }}

@if($user)
**{{ t('Customer Name') }}:** {{ $user->first_name }} {{ $user->last_name }}  
@endif

**{{ t('Contact Email') }}:** {{ $email }}

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

{{ t('Please review and confirm the booking as soon as possible.') }}

@endcomponent
