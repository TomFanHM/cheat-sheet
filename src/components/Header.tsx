import React, { useState } from "react";
import { siteConfig } from "../config/site";
import { Dialog } from "@headlessui/react";
import { navigation } from "../config/navigation";
import Search from "./Search";
import SearchPanel from "./SearchPanel";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">{siteConfig.name}</span>
            <img
              className="h-8 w-auto"
              src={siteConfig.logo}
              alt={siteConfig.name}
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <img
              src="/svg/bars-solid.svg"
              alt="bars-solid"
              className="h-6 w-6"
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </a>
          ))}
          <Search
            className="-my-1 ml-auto flex h-8 w-8 items-center justify-center rounded-lg lg:ml-8"
            setSearchOpen={setSearchOpen}
          />
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">{siteConfig.name}</span>
              <img
                className="h-8 w-auto"
                src={siteConfig.logo}
                alt={siteConfig.name}
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <img
                src="/svg/xmark-solid.svg"
                alt="xmark-solid"
                className="h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
                <span className="-mx-3 block rounded-lg text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer">
                  <Search
                    className="flex items-center justify-start rounded-lg px-3 py-3 w-full"
                    setSearchOpen={setSearchOpen}
                  />
                </span>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* Search */}
      <SearchPanel searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
    </header>
  );
};
export default Header;
