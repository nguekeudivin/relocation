@component('mail::message')

# {{ t('Facture :no', ['no' => 'AR-' . $booking->id]) }}
**{{ t('De :name', ['name' => config('app.name', 'Arnold Umzug')]) }}**

{{ t('Hello :name,', ['name' => $greetingName]) }}

{{ t('Thank you for using our service! You will find your invoice attached to this email.') }} 
{{ t('Please take note of the payment terms and general terms and conditions.') }} 

@component('mail::panel')
**{{ t('Note:') }}** {{ t('As soon as we receive the booking costs, we will firmly record the appointment in our calendar.') }} 
@endcomponent

---

**{{ t('For:') }}** {{ $booking->user->full_name ?? $booking->email }}   
**{{ t('Due Date:') }}** {{ $booking->date->addDays(5)->translatedFormat('d.m.Y') }}   
**{{ t('Total Amount:') }}** **{{ number_format($booking->amount, 2, ',', ' ') }} €** 

@component('mail::button', ['url' => url('/invoice?token='.$booking->token)])
{{ t('View Invoice') }}
@endcomponent

{{ t('Best regards,') }}  
**{{ t('B. Arnold') }}** 

---
<small>{{ t('Created and sent with :app.', ['app' => config('app.name')]) }}</small>

@endcomponent