'use client';

import { useEffect, useOptimistic, useTransition } from 'react';
import type { Theme } from '@/types/reaction';
import { cn } from '@/utils/cn';
import { themes } from './RealtimePage';
import { addReaction, setTheme } from './functions';

export function EmojiPicker({
  theme,
  currentThemeData,
  remainingCooldown = 0,
}: {
  theme: Theme;
  currentThemeData: (typeof themes)[keyof typeof themes];
  remainingCooldown?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <ThemeSelector theme={theme} remainingCooldown={remainingCooldown} emojis={currentThemeData.emojis} />
      <EmojiGrid emojis={currentThemeData.emojis} colors={currentThemeData.colors} />
    </div>
  );
}

function ThemeSelector({
  theme,
  remainingCooldown,
  emojis,
}: {
  theme: Theme;
  remainingCooldown: number;
  emojis: readonly string[];
}) {
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(theme);
  const [isPending, startTransition] = useTransition();

  const changeThemeAction = (newTheme: Theme) => {
    startTransition(async () => {
      setOptimisticTheme(newTheme);
      await setTheme(newTheme);
    });
  };

  const isDisabled = remainingCooldown > 0 || isPending;

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      const keyNum = parseInt(event.key);
      if (keyNum >= 1 && keyNum <= 9) {
        const emojiIndex = keyNum - 1;
        if (emojiIndex < emojis.length) {
          await addReaction(emojis[emojiIndex]);
        }
      }
      if (event.key.toLowerCase() === 't') {
        const newTheme = optimisticTheme === 'react' ? 'lasvegas' : 'react';
        changeThemeAction(newTheme);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [optimisticTheme, emojis]);

  return (
    <div className="theme-selector-container">
      <span className="text-text-muted text-xs sm:text-sm">Theme:</span>
      {Object.entries(themes).map(([key, themeData]) => {
        return (
          <ThemeButton
            key={key}
            themeKey={key as Theme}
            theme={themeData}
            isActive={optimisticTheme === key}
            isDisabled={isDisabled}
            action={setTheme}
          />
        );
      })}
      <kbd className="theme-kbd">T{remainingCooldown > 0 ? ` (${remainingCooldown}s)` : ''}</kbd>
    </div>
  );
}

type ThemeButtonProps = {
  themeKey: Theme;
  theme: (typeof themes)[keyof typeof themes];
  isActive: boolean;
  isDisabled: boolean;
  action: (theme: Theme) => Promise<void>;
};

function ThemeButton({ themeKey, theme, isActive, isDisabled, action }: ThemeButtonProps) {
  const [optimisticIsActive, setOptimisticIsActive] = useOptimistic(isActive);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (isActive || isDisabled) return;
    startTransition(async () => {
      setOptimisticIsActive(true);
      await action(themeKey);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled || isPending}
      className={cn(
        'min-w-20 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all sm:min-w-24 sm:px-4 sm:py-2 sm:text-sm',
        'bg-background text-text-muted dark:bg-background-dark',
        optimisticIsActive && 'cursor-default bg-gradient-to-r text-white shadow-lg',
        optimisticIsActive && theme.colors,
        !optimisticIsActive &&
          !isDisabled &&
          'hover:bg-accent/25 hover:text-text-dark dark:hover:bg-accent/20 hover:font-semibold dark:hover:text-white',
        (isDisabled || isPending) && 'cursor-not-allowed opacity-50',
      )}
    >
      {theme.name}
    </button>
  );
}

function EmojiGrid({ emojis, colors }: { emojis: readonly string[]; colors: string }) {
  const [isPending, startTransition] = useTransition();

  const emojiClickAction = (emoji: string) => {
    startTransition(async () => {
      await addReaction(emoji);
    });
  };

  return (
    <div className={cn('emoji-grid-container', colors, isPending && 'opacity-60 saturate-50')}>
      <div className={cn('emoji-grid-inner', isPending && 'dark:bg-surface-dark/60 bg-white/90')}>
        <MobileEmojiGrid emojis={emojis} onEmojiClick={emojiClickAction} isPending={isPending} />
        <DesktopEmojiGrid emojis={emojis} onEmojiClick={emojiClickAction} isPending={isPending} />
      </div>
    </div>
  );
}

function MobileEmojiGrid({
  emojis,
  onEmojiClick,
  isPending,
}: {
  emojis: readonly string[];
  onEmojiClick: (emoji: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="grid w-full grid-cols-4 gap-3 sm:hidden">
      {emojis.map(emoji => {
        return (
          <button
            key={emoji}
            type="button"
            disabled={isPending}
            className="emoji-button"
            onClick={() => {
              onEmojiClick(emoji);
            }}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
}

function DesktopEmojiGrid({
  emojis,
  onEmojiClick,
  isPending,
}: {
  emojis: readonly string[];
  onEmojiClick: (emoji: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="hidden items-center gap-4 sm:flex">
      {emojis.map((emoji, index) => {
        return (
          <button
            key={emoji}
            type="button"
            disabled={isPending}
            className="emoji-button-desktop"
            onClick={() => {
              onEmojiClick(emoji);
            }}
          >
            {emoji}
            <span className="emoji-number-label">{index + 1}</span>
          </button>
        );
      })}
    </div>
  );
}
