import { AnimatedBackground } from '@/components/animated-background';
import { LoginForm } from '@/components/login-form';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <AnimatedBackground />
      <div className="z-10">
        <LoginForm />
      </div>
    </main>
  );
}
