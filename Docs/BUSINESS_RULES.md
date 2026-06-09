# Business Rules

## Authentication Rules

- Users must register with a valid email and password.
- Email addresses must be unique.
- Passwords must be hashed before storage.
- Login requires valid credentials.
- Authenticated users cannot access login/signup pages.
- Unauthenticated users cannot access protected project routes.
- Logout must invalidate the active session.

## Authorization Rules

- Every project must belong to a user.
- A user may only access projects they own or projects shared with them.
- Project access must be enforced server-side on every route.
- The system must never trust project IDs alone for authorization.
- All project queries should be scoped by authenticated user ownership or membership.
- Future shared access should be enforced through roles and project memberships.

### Recommended future roles

- `admin`: Full control, can delete project, manage members, change roles
- `member`: Can create/edit tasks, comment, upload files, update project content
- `viewer`: Can read project data but cannot modify it

## Project Ownership Rules

- A project must have exactly one owner.
- The creator of a project becomes its owner.
- Owners can archive, restore, update, and delete their own projects.
- Future collaborators must receive access through an explicit project membership record.
- A user removed from a project should immediately lose access.

## Project Status Rules

Current statuses:

- `active`
- `completed`
- `archived`

Recommended transition rules:

- `active -> completed`: allowed when the project is finished.
- `completed -> active`: allowed if work resumes.
- `active -> archived`: allowed when the project should be hidden from active views.
- `completed -> archived`: allowed when completed work should be stored historically.
- `archived -> active`: allowed via restore.
- `archived -> completed`: optional, but preferably restore to previous status instead of forcing active.

Recommended improvement:

- Store `archived_at`
- Store `previous_status` before archiving
- Restore should return the project to its previous non-archived status

## Project Validation Rules

- `name`: required
- `name`: string
- `name`: recommended max length `120` to `150`
- `description`: optional
- `description`: recommended max length `5000`
- `status`: required on update if submitted
- `status`: must be one of `active`, `completed`, `archived`
- `user_id`: must come from the authenticated session, not the request body

Validation must happen server-side using Adonis validators. Client-side validation can improve UX but must not be the source of truth.

## Task Rules

Future task fields:

- `project_id`
- `title`
- `description`
- `status`
- `priority`
- `due_date`
- `assigned_to`
- timestamps

Task rules:

- Tasks must belong to a project.
- Users can only see tasks inside projects they can access.
- Task assignees must be members of the project.
- Deleting a project should delete or archive its tasks according to the chosen retention model.
- Task status should use controlled values such as `todo`, `in_progress`, `blocked`, `done`.

## Comment Rules

- Comments must belong to a project, task, or both.
- Only users with project access may comment.
- Users may edit/delete their own comments.
- Admins/owners may moderate comments.
- Comment edits should optionally be tracked later.

## Attachment Rules

- Attachments must belong to a project or task.
- Only authorized project users can upload/download attachments.
- File size and MIME type restrictions must be enforced server-side.
- Attachments should store metadata: filename, storage path, MIME type, size, uploader, timestamps.
- Deleting a project should delete, archive, or detach attachments based on retention policy.

## Activity Log Rules

- Important user actions should create activity records.
- Activity logs should be append-only.
- Examples:
  - project created
  - project updated
  - project archived/restored
  - task created/completed
  - member invited/removed
  - file uploaded
  - comment added
- Activity records should include actor, action, target type, target ID, timestamp, and metadata.

## Notification Rules

- Notifications should be generated for meaningful events.
- Examples:
  - user assigned to a task
  - mentioned in a comment
  - project shared with user
  - task due soon
- Users should be able to mark notifications as read.
- Notification delivery can start in-app before email or external integrations.

## Deletion Rules

Current behavior:

- Deleting a user cascades deletion of their projects.
- Deleting a project permanently removes it.

Recommended rules:

- Keep archive separate from delete.
- Only project owners/admins can delete projects.
- Consider soft delete for projects before adding collaboration and files.
- If hard delete remains:
  - delete tasks
  - delete comments
  - delete activity logs or retain anonymized history
  - delete file records and remove physical files
- Deletion should require confirmation in the UI.
- For teams, deletion may require owner role.

## Future Multi-User Rules

- A project can have many members.
- A user can belong to many projects.
- Membership must include a role.
- The owner cannot be removed unless ownership is transferred.
- There must always be at least one owner/admin for a shared project.
- Invitations should expire.
- Invited users should only gain access after accepting.
