import { Button } from '@/components/ui/button';
import { useAppAuthorization } from '@/features/auth/hooks/useAppAuthorization';

interface ContinueWithProps {
  service: string;
}

const ContinueWith: React.FC<ContinueWithProps> = ({ service }) => {
  const { handleSubmit } = useAppAuthorization();

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full flex items-center justify-center gap-3 hover:border-primary hover:bg-input-background hover:text-forground bg-input-background"
        aria-label={`Continue with ${service}`}
        onClick={() => handleSubmit(service)}
      >
        <img
          src={`${import.meta.env.VITE_BASE_IMAGE_URL}/${service.toLowerCase()}.png`}
          alt={`${service} logo`}
          className="h-5 w-5"
        />
        <span>{service}</span>
      </Button>
    </>
  );
};

export { ContinueWith };
