import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'

interface Project {
  id: number
  name: string
  description: string
  status: string
  created_at: string
}

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
  function deleteProject(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      router.delete(`/projects/${id}`)
    }
  }

  function archiveProject(id: number) {
    router.put(`/projects/${id}/archive`)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/projects/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-2">📁</p>
          <p>No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-5 border">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${project.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                  ${project.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
                  ${project.status === 'archived' ? 'bg-gray-100 text-gray-700' : ''}
                `}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">{project.description}</p>
              <div className="flex gap-2">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                >
                  View
                </Link>
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => archiveProject(project.id)}
                  className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200"
                >
                  Archive
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
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