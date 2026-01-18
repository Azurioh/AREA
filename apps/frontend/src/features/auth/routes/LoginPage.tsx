import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/wrappers/Button';
import { Card } from '@/components/wrappers/Card';
import { Checkbox } from '@/components/wrappers/CheckBox';
import { Input } from '@/components/wrappers/Input';
import { AppRoutesPaths } from '@/enums/routes';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useShowPassword } from '@/features/auth/hooks/useShowPassword';
import { useClearUserData } from '@/shared/hooks/useClearUserData';
import { ContinueWith } from '@/features/auth/components/ContinueWith';

const LoginPage: React.FC = () => {
  const { showPassword, togglePasswordVisibility } = useShowPassword();
  const { email, setEmail, password, setPassword, rememberMe, setRememberMe, isLoading, handleSubmit } = useLogin();
  useClearUserData();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-bold tracking-tighter text-primary">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="test@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
                className="transition-all hover:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                  className="transition-all hover:border-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-muted hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember-me" className="font-normal">
                  Remember me
                </Label>
              </div>
            </div>
            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              <ContinueWith service="GitHub" />
            </div>
            <p className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account ?</span>{' '}
              <Link
                to={AppRoutesPaths.REGISTER}
                className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Sign up
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
