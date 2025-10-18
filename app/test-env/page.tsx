/**
 * Test Environment Page
 * Used for debugging environment variables and configuration
 */

export default function TestEnvPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Environment Test</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-700">
            This page is used for testing environment configuration.
          </p>
          <div className="mt-4">
            <a href="/api/test-env" className="text-blue-600 hover:underline">
              Test Environment API →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
