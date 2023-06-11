/* eslint-disable camelcase */
import Image from 'next/image';
import { Inter, Poppins } from 'next/font/google';
import Link from 'next/link';
import getColorVariant from '@/constants/typeColorVariants';
import useGlobalContext from '@/hook/useGlobalContext';

const inter = Inter({
  subsets: ['latin'],
  weight: '700',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

function PokemonCard({ pokemon }) {
  const { pageFlow, pokedex, setPokedex } = useGlobalContext();

  const {
    name,
    id,
    types,
    sprites: { official_artwork },
  } = pokemon;

  return (
    <div
      className={`mx-auto w-full min-w-fit max-w-lg ${getColorVariant(
        types[0]
      )} rounded-xl bg-pokeball bg-right-top bg-no-repeat p-4 text-white ${
        inter.className
      } relative font-sans`}
    >
      <div className="mb-12 flex justify-between">
        <div>
          <p>#{id}</p>
          <h3 className="mb-4 capitalize">{name}</h3>
          <div className="flex gap-3">
            {types?.map((type) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={type}
                src={`/images/type-icons/${type}.svg`}
                alt={`${type} type`}
              />
            ))}
          </div>
        </div>
        <div className="absolute -top-16 right-4">
          <Image
            loader={() => official_artwork}
            unoptimized
            src={official_artwork}
            width={180}
            height={180}
            alt={name}
            className="w-32 sm:w-40 md:w-[180px]"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <Link href={`/pokemon/${id}`}>
          <span className={`${poppins.className} font-bold underline`}>
            Detalhes
          </span>
        </Link>
        {pageFlow === 1 ? (
          <button
            type="button"
            className={`bg-white px-10 py-2 text-black ${poppins.className} rounded-xl font-sans font-normal`}
            onClick={() => setPokedex([...pokedex, pokemon])}
          >
            Capturar!
          </button>
        ) : (
          pageFlow === 2 && (
            <button
              type="button"
              className={`bg-button-red px-10 py-2 text-white ${poppins.className} rounded-xl font-sans font-normal`}
              onClick={() =>
                setPokedex((prev) => prev.filter((item) => item !== pokemon))
              }
            >
              Excluir
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default PokemonCard;
