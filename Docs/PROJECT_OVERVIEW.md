# Project Overview

## Product Summary

This application is a lightweight project management system for individuals and small teams who need a clean way to organize projects, track work, and collaborate without the complexity of enterprise tools.

The product currently supports user accounts and project CRUD. It is intended to evolve into a focused workspace where users can manage projects, tasks, collaborators, files, comments, notifications, and activity history.

## Core Value Proposition

The system helps users keep project work organized in one place:

- Create and manage projects
- Track project status
- Break projects into tasks
- Collaborate with team members
- Keep a history of project activity
- Centralize discussions, attachments, and updates
- Provide visibility through dashboards and reporting

The product should remain simple, fast, and accessible rather than becoming a heavy enterprise platform.

## Target Users

- Solo operator / freelancer: Manages client projects, deadlines, notes, and task lists.
- Small team lead: Coordinates work across a few collaborators and needs project visibility.
- Team member: Needs to see assigned work, comment on tasks, update progress, and upload files.
- Read-only stakeholder: Needs visibility into project status without editing core data.
- Admin / workspace owner: Manages users, permissions, project access, and system-level settings.

## Current Features

- User registration
- Login and logout
- Auth-protected project routes
- Project CRUD
- Project statuses: `active`, `completed`, `archived`
- Archive and restore flow
- User-owned project records
- Sidebar navigation
- Projects list page
- Create and edit project forms
- Archived projects page
- Dark mode toggle
- Functional tests for project CRUD

## Planned Features

- Tasks / to-dos inside projects
- Task assignment and status tracking
- Team members and collaborators
- Project comments
- Activity logs
- File attachments
- Notifications
- Dashboard and reporting
- Role-based access control
- Public API
- API authentication
- Auditability and stronger authorization policies

## Scope Boundaries

### The system will do

- Manage user-owned and team-accessible projects
- Track project-level and task-level work
- Support collaboration through comments, activity, files, and notifications
- Provide a clean internal productivity UI
- Expose a public API after internal domain rules are stable

### The system will not initially do

- Complex enterprise portfolio management
- Billing, invoicing, or accounting
- Time tracking unless added later
- Real-time chat as a primary feature
- Complex workflow automation
- External integrations such as Slack, Jira, GitHub, or Google Drive in the MVP
- Multi-tenant enterprise organizations unless intentionally introduced later
