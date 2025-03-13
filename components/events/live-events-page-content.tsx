'use client';

import type React from 'react';

import { useQuery } from 'convex/react';
import { FadeUp } from '@/components/animations';
import { EventList } from '@/components/events/event-list';
import { api } from '@/convex/_generated/api';
import type { Event } from '@/lib/queries';

type LiveEventsPageContentProps = {
  initialEvents: Event[];
};

export function LiveEventsPageContent({ initialEvents }: LiveEventsPageContentProps): React.JSX.Element {
  const events = useQuery(api.music.listEvents) ?? initialEvents;

  if (events.length === 0) {
    return (
      <FadeUp>
        <div className="rounded-[1.6rem] border border-dashed border-white/8 bg-white/[0.02] px-6 py-16 text-center">
          <p className="text-xl font-light text-zinc-600">No events scheduled right now. Check back soon.</p>
        </div>
      </FadeUp>
    );
  }

  return <EventList events={events} />;
}
