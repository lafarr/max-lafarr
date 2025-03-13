import type React from "react";

import Image from 'next/image';
import { LoginForm } from './login-form';
import { SlideIn } from '@/components/animations';

export default function LoginPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row overflow-hidden">
      <SlideIn direction="left" className="w-full md:w-1/2 md:h-screen">
        <div className="relative w-full h-full min-h-[40vh] md:min-h-screen">
          <Image
            src="https://7x0zshh65t.ufs.sh/f/ef0jRbxJDgdLgzL7khE4tsQJRIvCa1LTgcr0kupZWVyxfOoj"
            alt="Max LaFarr"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="artist-name text-white text-4xl md:text-5xl tracking-tight">MAX LAFARR</span>
          </div>
        </div>
      </SlideIn>
      <SlideIn direction="right" delay={0.1} className="w-full md:w-1/2 md:h-screen flex items-center bg-zinc-950">
        <LoginForm />
      </SlideIn>
    </main>
  );
}
