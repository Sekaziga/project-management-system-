/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'projects.index': {
    methods: ["GET","HEAD"]
    pattern: '/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['index']>>>
    }
  }
  'projects.create': {
    methods: ["GET","HEAD"]
    pattern: '/projects/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['create']>>>
    }
  }
  'projects.store': {
    methods: ["POST"]
    pattern: '/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['store']>>>
    }
  }
  'projects.show': {
    methods: ["GET","HEAD"]
    pattern: '/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['show']>>>
    }
  }
  'projects.edit': {
    methods: ["GET","HEAD"]
    pattern: '/projects/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['edit']>>>
    }
  }
  'projects.update': {
    methods: ["PUT"]
    pattern: '/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['update']>>>
    }
  }
  'projects.archive': {
    methods: ["PUT"]
    pattern: '/projects/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['archive']>>>
    }
  }
  'projects.destroy': {
    methods: ["DELETE"]
    pattern: '/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/projects_controller').default['destroy']>>>
    }
  }
}
