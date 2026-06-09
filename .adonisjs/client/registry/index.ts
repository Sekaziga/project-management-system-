/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'signup.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['signup.create']['types'],
  },
  'signup.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['signup.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.archived': {
    methods: ["GET","HEAD"],
    pattern: '/projects/archived',
    tokens: [{"old":"/projects/archived","type":0,"val":"projects","end":""},{"old":"/projects/archived","type":0,"val":"archived","end":""}],
    types: placeholder as Registry['projects.archived']['types'],
  },
  'projects.create': {
    methods: ["GET","HEAD"],
    pattern: '/projects/create',
    tokens: [{"old":"/projects/create","type":0,"val":"projects","end":""},{"old":"/projects/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['projects.create']['types'],
  },
  'projects.store': {
    methods: ["POST"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.store']['types'],
  },
  'projects.show': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.show']['types'],
  },
  'projects.edit': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id/edit',
    tokens: [{"old":"/projects/:id/edit","type":0,"val":"projects","end":""},{"old":"/projects/:id/edit","type":1,"val":"id","end":""},{"old":"/projects/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['projects.edit']['types'],
  },
  'projects.update': {
    methods: ["PUT"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.update']['types'],
  },
  'projects.archive': {
    methods: ["PUT"],
    pattern: '/projects/:id/archive',
    tokens: [{"old":"/projects/:id/archive","type":0,"val":"projects","end":""},{"old":"/projects/:id/archive","type":1,"val":"id","end":""},{"old":"/projects/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['projects.archive']['types'],
  },
  'projects.restore': {
    methods: ["PUT"],
    pattern: '/projects/:id/restore',
    tokens: [{"old":"/projects/:id/restore","type":0,"val":"projects","end":""},{"old":"/projects/:id/restore","type":1,"val":"id","end":""},{"old":"/projects/:id/restore","type":0,"val":"restore","end":""}],
    types: placeholder as Registry['projects.restore']['types'],
  },
  'projects.destroy': {
    methods: ["DELETE"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.destroy']['types'],
  },
  'projects.members.store': {
    methods: ["POST"],
    pattern: '/projects/:projectId/members',
    tokens: [{"old":"/projects/:projectId/members","type":0,"val":"projects","end":""},{"old":"/projects/:projectId/members","type":1,"val":"projectId","end":""},{"old":"/projects/:projectId/members","type":0,"val":"members","end":""}],
    types: placeholder as Registry['projects.members.store']['types'],
  },
  'projects.members.update': {
    methods: ["PUT"],
    pattern: '/projects/:projectId/members/:id',
    tokens: [{"old":"/projects/:projectId/members/:id","type":0,"val":"projects","end":""},{"old":"/projects/:projectId/members/:id","type":1,"val":"projectId","end":""},{"old":"/projects/:projectId/members/:id","type":0,"val":"members","end":""},{"old":"/projects/:projectId/members/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.members.update']['types'],
  },
  'projects.members.destroy': {
    methods: ["DELETE"],
    pattern: '/projects/:projectId/members/:id',
    tokens: [{"old":"/projects/:projectId/members/:id","type":0,"val":"projects","end":""},{"old":"/projects/:projectId/members/:id","type":1,"val":"projectId","end":""},{"old":"/projects/:projectId/members/:id","type":0,"val":"members","end":""},{"old":"/projects/:projectId/members/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.members.destroy']['types'],
  },
  'tasks.store': {
    methods: ["POST"],
    pattern: '/projects/:projectId/tasks',
    tokens: [{"old":"/projects/:projectId/tasks","type":0,"val":"projects","end":""},{"old":"/projects/:projectId/tasks","type":1,"val":"projectId","end":""},{"old":"/projects/:projectId/tasks","type":0,"val":"tasks","end":""}],
    types: placeholder as Registry['tasks.store']['types'],
  },
  'tasks.update': {
    methods: ["PUT"],
    pattern: '/projects/:projectId/tasks/:id',
    tokens: [{"old":"/projects/:projectId/tasks/:id","type":0,"val":"projects","end":""},{"old":"/projects/:projectId/tasks/:id","type":1,"val":"projectId","end":""},{"old":"/projects/:projectId/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/projects/:projectId/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.update']['types'],
  },
  'tasks.destroy': {
    methods: ["DELETE"],
    pattern: '/projects/:projectId/tasks/:id',
    tokens: [{"old":"/projects/:projectId/tasks/:id","type":0,"val":"projects","end":""},{"old":"/projects/:projectId/tasks/:id","type":1,"val":"projectId","end":""},{"old":"/projects/:projectId/tasks/:id","type":0,"val":"tasks","end":""},{"old":"/projects/:projectId/tasks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tasks.destroy']['types'],
  },
  'comments.store': {
    methods: ["POST"],
    pattern: '/projects/:projectId/comments',
    tokens: [{"old":"/projects/:projectId/comments","type":0,"val":"projects","end":""},{"old":"/projects/:projectId/comments","type":1,"val":"projectId","end":""},{"old":"/projects/:projectId/comments","type":0,"val":"comments","end":""}],
    types: placeholder as Registry['comments.store']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
