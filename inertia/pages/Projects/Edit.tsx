import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'

interface Project {
  id: number
  name: string
  description: string
  status: string
}

export default function EditProject({ project }: { project: Project }) {
  const { data, setData, put, processing, errors, setDefaults, reset } = useForm({
    name: project.name,
    description: project.description || '',
    status: project.status,
  })

  useEffect(() => {
    setDefaults({
      name: project.name,
      description: project.description || '',
      status: project.status,
    })
    reset()
  }, [project.id])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/projects/${project.id}`, { replace: true })
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--gray-12)]">Edit Project</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-2xl dark:shadow-black/30 p-6 border border-[var(--gray-3)]">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="w-full border border-[var(--gray-4)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--gray-1)] text-[var(--gray-10)]"
            required
          />
          {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            className="w-full border border-[var(--gray-4)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--gray-1)] text-[var(--gray-10)]"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={data.status}
            onChange={(e) => setData('status', e.target.value)}
            className="w-full border border-[var(--gray-4)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--gray-1)] text-[var(--gray-10)]"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={processing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 disabled:opacity-50"
          >
            {processing ? 'Saving...' : 'Save Changes'}
          </button>
          <a href="/projects" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
