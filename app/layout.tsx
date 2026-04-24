import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { AudioControllerProvider } from "@/lib/audio-controller";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IbizaGrooves — Live Radio & Ibiza Vibes",
  description: "Experience the best Ibiza radio and DJ mixes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fdfdfd] text-[#1a1a1a] min-h-screen`}
      >
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#ff6b35',
                borderRadius: 16,
                fontFamily: 'var(--font-geist-sans)',
              },
            }}
          >
            <AudioControllerProvider>
              <div className="relative flex flex-col min-h-screen">

                <Navbar />
                <main className="flex-1">
                  {children}
                </main>

                <Footer />

                {/* Spacer to prevent content being hidden by fixed players */}
                <div className="h-[320px] sm:h-[400px]" aria-hidden="true" />

                {/* Fixed Bottom Stacked Players - Fancy Glassmorphism Background */}
                <div className="fixed bottom-0 left-0 z-[100] w-full flex glass-dark border-t border-orange-500/30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                  <div className="w-full flex items-center justify-center border-b border-white/5">
                    <iframe
                      src="https://embed.radio.co/player/28348ed.html"
                      className="w-full h-[6.5rem] border-0 block"
                      allow="autoplay"
                      title="Radio Player 1"
                    />
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <iframe
                      src="https://embed.radio.co/player/28348ed.html"
                      className="w-full h-[6.5rem] border-0 block"
                      allow="autoplay"
                      title="Radio Player 2"
                    />
                  </div>
                </div>

              </div>
            </AudioControllerProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

