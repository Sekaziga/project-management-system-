/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  projects: {
    index: typeof routes['projects.index']
    create: typeof routes['projects.create']
    store: typeof routes['projects.store']
    show: typeof routes['projects.show']
    edit: typeof routes['projects.edit']
    update: typeof routes['projects.update']
    archive: typeof routes['projects.archive']
    destroy: typeof routes['projects.destroy']
  }
}
