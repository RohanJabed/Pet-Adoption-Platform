import Link from 'next/link';
import PetCard from '../components/PetCard';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHeart, FiSmile, FiShield, FiCheckCircle, FiSearch, FiFileText, FiHome } from 'react-icons/fi';
import { FaQuoteLeft, FaPaw } from 'react-icons/fa6';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function getServerSideProps() {
  try {
    const res = await fetch(`${API_URL}/api/pets?status=available`);
    const pets = await res.json();
    return { props: { featuredPets: pets.slice(0, 6) } };
  } catch {
    return { props: { featuredPets: [] } };
  }
}

export default function Home({ featuredPets }) {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-600 font-bold text-xs uppercase tracking-wide rounded-full mb-6">
              <FiHeart /> Find Your Perfect Companion
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-800 dark:text-white">
              Adopting a Friend Means{' '}
              <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">Saving a Life</span>
            </h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Browse hundreds of available dogs, cats, birds, and rabbits seeking loving owners. Give a pet a second chance at happiness today.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/all-pets" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-7 py-4 rounded-2xl text-lg transition-all hover:-translate-y-1 shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
                Adopt Now <FiArrowRight />
              </Link>
              <a href="#why-adopt" className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold px-7 py-4 rounded-2xl text-lg transition-all hover:-translate-y-1">
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div className="relative flex justify-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="absolute inset-0 bg-radial-violet opacity-20 rounded-3xl" />
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800"
              alt="Happy golden retriever"
              className="w-full max-w-md h-[480px] object-cover rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 relative z-10"
            />
            <div className="absolute bottom-6 -left-4 z-20 flex items-center gap-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 px-5 py-3 rounded-xl shadow-lg animate-bounce">
              <FiSmile className="text-violet-600 text-3xl" />
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white">1,200+</h4>
                <p className="text-xs text-gray-500 font-semibold">Pets Adopted</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3">Meet Our Featured Friends</h2>
            <p className="text-gray-500">Take a look at some of our wonderful companions waiting to meet you</p>
          </div>

          {featuredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center">
              <p className="text-gray-500">No available pets found. Start by listing a pet in the shelter dashboard!</p>
              <Link href="/dashboard/add-pet" className="bg-violet-600 text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-violet-700 transition-colors">Add Pet</Link>
            </div>
          )}

          {featuredPets.length > 0 && (
            <div className="flex justify-center mt-14">
              <Link href="/all-pets" className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:-translate-y-0.5">
                View All Available Pets <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Adopt */}
      <section id="why-adopt" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3">Why Adopt Instead of Buy?</h2>
            <p className="text-gray-500">Understanding the incredible impact of pet adoption</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FiHeart />, title: 'Save a Precious Life', desc: 'Every year, millions of healthy, adoptable animals are euthanized due to shelter overcrowding. Adopting frees up space and gives a pet a new life.' },
              { icon: <FiShield />, title: 'Support Ethical Treatment', desc: 'By adopting from shelters or private owners, you fight commercial puppy mills and cruel breeding operations that put profit over animal welfare.' },
              { icon: <FiSmile />, title: 'Healthy, Vaccinated Pets', desc: 'Shelter pets undergo rigorous medical inspections, behavior evaluations, and are vaccinated and microchipped before entering their new homes.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-10 hover:-translate-y-1 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-2xl mb-6">{icon}</div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="stories" className="py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3">Happy Tails & Success Stories</h2>
            <p className="text-gray-500">Real stories of families who found their perfect match</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { text: '"We adopted Barnaby (a 3-year-old Beagle) last winter, and our lives have changed completely. He is incredibly friendly, loves outdoor hikes, and has become the soul of our home. Pawsitive made the adoption request process completely transparent and smooth!"', name: 'Sarah Jenkins', sub: 'Adopted Barnaby (Beagle)', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
              { text: '"Finding a companion for my grandmother was simple here. We searched for a calm cat, filtered by senior age, and found Misty. Misty is gentle, healthy, and keeps my grandma company every day. Truly thankful to the owner who kept her in such great health."', name: 'Marcus Sterling', sub: 'Adopted Misty (Ragdoll Cat)', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
            ].map(({ text, name, sub, img }) => (
              <div key={name} className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-10">
                <FaQuoteLeft className="absolute top-8 right-8 text-3xl text-violet-100 dark:text-violet-900" />
                <p className="italic text-gray-500 text-base leading-relaxed mb-8">{text}</p>
                <div className="flex items-center gap-4">
                  <img src={img} alt={name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">{name}</h4>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3">How Adoption Works</h2>
            <p className="text-gray-500">Three simple steps to find and welcome your new best friend home</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-violet-200 via-violet-400 to-violet-200 dark:from-violet-900 dark:via-violet-600 dark:to-violet-900" />
            {[
              { step: '01', icon: <FiSearch className="text-2xl" />, title: 'Browse & Discover', desc: 'Explore hundreds of available pets filtered by species, breed, age, and location. Use our smart search to find your perfect match.' },
              { step: '02', icon: <FiFileText className="text-2xl" />, title: 'Submit a Request', desc: 'Found the one? Fill out a simple adoption request with your preferred pickup date and a short message to the owner or shelter.' },
              { step: '03', icon: <FiHome className="text-2xl" />, title: 'Welcome Them Home', desc: 'Once your request is approved, coordinate with the owner and bring your new companion home to start your journey together.' },
            ].map(({ step, icon, title, desc }) => (
              <motion.div
                key={step}
                className="relative flex flex-col items-center text-center p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center">
                    {icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-extrabold flex items-center justify-center">{step}</span>
                </div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Link href="/all-pets" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-7 py-4 rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
              Start Browsing Pets <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Care Tips */}
      <section id="tips" className="py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3">New Pet Parent Care Tips</h2>
            <p className="text-gray-500">Essential tips to help your newly adopted pet settle into their forever home</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { title: 'Give Them Space (The 3-3-3 Rule)', desc: 'Understand that your pet needs 3 days to decompress, 3 weeks to learn your routine, and 3 months to feel fully secure in their new environment.' },
              { title: 'Establish a Regular Routine', desc: 'Keep feeding times, walks, and sleeping arrangements consistent. Predictability reduces anxiety and builds confidence in nervous animals.' },
              { title: 'Visit a Vet Within the First Week', desc: 'Even though our pets come with health certificates, getting a baseline checkup with your local veterinarian helps establish a health log early on.' },
              { title: 'Patience & Positive Reinforcement', desc: 'Always reward positive behavior with treats or affection. Never punish a pet for accidents while they are adapting to new surroundings.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-green-500 text-xl shrink-0" />
                  <h4 className="font-bold text-gray-800 dark:text-white">{title}</h4>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed pl-8">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Meet Our Team */}
      <section id="team" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3">Meet the People Behind Pawsitive</h2>
            <p className="text-gray-500">A passionate team of animal lovers dedicated to connecting pets with forever homes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Emily Carter', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300', desc: 'Animal welfare advocate with 10+ years in rescue operations.' },
              { name: 'James Thornton', role: 'Head of Shelter Relations', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300', desc: 'Coordinates with 200+ shelters nationwide to keep listings up to date.' },
              { name: 'Priya Nair', role: 'Lead Developer', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=300', desc: 'Full-stack engineer who built the platform from the ground up.' },
              { name: 'Carlos Rivera', role: 'Veterinary Advisor', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', desc: 'Licensed vet ensuring all listed pets meet health and safety standards.' },
            ].map(({ name, role, img, desc }) => (
              <motion.div
                key={name}
                className="flex flex-col items-center text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative mb-4">
                  <img src={img} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-violet-100 dark:border-violet-900/40 shadow-md" />
                  <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center">
                    <FaPaw className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{name}</h3>
                <span className="text-xs font-semibold text-violet-600 bg-violet-100 dark:bg-violet-900/30 px-3 py-1 rounded-full mt-1 mb-3">{role}</span>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
