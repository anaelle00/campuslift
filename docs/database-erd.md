# Database Entity-Relationship Diagram

```mermaid
erDiagram
    AUTH_USERS {
        uuid id PK
        text email
        jsonb raw_user_meta_data
    }

    PROFILES {
        uuid id PK, FK
        text username UK
        text display_name
        text organization
        text phone
        text website
        text bio
        text avatar_url
        text role "user | admin"
        timestamptz created_at
    }

    PROJECTS {
        uuid id PK
        uuid owner_id FK
        text title
        text short_description
        text description
        text category "Tech | Association | Art | Event | Social | Education"
        text status "draft | published | archived"
        text owner_name
        text owner_username
        bigint target_amount
        bigint current_amount "default 0"
        bigint supporters_count "default 0"
        text image_url
        date deadline
        timestamptz created_at
    }

    PLEDGES {
        uuid id PK
        uuid user_id FK
        uuid project_id FK
        integer amount
        text stripe_checkout_session_id UK
        text stripe_payment_intent_id
        timestamptz created_at
    }

    FAVORITES {
        uuid id PK
        uuid user_id FK
        uuid project_id FK
        timestamptz created_at
    }

    COMMENTS {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        uuid parent_id FK "self-referencing"
        text body
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at "soft delete"
    }

    COMMENT_REACTIONS {
        uuid comment_id PK, FK
        uuid user_id PK, FK
        text reaction_type "like | dislike"
        timestamptz created_at
    }

    COMMENT_REPORTS {
        uuid id PK
        uuid comment_id FK
        uuid user_id FK
        text reason "spam | harassment | hate | misinformation | other"
        text details
        text status "open | resolved | dismissed"
        timestamptz created_at
        timestamptz reviewed_at
        uuid reviewed_by FK
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        text type "new_supporter | new_comment"
        text title
        text body
        uuid project_id FK
        boolean read "default false"
        timestamptz created_at
    }

    AUTH_USERS ||--|| PROFILES : "has one"
    AUTH_USERS ||--o{ PROJECTS : "owns"
    AUTH_USERS ||--o{ PLEDGES : "makes"
    AUTH_USERS ||--o{ FAVORITES : "saves"
    AUTH_USERS ||--o{ NOTIFICATIONS : "receives"

    PROJECTS ||--o{ PLEDGES : "receives"
    PROJECTS ||--o{ FAVORITES : "saved by"
    PROJECTS ||--o{ COMMENTS : "has"
    PROJECTS ||--o{ NOTIFICATIONS : "triggers"

    PROFILES ||--o{ COMMENTS : "writes"
    PROFILES ||--o{ COMMENT_REACTIONS : "reacts"
    PROFILES ||--o{ COMMENT_REPORTS : "reports"
    PROFILES ||--o{ COMMENT_REPORTS : "reviews (admin)"

    COMMENTS ||--o{ COMMENTS : "replies to"
    COMMENTS ||--o{ COMMENT_REACTIONS : "has"
    COMMENTS ||--o{ COMMENT_REPORTS : "reported in"

    FAVORITES }o--o{ PROJECTS : "unique(user, project)"
```

## Key Database Constraints

- All tables have **Row Level Security** enabled
- All RLS policies use `(SELECT auth.uid())` for optimal performance
- `support_project` RPC is **SECURITY DEFINER** — bypasses RLS to atomically update counters
- `record_stripe_support` is called by **service_role** which bypasses RLS
- `pledges.stripe_checkout_session_id` has a **unique partial index** for idempotent Stripe processing
- `profiles.username` has a **unique partial index** (WHERE username IS NOT NULL)
- `favorites` has a **unique constraint** on (user_id, project_id)
- Storage buckets enforce **file size limits** (5MB/10MB) and **MIME type restrictions** (image/* only)
- Avatar uploads are restricted to the **user's own folder** via storage RLS
