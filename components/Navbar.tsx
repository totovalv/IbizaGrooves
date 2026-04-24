import Link from 'next/link';
import { Button } from 'antd';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/artists', label: 'Artists' },
  { href: '/mixes', label: 'Mixes' },
  { href: '/merch', label: 'Merch' },
  { href: '/events', label: 'Events', comingSoon: true },
  { href: '/podcasts', label: 'Podcasts', comingSoon: true },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-black/5">
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-black text-2xl group-hover:rotate-12 transition-transform duration-300 text-white">
            I
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic">
            Ibiza<span className="text-orange-500">Grooves</span>
          </span>
        </Link>
        
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label, comingSoon }) => (
            <li key={href}>
              {comingSoon ? (
                <span
                  aria-disabled="true"
                  className="text-xs font-bold uppercase tracking-widest text-gray-300 cursor-not-allowed"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-orange-500 transition-all duration-300"
                >
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
           <Button 
             type="primary" 
             shape="round" 
             size="large" 
             className="hidden sm:flex items-center font-black uppercase tracking-widest text-[10px]"
           >
             Listen Live
           </Button>
        </div>
      </nav>
    </header>
  );
}



