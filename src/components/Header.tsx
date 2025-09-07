import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Food Matching
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300"
            >
              Login
            </Link>
            <Link 
              href="/register"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}