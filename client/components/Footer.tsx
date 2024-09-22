import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center md:flex-row gap-8">
          {/* Social media */}
          <div>
            <h3 className="font-bold text-lg mb-4">EventExchange</h3>
            <p className="mb-4">
              Your one-stop platform for buying and selling event tickets.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/eventexchange"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary"
              >
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <title>X</title>
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://www.linkedin.com/company/eventexchange"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://www.facebook.com/eventexchange"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary"
              >
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/eventexchange"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="hover:text-primary">
                  All Events
                </Link>
              </li>
              <li>
                <Link href="/buy-tickets" className="hover:text-primary">
                  Buy Tickets
                </Link>
              </li>
              <li>
                <Link href="/sell-tickets" className="hover:text-primary">
                  Sell Tickets
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          {/* Suppoer */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact-us" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="mb-4">Stay updated with the latest events and offers.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 rounded-l-md border-gray-300 focus:ring-primary focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md hover:bg-primary/90 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p>&copy; {new Date().getFullYear()} EventExchange. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
