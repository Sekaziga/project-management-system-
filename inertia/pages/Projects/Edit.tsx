import { useForm } from '@inertiajs/react'

interface Project {
  id: number
  name: string
  description: string
  status: string
}

export default function EditProject({ project }: { project: Project }) {
  const { data, setData, put, processing, errors } = useForm({
    name: project.name,
    description: project.description || '',
    status: project.status,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/projects/${project.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={data.status}
            onChange={(e) => setData('status', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? 'Saving...' : 'Save Changes'}
          </button>
          <a href="/projects" className="bg-gray-100 px-6 py-2 rounded-lg hover:bg-gray-200">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}