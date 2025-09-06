import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Pokemon Alert Bot
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Never miss another Pokemon card restock! Get instant alerts from your favorite retailers.
          </p>
          
          {/* Navigation Links for Testing */}
          <div className="mb-8">
            <div className="flex justify-center space-x-4">
              <Link 
                href="/auth/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Sign Up
              </Link>
              <Link 
                href="/dashboard"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              We're building the ultimate Pokemon card stock tracking system. 
              Monitor restocks from Pokemon Center, Best Buy, Walmart, Target, and more!
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>✅ Real-time stock monitoring</div>
              <div>✅ Multi-store support</div>
              <div>✅ Instant notifications</div>
              <div>✅ Community reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}