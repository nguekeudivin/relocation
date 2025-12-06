<?php

namespace App\Mail\User;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;

    public function __construct(User $user, ?string $forcedLocale = null)
    {
        $this->user = $user;
        // you may want to set locale here if BaseBookingMail supports it:
        // $this->setLocale($forcedLocale);
    }

    public function greetingName(): string
    {
        if ($this->user->first_name) {
            return $this->user->first_name;
        }
        return t('Dear Customer');
    }

    protected function withCommonData(): array
    {
        return [
            'user' => $this->user,
            'greetingName' => $this->greetingName(),
        ];
    }

    public function envelope(): Envelope
    {
        $subject = t('Welcome to :app', ['app' => config('app.name')]);
        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.users.account_created',
            with: $this->withCommonData()
        );
    }
}
