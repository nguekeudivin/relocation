<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MemberCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The user that was created.
     */
    public $user;

    /**
     * Create a new notification instance.
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification (inline definition).
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouveau membre enregistré')
            ->greeting("Bonjour {$this->user->first_name},")
            ->line("Votre compte a été créé avec succès dans le système.")
            ->line("Vous pouvez consulter vos informations ou commencer à utiliser votre compte dès maintenant.")
           // ->action('Voir votre profil', url('/members/'.$this->user->id))
            ->line('Merci d’utiliser notre application !');
    }

    /**
     * Get the array representation of the notification for the database channel.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Nouveau membre créé',
            'message' => "Le membre {$this->user->first_name} {$this->user->last_name} a été ajouté au système.",
            'user_id' => $this->user->id,
            'url' => url('/members/'.$this->user->id),
        ];
    }
}
