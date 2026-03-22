import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mulberry-700 to-forest-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-heading text-lg font-bold text-cream">
                Mulberry<span className="text-mulberry-400">Tree</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              A community platform connecting chefs, farmers, and food enthusiasts.
            </p>
          </div>

          <div>
            <h4 className="text-cream font-semibold mb-3">Explore</h4>
            <div className="space-y-2">
              <Link href="/recipes" className="block text-gray-400 hover:text-mulberry-400 text-sm">Recipes</Link>
              <Link href="/courses" className="block text-gray-400 hover:text-mulberry-400 text-sm">Courses</Link>
              <Link href="/events" className="block text-gray-400 hover:text-mulberry-400 text-sm">Events</Link>
            </div>
          </div>

          <div>
            <h4 className="text-cream font-semibold mb-3">Community</h4>
            <div className="space-y-2">
              <Link href="/register?role=chef" className="block text-gray-400 hover:text-mulberry-400 text-sm">Join as Chef</Link>
              <Link href="/register?role=farmer" className="block text-gray-400 hover:text-mulberry-400 text-sm">Join as Farmer</Link>
              <Link href="/register" className="block text-gray-400 hover:text-mulberry-400 text-sm">Join as Member</Link>
            </div>
          </div>

          <div>
            <h4 className="text-cream font-semibold mb-3">Connect</h4>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">hello@mulberrytree.com</p>
              <p className="text-gray-400 text-sm">Follow us on social media</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MulberryTree. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
