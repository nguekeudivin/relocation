<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #333; line-height: 1.4; padding: 10px; }
        .page-break { page-break-after: always; }
        .header { margin-bottom: 20px; }
        .company-name { font-weight: bold; font-size: 14px; margin-bottom: 2px; }
        .address-container { width: 100%; margin-bottom: 40px; margin-top: 20px; }
        .client-box { font-size: 11px; line-height: 1.2; }
        .info-table { width: 80%; margin-left: auto; border-collapse: collapse; }
        .info-table td { padding: 1px 2px;  font-size: 10px; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 25px; }
        .items-table th { border-bottom: 1.5px solid #000; text-align: left; padding: 5px; font-size: 10px; text-transform: uppercase; }
        .items-table td { padding: 8px 5px; border-bottom: 0.5px solid #ccc; vertical-align: top; }
        .totals-section { width: 45%; margin-left: auto; margin-top: 20px; text-align: right; }
        .total-row { padding: 3px 0; }
        .grand-total { font-weight: bold; font-size: 12px; margin-top: 5px;  padding-top: 5px; }
        .footer { position: absolute; bottom: 0; width: 100%; font-size: 8px; border-top: 0.5px solid #000; padding-top: 10px; }
        .footer table { width: 100%; }
        .cgv-title { font-size: 13px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #000; padding-bottom: 5px; text-transform: uppercase; }
        .cgv-section { margin-bottom: 15px; text-align: justify; }
        .cgv-section h4 { margin-bottom: 5px; font-size: 11px; text-transform: uppercase; }
    </style>
</head>
<body>

    <div class="page-break">
        <div class="header">
            <div class="company-name">Arnold Umzug</div>
            <div>Boris Arnold</div>
            <div>Rathenaustraße 6, 33102 Paderborn</div>
        </div>

        <table class="address-container">
            <tr>
                <td style="width: 60%; vertical-align: top;">
                    <div class="client-box">
                        <strong>{{ $client_name }}</strong><br>
                        {{ $client_street }}<br>
                        {{ $client_city }}
                    </div>
                </td>
                <td style="vertical-align: top;">
                    <table class="info-table">
                        <tr><td>{{ t('Invoice Number:') }}</td><td> <strong>{{ $facture_no }}</strong></td></tr>
                        <tr><td>{{ t('Invoice Date:') }}</td><td><strong>{{ $date }}</strong></td></tr>
                        <tr><td>{{ t('Payment Terms:') }}</td><td><strong>5 {{ t('days') }}</strong></td></tr>
                        <tr><td>{{ t('Due Date:') }}</td><td><strong>{{ $echeance }}</strong></td></tr>
                    </table>
                </td>
            </tr>
        </table>

        <h2 style="font-size: 16px; margin-bottom: 10px;">{{ t('INVOICE') }}</h2>

        <p style="font-size: 12px;">
            {{ t('We thank you for your inquiry regarding the work on :date at :street in :city.', ['date' => $date, 'street' => $client_street, 'city' => $client_city]) }}
        </p>
        
        <p style="font-size: 12px;">{{ $description }}</p>

        <table class="items-table">
            <thead>
                <tr>
                    <th>{{ t('Description') }}</th>
                    <th>{{ t('Date') }}</th>
                    <th>{{ t('Quantity') }}</th>
                    <th>{{ t('Unit') }}</th>
                    <th>{{ t('Price') }}</th>
                    <th>{{ t('VAT %') }}</th>
                    <th style="text-align: right;">{{ t('Amount') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>{{ t('Worker Tax:') }}</strong> ({{ number_format($worker_tax_unit, 2) }}€) x {{ $workers }} {{ t('workers') }}</td>
                    <td>{{ $date }}</td>
                    <td>{{ number_format($workers, 2, '.', '') }}</td>
                    <td>{{ t('Pcs.') }}</td>
                    <td>{{ number_format($worker_tax_unit, 2, '.', ',') }} €</td>
                    <td>0.00%</td>
                    <td style="text-align: right;">{{ number_format($worker_tax_total, 2, '.', ',') }} €</td>
                </tr>

                @if($vehicle_tax > 0)
                <tr>
                    <td><strong>{{ t('Vehicle Tax:') }}</strong> {{ t('Transport base + fee per km') }}</td>
                    <td>{{ $date }}</td>
                    <td>1.00</td>
                    <td>{{ t('Pcs.') }}</td>
                    <td>{{ number_format($vehicle_tax, 2, '.', ',') }} €</td>
                    <td>0.00%</td>
                    <td style="text-align: right;">{{ number_format($vehicle_tax, 2, '.', ',') }} €</td>
                </tr>
                @endif

                <tr>
                    <td><strong>{{ t('Prestation Cost:') }}</strong> ({{ number_format($price_per_hour, 2) }}€) x {{ $workers }} {{ t('workers') }} x {{ $duration }} {{ t('hours') }}</td>
                    <td>{{ $date }}</td>
                    <td>{{ number_format($workers * $duration, 2, '.', '') }}</td>
                    <td>{{ t('Hrs.') }}</td>
                    <td>{{ number_format($price_per_hour, 2, '.', ',') }} €</td>
                    <td>0.00%</td>
                    <td style="text-align: right;">{{ number_format($prestation_cost, 2, '.', ',') }} €</td>
                </tr>
            </tbody>
        </table>

        <div class="totals-section">
            <div class="total-row">{{ t('Net Service Amount :') }} <span style="float:right"> {{ number_format($total_service, 2, '.', ',') }} €</span></div>
            <div class="total-row">{{ t('VAT 0.00% :') }}  <span style="float:right"> 0.00 €</span></div>
            
            <div style="background: #f2f2f2; padding: 10px; margin-top: 15px; border: 1px solid #000; overflow: hidden;">
                <strong style="text-transform: uppercase;">{{ t('Invoiced Booking Costs:') }}</strong>
                <span style="float: right; font-weight: bold;">{{ number_format($booking_fee, 2, '.', ',') }} €</span>
            </div>

            <div class="grand-total">
                {{ t('Total Global Amount:') }} 
                <span style="float:right">{{ number_format($total_service, 2, '.', ',') }} €</span>
            </div>
        </div>

        <p style="font-size: 12px; margin-top: 30px;">
            {{ t('This invoice amount does not include VAT according to §19 paragraph 1 of the German VAT Act (UStG).') }}
        </p>
        
        <p style="font-size: 13px; margin-top: 15px;">
            <strong>{{ t('Payment Terms:') }}</strong> {{ t('The booking fees must be transferred no later than 5 days before the work. The remaining amount must be paid directly to the helpers at the end of the work.') }}
        </p>

        <div class="footer">
            <table style="width: 100%; font-size: 12px">
                <tr>
                    <td style="width: 33%;">
                        {{ t('Address:') }} <strong> Rathenaustraße 6, 33102 Paderborn <strong><br>
                        {{ t('Email:') }} <strong>{{ $email }} </strong><br>
                        {{ t('Tel:') }} <strong>{{ $tel }}</strong>
                    </td>
                    <td style="width: 33%;">
                        {{ t('Bank:') }} <strong> {{ $bank }} </strong><br>
                        {{ t('Account Holder:') }} <strong> {{ $owner }} </strong><br>
                        {{ t('IBAN:') }} <strong>{{ $iban }}</strong>
                    </td>
                    <td style="width: 33%;">
                        {{ t('SWIFT/BIC:') }}  <strong>{{ $bic }} </strong><br>
                        {{ t('District Court Paderborn') }}
                    </td>
                </tr>
            </table>
            <div style="text-align: center; margin-top: 10px;">1/2</div>
        </div>
    </div>

    <div class="cgv-content">
        <div class="cgv-title">{{ t('General Terms and Conditions (AGB)') }}</div>
        <p style="text-align: right; font-size: 12px;">{{ t('As of:') }} {{ $date }}</p>

        <div class="cgv-section" style="margin-top: 20px;">
            <h4>{{ __('5. Obligations of the Customer') }}</h4>
            <p>{{ t('The customer is obliged to inform the service provider of the specific nature of the goods to be transported and their susceptibility to damage.') }}</p>
            <p>{{ t('Unless Arnold-Umzug is explicitly commissioned for a professional packing service, particularly sensitive objects such as marble, glass, porcelain, frames, lighting fixtures, and other objects of high fragility must be adequately protected and secured by the customer for transport.') }}</p>
            <p>{{ t('Original or equivalent packaging is recommended. Unless otherwise agreed, the customer is responsible for protecting sensitive floors, walls, and elevators at both the pickup and delivery locations with appropriate means.') }}</p>

            <h4 style="margin-top: 20px;">{{ t('6. Payment Conditions') }}</h4>
            <p>{{ t('The booking costs (reservation fees) must be transferred at least 5 days before the scheduled work to confirm the appointment in the calendar.') }}</p>
            <p>{{ t('The remaining balance of the total service amount is to be paid directly to the helpers upon completion of the work.') }}</p>
        </div>

        <div class="footer">
            <div style="text-align: center;">Arnold Umzug - Rathenaustraße 6 - 33102 Paderborn</div>
            <div style="text-align: center; margin-top: 10px;">2/2</div>
        </div>
    </div>

</body>
</html>