'use client'

import { UserCircleIcon, UserMinusIcon } from '@heroicons/react/20/solid';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, role:['u','a'] },
  {
    name: 'Trade',
    href: '/trade',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Pasa Rec/Paid', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Stock Detail', href: '/stock', icon: UserCircleIcon },
  { name: 'Pond Detail', href: '/pond', icon: UserMinusIcon },
  { name: 'Dhara Detail', href: '/dhara', icon: UserGroupIcon },
  { name: 'Saman Detail', href: '/saman', icon: UserGroupIcon },
];

export default function NavLinks() {
 const pn=usePathname();

  return (
    <>
    
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pn === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
