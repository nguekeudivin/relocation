@component('mail::message')

# {{ t('Booking Successfully Received') }}

{{ t('Hello :name', ['name' => $greetingName]) }}

@if($user)
{{ t('Thank you :first_name for your trust.', ['first_name' => $user->first_name]) }}
@else
{{ t('Thank you for your booking request.') }}
@endif

## {{ t('Booking Summary') }}

**{{ t('Date') }}**  
{{ $booking->date->translatedFormat('M d, Y \a\t g:i A') }}

## {{ t('Locations') }}

@component('mail::panel')
**{{ t('Pickup Location') }}**  
{{ $booking->origin->full_address ?? t('Not specified') }}

**{{ t('Delivery Location') }}**  
{{ $booking->destination->full_address ?? t('Not specified') }}
@endcomponent

## {{ t('Service Details') }}

**{{ t('Workers') }}:** {{ $booking->workers }} {{ $booking->workers > 1 ? t('persons') : t('person') }}  
**{{ t('Duration') }}:** {{ $booking->duration }} {{ $booking->duration > 1 ? t('hours') : t('hour') }}  
@if($booking->full_car_type != null)
**{{ t('Vehicle') }}:** {{ $booking->full_car_type }}
@endif
**{{ t('Total Amount') }}:** **€{{ number_format($booking->amount, 2) }}**

@if($booking->observation)
## {{ t('Your Notes') }}
@component('mail::panel')
{!! nl2br(e($booking->observation)) !!}
@endcomponent
@endif

@if($user)
@component('mail::button', ['url' => route('user.bookings')])
{{ t('View My Bookings') }}
@endcomponent
@endif

{{ t('Thank you again for choosing us!') }}  
{{ t('Best regards') }},  
**{{ config('app.name') }}**

@endcomponent
