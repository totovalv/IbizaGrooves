import { Button } from 'antd';

interface HeroSectionProps {
  subtitle?: string;
}


export default function HeroSection({
  subtitle = 'Live Radio · DJ Mixes · Ibiza Vibes',
}: HeroSectionProps) {

  return (
    <section
      className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#fdfdfd]"
      aria-label="Hero"
    >
      {/* Background Gradient - Light & Airy */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(circle at 20% 30%, #ff6b35 0%, transparent 50%), radial-gradient(circle at 80% 70%, #f7931e 0%, transparent 50%)',
          }}
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-gray-900 tracking-tighter uppercase italic drop-shadow-sm">
          Ibiza<span className="text-orange-500">Grooves</span>
        </h1>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="h-px w-12 bg-orange-500/20 hidden sm:block" />
          <p className="text-sm sm:text-lg text-gray-400 font-bold uppercase tracking-[0.3em]">
            {subtitle}
          </p>
          <span className="h-px w-12 bg-orange-500/20 hidden sm:block" />
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-6">
          <Button 
            type="primary" 
            size="large" 
            shape="round" 
            className="h-14 px-10 font-black uppercase tracking-widest shadow-xl shadow-orange-500/20"
          >
            Start Listening
          </Button>
          <Button 
            size="large" 
            shape="round" 
            className="h-14 px-10 font-black uppercase tracking-widest border-black/5"
          >
            Explore Mixes
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-orange-500 to-transparent" />
      </div>
    </section>
  );
}



