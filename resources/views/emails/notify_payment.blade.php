@component('mail::message')

# {{ t('Payment Notification Received') }}

{{ t('A customer has just notified us that they have sent the payment for their booking.') }}

**{{ t('Customer') }}:** @if($user) {{ $user->first_name }} {{ $user->last_name }} @else {{ $booking->first_name }} {{ $booking->last_name }} @endif  
**{{ t('Contact Email') }}:** {{ $email }}

---

## {{ t('Details') }}

@component('mail::panel')
{{ t('Total cost of service') }}: **{{ number_format($booking->amount, 2) }}€**  <br/>
{{ t('Booking fee') }}: **{{ number_format($booking->workers_tax + $booking->car_tax, 2) }}€**  <br/>
{{ t('Scheduled Date') }}:** {{ $booking->date->translatedFormat('M d, Y \\a\\t g:i A') }}**
@endcomponent

---

{{ t('Please verify your bank account or payment gateway to confirm that the funds have been received before approving this booking.') }}

@component('mail::button', ['url' => config('app.url') . '/admin/bookings/' . $booking->id])
{{ t('View Booking in Dashboard') }}
@endcomponent

@endcomponent