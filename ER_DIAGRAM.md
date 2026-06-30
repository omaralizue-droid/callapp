# CallPilot AI Database ER Diagram

This document contains the Entity Relationship Diagram (ERD) of the CallPilot AI database system, visualised using Mermaid.

```mermaid
erDiagram
    ORGANIZATION {
        string id PK
        string name
        string slug UK
        string logoUrl
        boolean isDeleted
        timestamp created_at
        timestamp updated_at
    }

    USER {
        string id PK "Matches auth.users.id"
        string email UK
        string supabaseId UK
        string firstName
        string lastName
        string avatarUrl
        Role role "OWNER | MANAGER | AGENT"
        string organizationId FK
        string teamId FK
        boolean isDeleted
        timestamp created_at
        timestamp updated_at
    }

    TEAM {
        string id PK
        string name
        string description
        string organizationId FK
        boolean isDeleted
        timestamp created_at
        timestamp updated_at
    }

    CALL {
        string id PK
        string title
        string filename
        string fileUrl
        float duration
        int fileSize
        CallStatus status "PENDING | PROCESSING | COMPLETED | FAILED"
        string customer_id
        string customer_name
        string agentId FK
        string teamId FK
        string organizationId FK
        boolean isDeleted
        timestamp created_at
        timestamp updated_at
    }

    CALL_ANALYSIS {
        string id PK
        string call_id FK "1:1 with Call"
        string summary
        json transcript
        Sentiment sentiment_overall "POSITIVE | NEUTRAL | NEGATIVE"
        float sentiment_score
        json coachingTips
        json strengths
        json improvements
        boolean isDeleted
        timestamp created_at
        timestamp updated_at
    }

    QA_REPORT {
        string id PK
        string call_id FK
        string reviewer_id FK
        int score
        json checklist
        string feedback
        boolean isDeleted
        timestamp created_at
        timestamp updated_at
    }

    CRM_NOTE {
        string id PK
        string call_id FK "1:1 with Call"
        string summary
        json keyPoints
        json actionItems
        boolean exported
        timestamp exported_at
        boolean isDeleted
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATION {
        string id PK
        string user_id FK
        string title
        string message
        NotificationType type "CALL_PROCESSED | QA_COMPLETED | SYSTEM_ALERT"
        boolean is_read
        boolean isDeleted
        timestamp created_at
        timestamp updated_at
    }

    ACTIVITY_LOG {
        string id PK
        string user_id FK
        string action
        string details
        string ip_address
        string user_agent
        timestamp created_at
    }

    SETTING {
        string id PK
        string organization_id FK "1:1 with Organization"
        json qaRubric
        json crmIntegrationSettings
        json notificationsConfig
        boolean isDeleted
        timestamp created_at
        timestamp updated_at
    }

    ORGANIZATION ||--o{ USER : "members"
    ORGANIZATION ||--o{ TEAM : "has"
    ORGANIZATION ||--o{ CALL : "owns"
    ORGANIZATION ||--o| SETTING : "configures"

    TEAM ||--o{ USER : "assigned agents"
    TEAM ||--o{ CALL : "associated calls"

    USER ||--o{ CALL : "assigned agent for"
    USER ||--o{ QA_REPORT : "conducts review"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ ACTIVITY_LOG : "performs actions"

    CALL ||--o| CALL_ANALYSIS : "analyzed via"
    CALL ||--o{ QA_REPORT : "assessed under"
    CALL ||--o| CRM_NOTE : "generates notes"
```

## Architectural Decisons

1. **Multi-Tenancy:** The database uses an `organizationId` foreign key boundary for all business-critical tables (Users, Teams, Calls, Settings) to prevent data leaks between enterprise accounts.
2. **Soft Delete:** The `isDeleted` boolean is included in active records. A query filter (or Prisma Middleware) is used to exclude deleted records from analytical computations.
3. **Supabase Integration:** The `users.id` primary key matches Supabase's `auth.users.id`. An trigger automatically hooks database insertions into the public schema when a sign-up occurs.
4. **JSON-B Columns:** Complex arrays and nested structures (transcripts, QA compliance checklists, and prompt configurations) are saved in Postgres JSON-B columns to allow schema flexibility for AI analysis.
