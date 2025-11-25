import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
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
                                <Input id='password' type="password" required/>
                                <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2'>
                                    <EyeOff />
                                </button>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-2'>
                                <Checkbox id='remember-me' />
                                <Label htmlFor='remember-me'>Remember me</Label>
                            </div>
                            <a href="#" className='text-sm text-blue-600 hover:underline'>Forgot password?</a>
                        </div>
                        <Button type='submit' className='w-full'>Sign in</Button>
                        <div className='text-center text-sm'>
                            Don't have an account ? <a href="#" className='text-blue-600 hover:underline'>Sign up</a>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}

export default LoginPage;
