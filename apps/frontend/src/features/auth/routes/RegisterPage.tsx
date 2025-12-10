import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/wrappers/Button';
import { Card } from '@/components/wrappers/Card';
import { Input } from '@/components/wrappers/Input';
import { AppRoutesPaths } from '@/enums/routes';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { useShowPassword } from '@/features/auth/hooks/useShowPassword';
import { useClearUserData } from '@/shared/hooks/useClearUserData';

const RegisterPage: React.FC = () => {
  const { showPassword, showConfirmPassword, togglePasswordVisibility, toggleConfirmPasswordVisibility } =
    useShowPassword();
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    handleSubmit,
  } = useRegister();
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
            <h1 className="font-bold tracking-tighter text-primary">Create Account</h1>
            <p className="font-text text-foreground">Sign up to get started with your profile</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-[var(--small-radius)] bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="name" className="text-foreground">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="test@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-transparent hover:text-inherit"
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-transparent hover:text-inherit"
                >
                  {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full !mt-7" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
            <div className="text-center text-sm text-foreground">
              Already have an account ?
              <Link to={AppRoutesPaths.LOGIN} className="text-primary hover:underline">
                {' '}
                Sign in
              </Link>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
