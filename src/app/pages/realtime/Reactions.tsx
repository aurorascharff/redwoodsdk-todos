import React from 'react';
import { getReactions } from './functions';

export default async function Reactions() {
  const reactions = await getReactions();

  return (
    <div className="reactions-container">
      {reactions.length === 0 ? (
        <div className="text-center opacity-50">
          <div className="mb-4 animate-pulse text-6xl">👋</div>
          <p className="text-lg">Send the first reaction!</p>
        </div>
      ) : (
        reactions.map((reaction, index) => {
          const left = ((index * 37) % 80) + 10;
          const top = ((index * 23) % 80) + 10;
          const delay = (index * 0.1) % 2;

          return (
            <span
              key={reaction.id}
              className="float-up absolute"
              style={{
                animationDelay: `${delay}s`,
                left: `${left}%`,
                top: `${top}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {reaction.emoji}
            </span>
          );
        })
      )}
    </div>
  );
}

export function ReactionsSkeleton() {
  return (
    <div className="reactions-container">
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="skeleton-animation h-12 w-64 rounded-2xl" />
        <div className="skeleton-animation h-8 w-48 rounded-xl" />
        <div className="skeleton-animation h-6 w-32 rounded-lg" />
      </div>
    </div>
  );
}
