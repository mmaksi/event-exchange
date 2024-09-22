import { Search, Calendar, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to EventExchange</h1>
        <p className="text-xl text-gray-600 mb-8">
          Buy and sell tickets for your favorite events
        </p>
        <div className="flex justify-center space-x-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Buy Tickets
          </Button>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            Sell Tickets
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Find Your Next Event</h2>
          <div className="flex space-x-4">
            <Input className="flex-grow" placeholder="Search events..." />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`/placeholder.svg?height=200&width=400`}
                alt={`Event ${i}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Event Title {i}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Date: DD/MM/YYYY</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Price: $XX.XX</span>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button
            variant="outline"
            className="text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/events/all">View All Events</Link>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Why Choose EventExchange?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Secure Transactions',
              description: 'Our platform ensures safe and secure ticket exchanges.',
            },
            {
              title: 'Wide Selection',
              description: 'Find tickets for a variety of events in your area.',
            },
            {
              title: 'Easy to Use',
              description: 'User-friendly interface for buying and selling tickets.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
