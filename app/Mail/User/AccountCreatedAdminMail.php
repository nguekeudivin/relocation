<?php

namespace App\Mail\User;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailable;

class AccountCreatedAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    protected function withCommonData(): array
    {
        return [
            'user' => $this->user,
        ];
    }

    public function envelope(): Envelope
    {
        $subject = t('New User Registered');
        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.users.account_created_admin',
            with: $this->withCommonData()
        );
    }
}
