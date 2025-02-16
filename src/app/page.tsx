export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#13111A] text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to AI Dashboard</h1>
      <p className="text-xl text-gray-400">Your intelligent assistant is ready to help.</p>
      <div className="mt-8 space-y-4">
        <div className="p-6 bg-[#1A1721] rounded-lg max-w-md">
          <h2 className="text-2xl font-semibold mb-2">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Smart Task Management</li>
            <li>Real-time Analytics</li>
            <li>AI-powered Insights</li>
            <li>Customizable Dashboard</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
