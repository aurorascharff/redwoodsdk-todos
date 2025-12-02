'use client';

import { useActionState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import HomeButton from '@/app/components/HomeButton';
import Button from '@/app/components/ui/Button';
import { link } from '@/app/shared/links';
import { login, register } from './functions';

type State = {
  error?: string;
  message?: string;
};

export function LoginPage() {
  const [state, formAction] = useActionState(async (_prevState: State | undefined, formData: FormData) => {
    const action = formData.get('action') as string;
    const username = formData.get('username') as string;

    if (action === 'login') {
      const success = await login(username);
      if (success) {
        window.location.href = link('/');
        return { message: 'Login successful!' };
      }
      return { error: 'User not found' };
    }

    if (action === 'register') {
      const success = await register(username);
      if (success) {
        window.location.href = link('/');
        return { message: 'Registration successful!' };
      }
      return { error: 'Username already exists' };
    }

    return { error: 'Invalid action' };
  }, {} as State);

  return (
    <>
      <div className="absolute top-0 left-0 z-10 sm:top-6 sm:left-6">
        <HomeButton />
      </div>
      <title>Login</title>
      <div className="w-full sm:w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Sign In</h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome to RedwoodSDK Todos</p>
        </div>
        <ErrorBoundary fallbackRender={ErrorFallback}>
          <div className="space-y-6">
            <form autoComplete="off" action={formAction} className="space-y-3">
              <input
                type="text"
                minLength={3}
                name="username"
                placeholder="Username"
                className="w-full rounded-md border p-3"
                required
              />
              <Button name="action" value="login" className="h-11 w-full">
                Login
              </Button>
            </form>
            <FormDivider />
            <form action={formAction} className="space-y-3">
              <input
                type="text"
                minLength={3}
                name="username"
                placeholder="Username"
                className="w-full rounded-md border p-3"
                required
              />
              <Button variant="secondary" name="action" value="register" className="h-11 w-full">
                Register
              </Button>
            </form>
          </div>
        </ErrorBoundary>
        <StatusMessage error={state?.error} message={state?.message} />
      </div>
    </>
  );
}

function FormDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-background text-text-muted px-2">or</span>
      </div>
    </div>
  );
}

function StatusMessage({ error, message }: { error?: string; message?: string }) {
  if (error) {
    return <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</div>;
  }
  if (message) {
    return <div className="mt-4 text-center text-sm text-green-600 dark:text-green-400">{message}</div>;
  }
  return null;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="info-card">
      <p className="mb-2">Something went wrong</p>
      <p className="mb-3 text-sm">{error?.message}</p>
      <Button type="button" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </div>
  );
}
