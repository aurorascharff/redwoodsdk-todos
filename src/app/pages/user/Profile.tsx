import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { link } from '@/app/shared/links';
import type { AppContext } from '@/worker';

export default function Profile({ ctx }: { ctx: AppContext }) {
  return (
    <>
      <title>Profile: {ctx.user?.username}</title>
      <div className="flex justify-center py-12">
        <Card className="w-full max-w-md space-y-6 px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex min-h-[2.5rem] items-center justify-between py-2">
                <span className="field-label">Username</span>
                <span className="text-text dark:text-text-dark ml-4 text-right font-semibold">
                  {ctx.user?.username}
                </span>
              </div>
              <div className="border-border dark:border-border-dark border-t" />
              <div className="flex min-h-[2.5rem] items-center justify-between py-2">
                <span className="field-label">User ID</span>
                <span className="field-value">{ctx.user?.id}</span>
              </div>
            </div>
            <ProfileActions />
          </div>
        </Card>
      </div>
    </>
  );
}

function ProfileActions() {
  return (
    <div className="space-y-3">
      <form action={link('/user/logout')}>
        <Button type="submit" variant="secondary" className="h-10 w-full">
          Logout
        </Button>
      </form>
      <a href={link('/')} className="block">
        <Button type="button" className="h-10 w-full">
          Back to Home
        </Button>
      </a>
    </div>
  );
}
