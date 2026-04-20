'use client';

import type React from "react";

import { useState } from 'react';
import { MapPin, Clock, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TicketButton } from '@/components/events/ticket-button';
import type { Event } from '@/lib/queries';

type EventListProps = {
  events: Event[];
};

function formatDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${month.replace(/^0/, '')}-${day}-${year}`;
}

export function EventList({ events }: EventListProps): React.JSX.Element {
  const [ascending, setAscending] = useState(true);

  const sorted = [...events].sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    return ascending ? diff : -diff;
  });

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onMouseDown={() => { setAscending((v) => !v); }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.68rem] uppercase tracking-[0.28em] text-zinc-400 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {ascending ? 'Nearest First' : 'Latest First'}
        </button>
      </div>

      <div className="space-y-4">
        {sorted.map((event) => (
          <div key={event.id}>
            <Card className="group relative overflow-hidden rounded-[1.5rem] border-white/8 bg-white/[0.02] py-0 text-white transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,hsl(38_55%_55%/0.04),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <CardContent className="p-0">
                <div className="relative grid gap-5 p-5 sm:p-6 md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-center md:gap-8 md:p-8">
                  <div className="hidden md:block">
                    <p className="text-[0.62rem] uppercase tracking-[0.34em] text-zinc-600">
                      {new Date(event.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p className="artist-name mt-1 text-4xl text-amber-accent/70">
                      {new Date(event.date + 'T12:00:00').getDate()}
                    </p>
                    <p className="mt-1 text-[0.62rem] tracking-[0.2em] text-zinc-600">
                      {new Date(event.date + 'T12:00:00').getFullYear()}
                    </p>
                  </div>

                  <div>
                    <h2 className="mb-3 text-xl font-medium tracking-[0.06em] text-white/90 transition-colors duration-300 group-hover:text-white sm:text-2xl">{event.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{event.location}</span>
                      </div>
                      <span className="text-zinc-700 md:hidden">{formatDate(event.date)}</span>
                    </div>
                  </div>

                  <div className="flex justify-start md:justify-end">
                    {event.ticket_link != null && event.ticket_link !== '' && <TicketButton href={event.ticket_link} />}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
