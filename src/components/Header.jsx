import Link from 'next/link';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import logo from '../../public/images/logo.svg';
import useGlobalContext from '@/hook/useGlobalContext';
import HeaderButton from './HeaderButton';

const poppins = Poppins({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-poppins',
});

function Header() {
  const { pageFlow } = useGlobalContext();

  return (
    <header
      className={`flex items-center justify-between bg-white px-4 py-6 sm:grid sm:justify-start md:px-8 md:py-8 lg:px-11 lg:py-5 ${poppins.variable} grid-cols-2 font-sans text-black sm:grid-cols-3`}
    >
      {pageFlow !== 1 && (
        <div className="justify-self-start">
          <Link href="/">
            <span className="flex items-center justify-center gap-2">
              <span className="h-3 w-3 -rotate-45 border-l-2 border-t-2 border-black" />
              <span className="text-sm underline md:text-lg lg:text-2xl">
                Todos Pokémon
              </span>
            </span>
          </Link>
        </div>
      )}
      <Link
        className={`${
          pageFlow === 3 ? 'hidden' : ''
        } sm:col-start-2 sm:block sm:justify-self-center
         md:text-lg`}
        href="/"
      >
        <Image src={logo} alt="logo" className="h-12 sm:h-16 md:h-20 lg:h-28" />
      </Link>
      <div className={`${pageFlow === 1 && 'col-start-3'} justify-self-end`}>
        {pageFlow === 1 ? (
          <Link href="/pokedex">
            <div className="flex h-12 w-36 items-center justify-center rounded-md bg-button-blue text-sm text-white md:h-12 md:w-48 md:text-lg lg:h-20 lg:w-56 lg:text-2xl xl:w-72">
              Pokédex
            </div>
          </Link>
        ) : (
          pageFlow === 3 && <HeaderButton />
        )}
      </div>
    </header>
  );
}

export default Header;
