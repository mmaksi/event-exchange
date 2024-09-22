'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const areas = ['All Areas', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];

const mockEvents = [
  {
    id: 1,
    title: 'Summer Music Festival',
    date: '2023-07-15',
    price: 89.99,
    area: 'New York',
  },
  {
    id: 2,
    title: 'Tech Conference 2023',
    date: '2023-08-22',
    price: 199.99,
    area: 'San Francisco',
  },
  { id: 3, title: 'Food & Wine Expo', date: '2023-09-10', price: 59.99, area: 'Chicago' },
  {
    id: 4,
    title: 'International Film Festival',
    date: '2023-10-05',
    price: 129.99,
    area: 'Los Angeles',
  },
  {
    id: 5,
    title: 'Sports Championship',
    date: '2023-11-18',
    price: 149.99,
    area: 'Houston',
  },
  {
    id: 6,
    title: 'Art Gallery Opening',
    date: '2023-12-01',
    price: 39.99,
    area: 'New York',
  },
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');

  const filteredEvents = mockEvents.filter(
    (event) =>
      (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.area.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedArea === 'All Areas' || event.area === selectedArea)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Events</h1>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(
                event.title
              )}`}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Date: {event.date}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{event.area}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <Tag className="mr-2 h-4 w-4" />
                <span>Price: ${event.price.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          <p>No events found. Please try a different search or area.</p>
        </div>
      )}
    </div>
  );
}
