import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ChefHat, Tractor, BookOpen, Calendar, Users, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mulberry-950/80 via-charcoal to-forest-950/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-6xl font-bold text-cream mb-6">
              Where Food Meets
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-mulberry-400 to-earth-400">
                Community
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              MulberryTree connects chefs, farmers, and food enthusiasts. Share recipes,
              learn through courses, and discover local food events.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg">Join the Community</Button>
              </Link>
              <Link href="/recipes">
                <Button variant="secondary" size="lg">Browse Recipes</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-heading text-3xl font-bold text-cream text-center mb-12">
          Everything in One Place
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<ChefHat className="text-mulberry-400" size={32} />}
            title="Recipes"
            description="Discover and share recipes from talented chefs. Rate, save, and cook dishes from around the world."
            link="/recipes"
          />
          <FeatureCard
            icon={<BookOpen className="text-earth-400" size={32} />}
            title="Courses"
            description="Learn from expert chefs through structured courses. From beginner basics to advanced techniques."
            link="/courses"
          />
          <FeatureCard
            icon={<Calendar className="text-forest-400" size={32} />}
            title="Events"
            description="Join workshops, farmers markets, harvest festivals, and tasting events in your area."
            link="/events"
          />
        </div>
      </section>

      {/* Roles Section */}
      <section className="bg-charcoal-light border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="font-heading text-3xl font-bold text-cream text-center mb-12">
            A Place for Everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoleCard
              icon={<ChefHat size={40} />}
              role="Chefs"
              color="mulberry"
              features={[
                'Share your signature recipes',
                'Create and teach courses',
                'Build your culinary brand',
                'Connect with local farmers',
              ]}
            />
            <RoleCard
              icon={<Tractor size={40} />}
              role="Farmers"
              color="forest"
              features={[
                'Announce farmers markets',
                'Share harvest events',
                'Connect with local chefs',
                'Showcase your produce',
              ]}
            />
            <RoleCard
              icon={<Users size={40} />}
              role="Food Lovers"
              color="earth"
              features={[
                'Discover amazing recipes',
                'Enroll in cooking courses',
                'Attend food events',
                'Rate and review dishes',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem value="1,000+" label="Recipes" />
          <StatItem value="200+" label="Chefs" />
          <StatItem value="150+" label="Courses" />
          <StatItem value="500+" label="Events" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-gradient-to-r from-mulberry-900/50 to-forest-900/50 border border-gray-700 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-cream mb-4">
            Ready to Join?
          </h2>
          <p className="text-gray-300 mb-6">
            Whether you cook, grow, or simply love great food -- there is a place for you here.
          </p>
          <Link href="/register">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }) {
  return (
    <Link href={link}>
      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6 hover:border-mulberry-800 transition-all duration-300 h-full">
        <div className="mb-4">{icon}</div>
        <h3 className="font-heading text-xl font-semibold text-cream mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </Link>
  );
}

function RoleCard({ icon, role, color, features }) {
  const colors = {
    mulberry: 'from-mulberry-900/30 to-mulberry-950/50 border-mulberry-800/30 text-mulberry-400',
    forest: 'from-forest-900/30 to-forest-950/50 border-forest-700/30 text-forest-400',
    earth: 'from-earth-900/30 to-earth-950/50 border-earth-800/30 text-earth-400',
  };

  return (
    <div className={`bg-gradient-to-b ${colors[color]} border rounded-xl p-6`}>
      <div className={`mb-4 ${colors[color].split(' ').pop()}`}>{icon}</div>
      <h3 className="font-heading text-xl font-semibold text-cream mb-4">For {role}</h3>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <Star size={14} className="text-earth-400 mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div>
      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mulberry-400 to-earth-400">
        {value}
      </div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  );
}
