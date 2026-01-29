{{-- resources/views/emails/admin_booking_submitted.blade.php --}}
@component('mail::message')

# {{ t('New booking submitted :no', ['no' => 'AR-' . $booking->id]) }}
**{{ t('To: :name', ['name' => config('app.name', 'Arnold Umzug') . ' (Admin)']) }}**

{{ t('Hello,') }}

{{ t('A new booking has been submitted. The customer is about to pay the reservation fee. The invoice is attached to this email.') }}

@component('mail::panel')
**{{ t('Customer') }}:** {{ $booking->user->full_name ?? $booking->email }}  
**{{ t('Email') }}:** {{ $booking->email ?? $booking->user?->email }}  
**{{ t('Moving out address') }}:** {{ $booking->origin?->city }}{{ $booking->origin?->street ? ' - ' . $booking->origin->street : '' }}  
**{{ t('Moving in address') }}:** {{ $booking->destination?->city }}{{ $booking->destination?->street ? ' - ' . $booking->destination->street : '' }}  
**{{ t('Date & time') }}:** {{ $booking->date?->translatedFormat('d.m.Y H:i') }}
@endcomponent

---

**{{ t('Invoice No:') }}** {{ 'AR-' . $booking->id }}  
**{{ t('Total Amount:') }}** **{{ number_format($booking->amount, 2, ',', ' ') }} €**  
**{{ t('Booking fee') }}** **{{ number_format($booking->workers_tax + $booking->car_tax, 2, ',', ' ') }} €**  

@component('mail::button', ['url' => route('invoice', $booking->id)])
{{ t('View Invoice') }}
@endcomponent

{{ t('Best regards,') }}  
**{{ t('System Notification') }}**

---
<small>{{ t('Created and sent with :app.', ['app' => config('app.name')]) }}</small>

@endcomponent
