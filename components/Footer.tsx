export default function Footer() {
  return (
    <footer className="w-full bg-[#fdfdfd] text-gray-400 py-12 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        <div className="flex items-center gap-8">
          <a
            href="#"
            aria-label="IbizaGrooves on Instagram"
            className="text-xs font-bold uppercase tracking-widest hover:text-orange-500 transition-colors"
          >
            Instagram
          </a>
          <a
            href="#"
            aria-label="IbizaGrooves on SoundCloud"
            className="text-xs font-bold uppercase tracking-widest hover:text-orange-500 transition-colors"
          >
            SoundCloud
          </a>
          <a
            href="#"
            aria-label="IbizaGrooves on Mixcloud"
            className="text-xs font-bold uppercase tracking-widest hover:text-orange-500 transition-colors"
          >
            Mixcloud
          </a>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
          © {new Date().getFullYear()} IbizaGrooves. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

