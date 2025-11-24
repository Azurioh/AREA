interface LoadingScreenProps {
  message?: string;
  children?: React.ReactNode;
}

export function LoadingScreen({ message = 'Loading...', children }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="space-y-2">{children}</div>

        <div className="flex flex-col items-center justify-center space-y-4 absolute bottom-0 top-0 left-0 right-0 m-auto">
          <div className="flex space-x-2">
            <div className="h-4 w-4 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <div className="h-4 w-4 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <div className="h-4 w-4 animate-bounce rounded-full bg-primary" />
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
