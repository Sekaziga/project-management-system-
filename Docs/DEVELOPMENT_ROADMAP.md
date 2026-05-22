# Development Roadmap

## M1: Secure Core Foundation

Value delivered: A safe, usable single-user project management app.

Includes:

- Project ownership enforcement on every project route
- Server-side project validation
- Better project error handling
- Clean project UI pass
- Finished dashboard or improved authenticated home
- Expanded functional tests
- PostgreSQL verification

MVP definition:

- A user can sign up, log in, create projects, update them, archive/restore them, and delete them
- Users cannot access each other's data
- Core flows are tested
- UI is usable and no longer feels like a starter template

Key decisions before M1:

- Should unauthorized project access return `404` or `403`?
- Should project deletion remain hard delete?
- Should archive store `archived_at` and previous status now or later?
- What max lengths should project fields enforce?

Technical debt checkpoint:

- Add validators
- Centralize project lookup/authorization pattern
- Clean up route naming and redirect consistency

## M2: Task Management

Value delivered: Projects become actionable workspaces.

Includes:

- Tasks table/model/controller
- Task CRUD inside projects
- Task statuses
- Priority and due date
- Task filters
- Task authorization
- Functional tests

Key decisions before M2:

- What task statuses should be supported?
- Should tasks support assignment before teams exist?
- Should completed tasks be hidden by default?
- Should due dates be date-only or datetime?

Technical debt checkpoint:

- Consider a service layer for project/task operations
- Add shared authorization helpers or policies
- Review UI component reuse for forms, badges, and actions

## M3: Dashboard and Work Visibility

Value delivered: Users can understand workload and project health quickly.

Includes:

- Authenticated dashboard
- Project status summary
- Task status summary
- Overdue tasks
- Recently updated projects
- Basic reporting widgets

Key decisions before M3:

- What should users see immediately after login?
- Should dashboard replace `/projects` as the main landing page?
- Which metrics matter most for MVP users?

Technical debt checkpoint:

- Optimize dashboard queries
- Add indexes for common filters
- Avoid loading full models when counts are enough

## M4: Collaboration and Roles

Value delivered: The system becomes useful for small teams.

Includes:

- Project members
- Role-based access: `admin`, `member`, `viewer`
- Add/remove collaborators
- Membership-aware project queries
- Authorization policies
- Tests for every role

Key decisions before M4:

- Is there a workspace/organization concept, or only project-level sharing?
- Can members invite other members?
- Can viewers see comments and files?
- Can ownership be transferred?

Technical debt checkpoint:

- Move authorization into policies or a consistent domain layer
- Audit all routes for ownership/membership checks
- Add database indexes for `project_members`

## M5: Comments and Activity History

Value delivered: Teams gain context and traceability.

Includes:

- Project/task comments
- Activity log system
- Activity timeline
- Comment permissions
- Activity events for project/task/member changes

Key decisions before M5:

- Should comments exist on projects, tasks, or both?
- Should comment edits be tracked?
- How long should activity logs be retained?
- Are activity logs visible to viewers?

Technical debt checkpoint:

- Add event-style domain logging
- Keep activity logs append-only
- Standardize metadata shape

## M6: File Attachments

Value delivered: Project materials can live alongside the work.

Includes:

- File upload/download
- Attachment metadata
- Authorization-protected downloads
- File validation
- Attachment deletion
- Storage abstraction

Key decisions before M6:

- Local disk, S3-compatible storage, or both?
- Max file size?
- Allowed MIME types?
- Should deleted attachments be recoverable?
- Should files attach to projects, tasks, comments, or all three?

Technical debt checkpoint:

- Isolate storage logic behind a service
- Avoid leaking physical file paths
- Add cleanup behavior for failed uploads/deleted records

## M7: Notifications

Value delivered: Users are pulled back into relevant work.

Includes:

- In-app notifications
- Assignment notifications
- Mention notifications
- Project invite notifications
- Due-soon notifications
- Read/unread state

Key decisions before M7:

- In-app only, or email too?
- What events deserve notifications?
- Should users be able to configure notification preferences?
- Should notifications be generated synchronously or through jobs?

Technical debt checkpoint:

- Introduce queue/job infrastructure if needed
- Avoid notification logic scattered across controllers
- Add notification service and event mapping

## M8: Public API

Value delivered: External clients and integrations can use the system.

Includes:

- `/api/v1`
- Token authentication
- Project endpoints
- Task endpoints
- Pagination/filtering
- Rate limiting
- API documentation
- API tests

Key decisions before M8:

- What auth mechanism should API clients use?
- Which resources are public API stable?
- What pagination standard should be used?
- Should API responses use a JSON:API-like structure or custom resources?
- What rate limits are appropriate?

Technical debt checkpoint:

- Ensure web and API share authorization rules
- Add transformer/resource layer
- Version the API from the start

## Recommended Priority

1. M1: Secure Core Foundation
2. M2: Task Management
3. M3: Dashboard
4. M4: Collaboration and Roles
5. M5: Comments and Activity Logs
6. M6: Attachments
7. M7: Notifications
8. M8: Public API

The most important next step is `M1`, especially project ownership enforcement and server-side validation. Without that, every later feature inherits avoidable security risk.
