<!DOCTYPE html>
<html lang="de">
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
        .info-table td { padding: 1px 2px; font-size: 10px; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 25px; }
        .items-table th { border-bottom: 1.5px solid #000; text-align: left; padding: 5px; font-size: 10px; text-transform: uppercase; }
        .items-table td { padding: 8px 5px; border-bottom: 0.5px solid #ccc; vertical-align: top; }
        .totals-section { width: 45%; margin-left: auto; margin-top: 20px; text-align: right; }
        .total-row { padding: 3px 0; }
        .grand-total { font-weight: bold; font-size: 12px; margin-top: 5px; padding-top: 5px; }
        .footer { position: absolute; bottom: 0; width: 100%; font-size: 8px; border-top: 0.5px solid #000; padding-top: 10px; }
        .footer table { width: 100%; }
        .cgv-title { font-size: 13px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #000; padding-bottom: 5px; text-transform: uppercase; }
        .cgv-section { margin-bottom: 15px; text-align: justify; }
        .cgv-section h4 { margin-bottom: 5px; font-size: 11px; text-transform: uppercase; }
    </style>
</head>
<body>    
    <div class="page-break">

        <table style="width:100%"> 
            <tr> 
                <td style="width: 75%; vertical-align: top;">
                    <div class="header">
                        <div class="company-name">Arnold Umzug</div>
                        <div>Boris Arnold</div>
                        <div>Rathenaustraße 6, 33102 Paderborn</div>
                    </div>
                </td>
                <td>
                    <div>
                        <img 
                            src="{{ public_path('images/invoice-image.png') }}" 
                            alt="Arnold Umzug"
                            style="height: 100px;"
                        >
                    </div>
                </td>
            </tr>
        </table>

        <table class="address-container">
            <tr>
                <td style="width: 60%; vertical-align: top;">
                    <div class="client-box">
                        <strong>{{ $client_name }}</strong><br>
                        {{ $client_street }}<br>
                        {{ $client_city }} <br>
                    </div>
                </td>
                <td style="vertical-align: top;">
                    <table class="info-table">
                        <tr><td>Rechnungsnummer:</td><td><strong>{{ $facture_no }}</strong></td></tr>
                        <tr><td>Rechnungsdatum:</td><td><strong>{{ $facture_date }}</strong></td></tr>
                        <tr><td>Zahlungsbedingungen:</td><td><strong>5 Tage</strong></td></tr>
                        <tr><td>Fälligkeitsdatum:</td><td><strong>{{ $echeance }}</strong></td></tr>
                    </table>
                </td>
            </tr>
        </table>

        <h2 style="font-size: 16px; margin-bottom: 10px;">RECHNUNG</h2>

        <p style="font-size: 12px;">
            Wir bedanken uns für Ihren Auftrag und das Vertrauen in unseren Umzugsservice.
            Der Umzug findet am {{ $date }} an der Adresse {{ $client_street }}, {{ $client_city }} statt.
        </p>
        
        <p style="font-size: 12px;">
            Für Ihren Umzug stellen wir {{ $workers }} erfahrene Umzugshelfer sowie ein Transportfahrzeug ({{ $car_type }}) zur Verfügung.
            Die geplante Einsatzdauer beträgt bis zu {{ $duration }} Arbeitsstunden.
            Die Gesamtkosten für diese Umzugsleistung belaufen sich auf {{ number_format($total_service, 2) }} €.
            Der Betrag beinhaltet bereits die Reservierungsgebühr zur Sicherung Ihres Umzugstermins.
        </p>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Beschreibung</th>
                    <th>Datum</th>
                    <th>Einheit</th>
                    <th>Menge</th>
                    <th>Preis</th>
                    <th style="text-align: right;">Betrag</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Umzugshelfer</strong></td>
                    <td>{{ $date }}</td>
                    <td>Stk.</td>
                    <td>{{ number_format($workers, 2, '.', '') }}</td>
                    <td>{{ number_format($worker_tax_unit, 2, '.', ',') }} €</td>
                    <td style="text-align: right;">{{ number_format($workers_tax, 2, '.', ',') }} €</td>
                </tr>

                @if($car_tax > 0)
                <tr>
                    <td><strong>Transportfahrzeug</strong></td>
                    <td>{{ $date }}</td>
                    <td>Stk.</td>
                    <td>1.00</td>
                    <td>{{ number_format($car_tax, 2, '.', ',') }} €</td>
                    <td style="text-align: right;">{{ number_format($car_tax, 2, '.', ',') }} €</td>
                </tr>
                @endif

                <tr>
                    <td><strong>Transportkosten</strong></td>
                    <td>{{ $date }}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td style="text-align: right;">{{ number_format($transport, 2, '.', ',') }} €</td>
                </tr>

                <tr>
                    <td><strong>Arbeitskosten</strong></td>
                    <td>{{ $date }}</td>
                    <td>Std.</td>
                    <td>{{ number_format($duration, 2, '.', '') }}</td>
                    <td>{{ number_format($price_per_hour, 2, '.', ',') }} €</td>
                    <td style="text-align: right;">{{ number_format($prestation_cost, 2, '.', ',') }} €</td>
                </tr>
            </tbody>
        </table>

        <div class="totals-section">
            <div class="total-row">
                Gesamtbetrag der Umzugsleistung:
                <span style="float:right">{{ number_format($total_service, 2, '.', ',') }} €</span>
            </div>

            <div class="total-row">
                Umsatzsteuer 0,00%:
                <span style="float:right">0.00 €</span>
            </div>
            
            <div style="background: #f2f2f2; padding: 10px; margin-top: 15px; border: 1px solid #000; overflow: hidden;">
                <strong>Reservierungsgebühr:</strong>
                <span style="float: right; font-weight: bold;">{{ number_format($booking_fee, 2, '.', ',') }} €</span>
            </div>

            <div class="grand-total">
                Gesamtbetrag:
                <span style="float:right">{{ number_format($total_service, 2, '.', ',') }} €</span>
            </div>
        </div>

        <p style="font-size: 10px; margin-top: 30px;">
            Dieser Rechnungsbetrag enthält keine Umsatzsteuer gemäß §19 Abs. 1 UStG (Kleinunternehmerregelung).
        </p>
        
        <p style="font-size: 10px; margin-top: 15px;">
            <strong>Zahlungsbedingungen:</strong>
            Die Reservierungsgebühr muss spätestens 5 Tage vor dem geplanten Umzugstermin überwiesen werden.
            Der verbleibende Restbetrag ist unmittelbar nach Abschluss der Umzugsarbeiten direkt an die Umzugshelfer zu bezahlen.
        </p>

        <div class="footer">
            <table style="width: 100%; font-size: 12px">
                <tr>
                    <td style="width: 33%;">
                        Adresse: <strong>Rathenaustraße 6, 33102 Paderborn</strong><br>
                        E-Mail: <strong>{{ $email }}</strong><br>
                        Telefon: <strong>{{ $tel }}</strong>
                    </td>
                    <td style="width: 33%;">
                        Bank: <strong>{{ $bank }}</strong><br>
                        Kontoinhaber: <strong>{{ $owner }}</strong><br>
                        IBAN: <strong>{{ $iban }}</strong>
                    </td>
                    <td style="width: 33%;">
                        SWIFT/BIC: <strong>{{ $bic }}</strong><br>
                        Amtsgericht Paderborn
                    </td>
                </tr>
            </table>
            <div style="text-align: center; margin-top: 10px;">1/2</div>
        </div>
    </div>

    <div class="cgv-content">
        <div class="cgv-title">Allgemeine Geschäftsbedingungen (AGB)</div>
        <p style="text-align: right; font-size: 12px;">Stand: {{ $date }}</p>

        <div class="cgv-section" style="margin-top: 20px;">
            <h4>5. Pflichten des Auftraggebers</h4>
            <p>
                Der Auftraggeber ist verpflichtet, den Dienstleister über die Art des Umzugsgutes sowie über besonders empfindliche oder schadensanfällige Gegenstände rechtzeitig zu informieren.
            </p>
            <p>
                Sofern Arnold Umzug nicht ausdrücklich mit einer fachgerechten Verpackung beauftragt wurde, sind empfindliche Gegenstände wie Glas, Marmor, Porzellan, Bilderrahmen, Lampen und andere zerbrechliche Objekte vom Auftraggeber transportsicher zu verpacken und zu schützen.
            </p>
            <p>
                Es wird empfohlen, hierfür die Originalverpackung oder eine gleichwertige Schutzverpackung zu verwenden. Sofern nichts anderes vereinbart wurde, ist der Auftraggeber ebenfalls dafür verantwortlich, empfindliche Böden, Wände, Treppenhäuser oder Aufzüge an der Be- und Entladestelle ausreichend zu schützen.
            </p>

            <h4 style="margin-top: 20px;">6. Zahlungsbedingungen</h4>
            <p>
                Die Reservierungsgebühr ist spätestens 5 Tage vor dem vereinbarten Umzugstermin zu überweisen, damit der Termin verbindlich im Kalender bestätigt werden kann.
            </p>
            <p>
                Der restliche Rechnungsbetrag ist unmittelbar nach Abschluss des Umzugs direkt an die eingesetzten Umzugshelfer zu entrichten.
            </p>
        </div>

        <div class="footer">
            <div style="text-align: center;">Arnold Umzug - Rathenaustraße 6 - 33102 Paderborn</div>
            <div style="text-align: center; margin-top: 10px;">2/2</div>
        </div>
    </div>

</body>
</html>