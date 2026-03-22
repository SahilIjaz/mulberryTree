import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = { title: 'Sign Up - MulberryTree' };

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mulberry-700 to-forest-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-cream">Join MulberryTree</h1>
          <p className="text-gray-400 mt-1">Create your account and start exploring</p>
        </div>

        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6 sm:p-8">
          <RegisterForm />
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-mulberry-400 hover:text-mulberry-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
