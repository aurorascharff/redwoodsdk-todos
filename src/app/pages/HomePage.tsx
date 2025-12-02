// @ts-expect-error - unstable API but works in React 19
// eslint-disable-next-line @typescript-eslint/no-unused-vars, autofix/no-unused-vars
import { unstable_ViewTransition as ViewTransition } from 'react';
import { link } from '@/app/shared/links';
import type { AppContext } from '@/worker';
import Button from '../components/ui/Button';
import GitHubIcon from '../components/ui/icons/GitHubIcon';

export function HomePage({ ctx }: { ctx: AppContext }) {
  return (
    <div className="w-full sm:w-[500px]">
      <PageHeader username={ctx.user?.username} />
      <NavigationLinks isLoggedIn={!!ctx.user} />
      {ctx.user && <LogoutButton />}
      <RealtimeDemoLink />
      <GitHubLink />
    </div>
  );
}

function PageHeader({ username }: { username?: string }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="mb-2 font-serif text-4xl font-bold">
        <span className="text-primary dark:text-primary-dark">RedwoodSDK</span>{' '}
        <span className="text-text dark:text-text-dark">Todos</span>
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        {username ? `Welcome back, ${username}!` : 'Sign in to access your todos'}
      </p>
    </div>
  );
}

function NavigationLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <a href={link('/user/login')} className="block">
          <Button type="button" className="h-11 w-full">
            Sign In
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <a href={link('/todos/simple')} className="block">
        <Button type="button" variant="secondary" className="h-12 w-full">
          Simple Todos
        </Button>
      </a>
      <a href={link('/todos')} className="block">
        <Button type="button" className="h-12 w-full">
          Fancy Todos
        </Button>
      </a>
    </div>
  );
}

function LogoutButton() {
  return (
    <div className="mt-6 text-center">
      <form action={link('/user/logout')}>
        <Button type="submit" variant="secondary" className="px-4 py-2 text-sm">
          Logout
        </Button>
      </form>
    </div>
  );
}

function RealtimeDemoLink() {
  return (
    <div className="mt-8 text-center">
      <a href={link('/realtime')} className="block">
        <Button type="button" variant="secondary" className="h-10 w-full">
          🚀 Realtime Demo
        </Button>
      </a>
    </div>
  );
}

function GitHubLink() {
  return (
    <div className="mt-4 text-center">
      <a
        href="https://github.com/aurorascharff/redwoodsdk-demo"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <GitHubIcon className="h-3 w-3" />
        Source
      </a>
    </div>
  );
}
