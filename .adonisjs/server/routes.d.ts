import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'signup.create': { paramsTuple?: []; params?: {} }
    'signup.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.archived': { paramsTuple?: []; params?: {} }
    'projects.create': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.restore': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.members.store': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'projects.members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'projects.members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'tasks.store': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'tasks.update': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'tasks.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'signup.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.archived': { paramsTuple?: []; params?: {} }
    'projects.create': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'signup.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.archived': { paramsTuple?: []; params?: {} }
    'projects.create': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'signup.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'projects.members.store': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'tasks.store': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
  }
  PUT: {
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.restore': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'tasks.update': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
  }
  DELETE: {
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'tasks.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}