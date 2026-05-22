# Development Phases

## Current Status Snapshot

Assessed from the repository state on `2026-05-22`.

- Phase 1: `Mostly complete`
- Phase 2: `Current phase / in progress`
- Phase 3: `Not started`
- Phase 4: `Not started`
- Phase 5: `Not started`
- Phase 6: `Not started`
- Phase 7: `Not started`
- Phase 8: `Not started`
- Phase 9: `Not started`

Notes:

- Phase 1 appears largely implemented: project validation, ownership enforcement, and cross-user access tests exist in the codebase.
- Phase 2 is the best match for the current working phase because the app still uses the default starter home page, so the UI productization pass is not complete yet.

## Phase 1: Stabilize Current Core

Status: `Mostly complete`

Goal: Make the existing project module secure, validated, and production-ready.

Features and tasks:

- Add server-side validators for project create/update
- Enforce project ownership on `show`, `edit`, `update`, `archive`, `restore`, and `destroy`
- Remove debug logging from tests/controllers
- Add tests proving users cannot access other users' projects
- Improve error handling for unauthorized access
- Confirm PostgreSQL migration compatibility
- Review route names and redirects

Definition of done:

- All project actions are scoped to the authenticated user
- Invalid project payloads are rejected server-side
- Cross-user access tests pass
- Existing CRUD tests pass
- No project can be accessed by ID without ownership

Dependencies:

- Existing auth and project module

Complexity: `Medium`

## Phase 2: Productize the Existing UI

Status: `Current phase / in progress`

Goal: Turn the starter-like app into a polished project management interface.

Features and tasks:

- Replace default home page with authenticated dashboard or product-aware landing
- Add empty states for active and archived projects
- Improve project detail page
- Add consistent form validation error display
- Add accessible buttons, labels, focus states, and keyboard behavior
- Add confirmation dialog for delete/archive actions
- Add loading/processing states
- Improve mobile sidebar behavior
- Standardize status badges

Definition of done:

- App no longer feels like a starter template
- Users can understand their workspace immediately after login
- UI remains clean, minimal, and accessible
- Forms show server validation errors clearly
- Navigation works well on desktop and mobile

Dependencies:

- Phase 1 security fixes preferred

Complexity: `Medium`

## Phase 3: Tasks / To-Dos

Status: `Not started`

Goal: Add task management inside projects.

Features and tasks:

- Create `tasks` table
- Add Task model
- Add task controller/routes
- Add task validators
- Add project task list UI
- Add create/edit/delete task flows
- Add task status values: `todo`, `in_progress`, `blocked`, `done`
- Add optional priority and due date
- Add task filtering by status
- Add tests for task CRUD and authorization

Definition of done:

- Users can create tasks inside their projects
- Tasks are scoped through project ownership
- Users cannot access tasks from another user's project
- Task status can be updated
- Project detail page shows related tasks

Dependencies:

- Phase 1 required

Complexity: `Medium`

## Phase 4: Dashboard and Reporting

Status: `Not started`

Goal: Give users visibility across their work.

Features and tasks:

- Add dashboard route/page
- Show project counts by status
- Show task counts by status
- Show overdue tasks
- Show recently updated projects
- Show archived/completed project summaries
- Add simple database queries or service layer for dashboard stats
- Add tests for dashboard access and data scoping

Definition of done:

- Authenticated users land on a useful dashboard
- Dashboard only includes data the user can access
- Counts are accurate
- UI is simple and scannable

Dependencies:

- Phase 3 for task-based dashboard metrics

Complexity: `Medium`

## Phase 5: Team Members and Collaborators

Status: `Not started`

Goal: Support shared projects.

Features and tasks:

- Create `project_members` table
- Define roles: `admin`, `member`, `viewer`
- Add membership model
- Add authorization policies
- Add invite/add/remove member flows
- Add project members page or panel
- Update all project/task queries to use ownership or membership
- Add tests for role-based project access
- Prevent removing the final admin/owner

Definition of done:

- Project owners can add collaborators
- Collaborators can access shared projects
- Permissions differ by role
- Unauthorized users remain blocked
- All queries respect ownership or membership

Dependencies:

- Phase 1 required
- Phase 3 recommended

Complexity: `High`

## Phase 6: Comments and Activity Logs

Status: `Not started`

Goal: Add collaboration history and discussion.

Features and tasks:

- Create `comments` table
- Create `activity_logs` table
- Add comments to projects and/or tasks
- Add activity logging service
- Log core actions automatically
- Show activity timeline on project detail page
- Add tests for comment authorization and activity creation

Definition of done:

- Authorized users can comment
- Unauthorized users cannot read/write comments
- Important project/task actions create activity records
- Activity timeline is visible and ordered

Dependencies:

- Phase 5 preferred for meaningful collaboration

Complexity: `Medium`

## Phase 7: File Attachments

Status: `Not started`

Goal: Allow users to attach files to projects/tasks.

Features and tasks:

- Configure storage strategy
- Create `attachments` table
- Add upload endpoint
- Add download endpoint with authorization
- Add file type and size validation
- Add attachment UI
- Add deletion flow
- Add tests for upload/download authorization

Definition of done:

- Users can upload files to accessible projects/tasks
- Files cannot be downloaded by unauthorized users
- Invalid file types/sizes are rejected
- Attachment metadata is stored reliably

Dependencies:

- Phase 5 preferred
- Phase 6 optional

Complexity: `High`

## Phase 8: Notifications

Status: `Not started`

Goal: Notify users about relevant project activity.

Features and tasks:

- Create `notifications` table
- Add notification creation service
- Generate notifications for assignment, mentions, invites, and due tasks
- Add notification dropdown/page
- Add read/unread handling
- Add tests for notification creation and visibility

Definition of done:

- Users see only their own notifications
- Notifications are generated for selected events
- Users can mark notifications as read
- Notification system is extensible

Dependencies:

- Phase 3 for assignments
- Phase 5 for teams
- Phase 6 for mentions/activity

Complexity: `Medium`

## Phase 9: Public API

Status: `Not started`

Goal: Expose stable external endpoints.

Features and tasks:

- Design API versioning: `/api/v1`
- Add token-based API authentication
- Add JSON resource/transformer layer
- Add project endpoints
- Add task endpoints
- Add pagination, filtering, and sorting
- Add rate limiting
- Add API tests
- Add basic API documentation

Definition of done:

- API consumers can authenticate securely
- API responses are consistent
- Access control matches web app permissions
- Public API does not expose internal-only fields
- Tests cover success and failure paths

Dependencies:

- Stable domain rules from earlier phases

Complexity: `High`
