## 👥 Actors

### Administrator

- Full access to the platform.
- Can manage users, contributions, helps, meetings, expenses, settings, audit logs, and notifications.

### Member

- Limited access.
- Can view and manage personal data, contributions, helps, and notifications.

---

## ✅ Use Cases

### 🛠️ Administrator

### 👤 User Management

- Register a user [ok]
- Update user information [ok]
- List users [ok]
- View user details [ok]

- View user contribution analytics
- View user contribution history
- View user help history
- Disable/ban a user account [ok]
- View audit logs per user

### 💰 Contributions & Help

- Register a contribution for a user

1- Auto-generate monthly contributions

- List all contributions
- View details of a contribution
- Generate contributions analytics
- Schedule contribution notifications
- Schedule meetings (manual or auto host assignment)

2- CRUD help types (Marriage, Funeral, etc.)
3- CRUD help requests

- Approve/reject help requests

- Schedule help refund notifications

- Trigger bulk notifications for missed payments

### 💵 Finance

- CRUD expense categories
- CRUD expenses
- Generate expense analytics
- Export expenses to CSV/PDF
- Attach documents/receipts to expenses

### ⚙️ Settings

- Update global system settings (joining fee, monthly contribution fee, refund rules, etc.)

### 📜 Notifications

- View all notifications
- Trigger system-wide or user-specific notifications

### 📅 Audit Logs

- View global audit logs
- Filter audit logs by user, action, or entity
- View entity-specific change history

### 👨‍🏫 Member

### 📄 Profile & History

- Update personal information
- View personal details
- View personal contribution analytics
- View personal contribution history
- View personal help history

### 📢 Notifications

- View received notifications
- Mark notification as read

### 📅 Documents

- View/download payment receipts

---

## 📆 Entities & Data Models

### User

Basic member profile.

### Contribution

```
- id
- user_id
- amount
- type: enum[1: Adhesion, 2: Monthly, 3: Meeting, 4: Help Refund]
- status: enum[pending, paid, overdue]
- due_date
- paid_at
- payment_id (nullable)

```

### Payment

```
- id
- amount
- date
- transaction_id
- method
- proof (file or URL)

```

### HelpType

```
- id
- name
- amount
- refund_type: enum[shared_by_all, by_recipient]
- refund_amount
- refund_delay
- refund_period: enum[weekly, monthly]
- condition: function or policy name
- limit: number of uses per user

```

### Help

```
- id
- user_id
- help_type_id
- request_date
- approved_by
- approved_amount
- approved_at
- refunded: boolean

```

### Restriction

```
- id
- user_id
- help_type_id
- expires_at

```

### Meeting

```
- id
- date
- place
- user_id (host)

```

### Tontine

```
- id
- user_id
- meeting_id
- amount
- date
- place (optional override)

```

### ExpenseCategory

```
- id
- name
- description

```

### Expense

```
- id
- amount
- due_date
- paid_date
- category_id
- description
- attachments (optional)

```

### Setting

```
- id
- name: enum[joining_fee, monthly_contribution_fee, ...]
- data: JSON

```

### Post

```
- id
- content
- date
- author_id

```

### Notification

```
- id
- user_id
- type
- title
- content
- read_at
- sent_at

```

### AuditLog

```
- id
- user_id
- action
- description
- entity_type
- entity_id
- changes: json
- created_at

```

---

## 🔄 Relationships Summary

- User has many: Contributions, Payments, Helps, Posts, Notifications, AuditLogs, Meetings (as host), Tontines
- Contribution optionally links to Payment
- Help links to HelpType
- Meeting has many Tontines
- Expense belongs to ExpenseCategory
- Settings and AuditLogs are system-wide

# Notes

Quand une demande passe a approuve. Normalement une transaction de fond en debit pour l'aide dois etre generer et passe en attente. Par la suite on doit enregistrer un payment qui montre que les fonds on ete transferer vers la personne. Ceci entre dans la gestion des transactions.

# En cours

Maintenant nous avons fini avec la generations contributions en l'enregistrement des paiements des contributions.
Maintenant nous passons au details sur les contributions. Plutard nous allons voir les

- La gestion des depenses [ok]
- Les transactions liees au aides [ok]
- Gerer les statistiques.[ok]
- Gerer les notitifications et programmer les relances sur les contributions [ok]

- Gerer l'audit du system. [en attente]
- Le scripts pour changer le statut des contributions en fonction de la date d'echeance.[ok]

---

- Financial Account [ok]
- Others settings [ok]
- Notifications [ok]
- Espace member [ok]

---

- Responsive
- Le Blog

## Notifications.

### Les notifications a envoyer

- `MemberCreated`: Lorsqu'un membre est cree : Le concerne et l'admin.
- `ContributionTransactionPaid`: Lorsqu'on enregistrement la transaction pour une contribution: Tout le monde
- `HelpApproved`: Lorsqu'on approuve une aide : Tout le monde
- `HelpRejected`: Lorsqu'on rejecte uen aide : Le concerne
- `MeetingCreated`: Lorsqu'on enregistrer une reuinion : Tout le monde
- `ContributionPaymentRecall`: Lorsqu'on effectue un rappel manuelle pour une contributions: Les membres selectionnes.
- `ContributionOverdue`: Lorsqu'on effecue un rappel automatique pour une contribution en cas de depassement des delais: Le membre concerne.
- `HelpPaymentRecall`: Lorsqu'on on effectue un rappel pour le paiement d'une aide: l'admin.
