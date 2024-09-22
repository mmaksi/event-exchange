'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, Tag, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import summerFestival from '@/assets/2024_summer_festival_guide_header_0.png';

// Mock event data (replace with actual data fetching in a real application)
const event = {
  id: 1,
  title: 'Summer Music Festival 2023',
  description:
    'Join us for an unforgettable weekend of music, featuring top artists from around the world. Experience a diverse range of genres, from rock and pop to electronic and indie. With multiple stages, food vendors, and art installations, this festival promises to be the highlight of your summer!',
  date: '2023-07-15',
  time: '12:00 PM - 11:00 PM',
  location: 'Central Park, New York City',
  price: 89.99,
  capacity: 10000,
  organizer: 'NYC Events Co.',
};

export default function EventDetailsPage() {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/events/all"
        className="inline-flex items-center text-primary hover:underline mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={summerFestival}
            alt={event.title}
            className="w-full h-auto rounded-lg shadow-md"
            width={500}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-5 w-5" />
              <span>Date: {event.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="mr-2 h-5 w-5" />
              <span>Time: {event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2 h-5 w-5" />
              <span>Location: {event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Tag className="mr-2 h-5 w-5" />
              <span>Price: ${event.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="mr-2 h-5 w-5" />
              <span>Capacity: {event.capacity} attendees</span>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Organizer</h2>
            <p className="text-gray-700">{event.organizer}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Buy Tickets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
