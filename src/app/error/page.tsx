export default function ErrorPage() {
  return (
    <div
      style={{ fontFamily: "monospace" }}
      className="min-h-screen bg-gray-950 text-gray-300 flex flex-col"
    >
      {/* Barra de status tipo terminal */}
      <div className="bg-red-900/40 border-b border-red-800/50 px-6 py-2 flex items-center gap-3 text-xs">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
        <span className="text-red-400 font-bold tracking-widest uppercase">
          Service Unavailable
        </span>
        <span className="ml-auto text-gray-500">HTTP 503</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">

          <div className="mb-6">
            <span className="text-7xl font-bold text-red-600/80 leading-none select-none">
              503
            </span>
          </div>

          <h1 className="text-xl text-white font-semibold mb-2">
            Service Temporarily Unavailable
          </h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            The server is temporarily unable to handle the request due to
            maintenance downtime or capacity problems. Please try again later.
          </p>

          <div className="bg-gray-900 border border-gray-800 rounded-md p-4 text-xs leading-relaxed text-gray-500 mb-8">
            <p>
              <span className="text-gray-600">[{new Date().toUTCString()}]</span>
            </p>
            <p className="mt-1">
              <span className="text-red-500">ERROR</span> connect ECONNREFUSED
              — upstream connect error or disconnect/reset before headers
            </p>
            <p className="mt-1">
              <span className="text-yellow-600">WARN</span> reset reason: connection
              failure, transport failure reason: delayed connect error
            </p>
            <p className="mt-1 text-gray-600">
              upstream: &quot;http://backend-service:8080&quot;
            </p>
          </div>

          <div className="border border-gray-800 rounded-md px-4 py-3 text-xs text-gray-500 flex gap-3 items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <span>
              If the problem persists, contact the system administrator or check
              the service status page for ongoing incidents.
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800/60 px-6 py-3 flex items-center justify-between text-xs text-gray-700">
        <span>nginx/1.24.0</span>
        <span>Request ID: {Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
      </div>
    </div>
  );
}
