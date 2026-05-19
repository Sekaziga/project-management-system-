import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import type { FC } from 'react'
import type { JSONDataTypes } from '@adonisjs/core/types/transformers'

interface Project {
  [key: string]: JSONDataTypes
  id: number
  name: string
  description: string | null
  status: string
  createdAt: string
}

interface ProjectsIndexProps {
  projects: Project[]
}

const ProjectsIndex: FC<ProjectsIndexProps> = ({ projects }) => {
  function deleteProject(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      router.delete(`/projects/${id}`)
    }
  }

  function archiveProject(id: number) {
    router.put(`/projects/${id}/archive`)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--gray-12)]">Projects</h1>
          <p className="mt-1 text-[var(--gray-7)]">Track active work and move finished items to archive.</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/projects/archived"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--gray-4)] px-4 py-2.5 text-sm font-semibold text-[var(--gray-8)] hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
          >
            Archived
          </Link>
          <Link
            href="/projects/create"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-9)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-10)]"
          >
            + New Project
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-4xl mb-2">📁</p>
          <p>No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-2xl dark:shadow-black/30 p-5 border border-[var(--gray-3)]">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-[var(--gray-12)]">{project.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${project.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                  ${project.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                  ${project.status === 'archived' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''}
                `}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{project.description}</p>
              <div className="flex gap-2">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-[var(--gray-8)]"
                >
                  View
                </Link>
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => archiveProject(project.id)}
                  className="text-sm bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                >
                  Archive
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectsIndex
