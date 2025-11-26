import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AppRoutesPaths } from '@/enums/routes';
import { useShowPassword } from '../hooks/SetShowPassword';
import { useRememberMe } from '../hooks/useRememberMe';

const LoginPage = () => {
    const { showPassword, togglePasswordVisibility } = useShowPassword();
    const { rememberMe, toggleRememberMe } = useRememberMe();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-md'
            >
                <Card className='bg-white p-8 space-y-6'>
                    <div className='text-center space-y-2'>
                        <h1 className='text-3xl font-bold trackingtighter'>Welcome Back</h1>
                        <p>Sign in to your account to continue</p>
                    </div>
                    <form className='space-y-4'>
                        <div className='space-y-2'>
                            <label htmlFor='email'>Email</label>
                            <Input id='email' type="email" placeholder='test@gmail.com' required />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor='password'>Password</label>
                            <div className='relative'>
                                <Input id='password' type={showPassword ? 'text' : 'password'} placeholder='Enter your password' required/>
                                <button type='button' onClick={togglePasswordVisibility} className='absolute right-3 top-1/2 -translate-y-1/2'>
                                    {showPassword ? <Eye className='h-4 w-4' /> : <EyeOff className='h-4 w-4' />}
                                </button>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-2'>
                                <Checkbox id='remember-me' checked={rememberMe} onCheckedChange={toggleRememberMe} />
                                <Label htmlFor='remember-me'>Remember me</Label>
                            </div>
                            <a href="#" className='text-sm text-blue-600 hover:underline'>Forgot password?</a>
                        </div>
                        <Button type='submit' className='w-full'>Sign in</Button>
                        <div className='text-center text-sm'>
                            Don't have an account ?
                            <Link to={AppRoutesPaths.REGISTER} className='text-blue-600 hover:underline'> Sign up</Link>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}

export default LoginPage;
