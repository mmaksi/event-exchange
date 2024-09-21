'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import useCurrentUser from '@/hooks/use-user';

export default function Navbar() {
  const currentUser = useCurrentUser();
  console.log('Navbar');

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              EventExchange
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              {!currentUser?.id && (
                <>
                  <Link href="/signin">Sign In</Link>
                  <Link href="/signup">Sign Up</Link>
                </>
              )}
              {currentUser?.id && <Link href="/signout">Sign Out</Link>}
            </div>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px] bg-white">
                <div className="flex flex-col space-y-4 mt-4">
                  <SheetClose asChild>
                    <Button variant="ghost" asChild>
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </SheetClose>

                  <SheetClose asChild>
                    <Button variant="ghost" asChild>
                      <Link href="/signin">Sign In</Link>
                    </Button>
                  </SheetClose>

                  <SheetClose asChild>
                    <Button variant="secondary" asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
