import { Link } from '@adonisjs/inertia/react'

interface Project {
  id: number
  name: string
  description: string | null
  status: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export default function ProjectShow({ project }: { project: Project }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/projects/${project.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <Link
            href="/projects"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
          >
            Back to Projects
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium
            ${project.status === 'active' ? 'bg-green-100 text-green-700' : ''}
            ${project.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
            ${project.status === 'archived' ? 'bg-gray-100 text-gray-700' : ''}
          `}>
            {project.status}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
          <p className="text-gray-700">{project.description || 'No description provided.'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="text-gray-500">Created</h3>
            <p className="text-gray-700">{new Date(project.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-gray-500">Updated</h3>
            <p className="text-gray-700">{new Date(project.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
