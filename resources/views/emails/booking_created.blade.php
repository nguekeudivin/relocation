@component('mail::message')

# {{ t('Facture :no', ['no' => 'AR-' . $booking->id]) }}
**{{ t('De :name', ['name' => config('app.name', 'Arnold Umzug')]) }}**

{{ t('Hello :name,', ['name' => $greetingName]) }}

{{ t('Thank you for using our service! You will find your invoice attached to this email.') }} 
{{ t('Please take note of the payment terms and general terms and conditions.') }} 

---

{{ t('Total Amount : ') }} **{{ number_format($booking->amount, 2, ',', ' ') }} €**  <br/>
{{ t('Booking fee : ') }}**{{ number_format($booking->workers_tax + $booking->car_tax, 2, ',', ' ') }} €**

@component('mail::panel')
**{{ t('Note:') }}** {{ t('As soon as we receive the booking fee, we will firmly record the appointment in our calendar.') }} 
@endcomponent

@component('mail::button', ['url' => route('invoice', $booking->id)])
{{ t('View Invoice') }}
@endcomponent

{{ t('Best regards,') }}  
**{{ t('B. Arnold') }}** 

---
<small>{{ t('Created and sent with :app.', ['app' => config('app.name')]) }}</small>

@endcomponent