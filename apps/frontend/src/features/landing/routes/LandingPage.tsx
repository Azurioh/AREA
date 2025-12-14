import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Background from '@/assets/landingPageBackgound.png';
import Logo from '@/assets/Area-Logo-primary.png';
import FloatingCard from '@/features/landing/components/FloatingCard';
import { useServiceLogos } from '@/features/landing/hooks/useServiceLogos';
import { AppRoutesPaths } from '@/enums/routes';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const serviceLogos = useServiceLogos();

  const leftOffsets = [
    { x: -200, y: -120 },
    { x: -400, y: 0 },
    { x: -300, y: 210 },
  ];

  const rightOffsets = [
    { x: 250, y: -140 },
    { x: 370, y: 10 },
    { x: 320, y: 160 },
  ];

  return (
    <div
      className="flex h-screen bg-cover bg-center justify-center items-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <header className="absolute top-0 left-0 right-0 flex justify-end p-4">
        <div className="flex space-x-4">
          <Button
            className="outline !outline-1 bg-transparent hover:bg-muted text-primary rounded-[var(--small-radius)]"
            onClick={() => navigate(AppRoutesPaths.LOGIN)}
          >
            Sign in
          </Button>
          <Button className="rounded-[var(--small-radius)]" onClick={() => navigate(AppRoutesPaths.REGISTER)}>
            Sign up
          </Button>
        </div>
      </header>
      <main className="flex flex-col items-center space-y-8">
        <img src={Logo} alt="logo" className="w-4/5 max-w-[400px] sm:w-auto" />
        <div className="relative flex items-center justify-center w-full">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 ml-32">
            {serviceLogos.slice(0, 3).map((logo, index) => (
              <FloatingCard
                key={`left-${index}`}
                logo={logo.imageUrl}
                delay={index * 0.5}
                offset={leftOffsets[index]}
              />
            ))}
          </div>

          <h2 className="text-4xl font-text font-bold tracking-tighter text-primary z-10">
            Action-Reaction Automation
          </h2>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-32">
            {serviceLogos.slice(3, 6).map((logo, index) => (
              <FloatingCard
                key={`right-${index}`}
                logo={logo.imageUrl}
                delay={0.2 + index * 0.5}
                offset={rightOffsets[index]}
              />
            ))}
          </div>
        </div>
        <div className="max-w-3xl flex justify-center items-center mb-48">
          <p className="text-2xl font-text text-center tracking-tighter">
            Connect your favorite services and automate your workflows. When something happens in one app, make
            something happen in another.
          </p>
        </div>
        <div className="mt-24">
          <Button
            className="rounded-[var(--small-radius)] text-2xl !py-8 mt-40"
            onClick={() => navigate(AppRoutesPaths.HOME)}
          >
            Try it now <ArrowRight className="!w-8 !h-8" />
          </Button>
        </div>
      </main>
    </div>
  );
}
