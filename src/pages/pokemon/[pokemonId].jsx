/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { Montserrat, Inter } from 'next/font/google';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Title from '@/components/Title';
import getColorVariant from '@/constants/typeColorVariants';
import { BASE_URL, DEFAULT_LIMIT } from '@/constants/api';
import useGlobalContext from '@/hook/useGlobalContext';
import StatContantainer from '@/components/StatContantainer';
import LoadingScreen from '@/components/LoadingScreen';

const montserrant = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
});

export const getStaticPaths = async () => {
  const res = await axios.get(`${BASE_URL}/?limit=${DEFAULT_LIMIT}`);
  const pokemonList = await res.data.results;
  const paths = pokemonList.map((pokemon, index) => ({
    params: {
      pokemonId: `${String(index + 1)}`,
    },
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps = async (context) => {
  const { pokemonId } = context.params;

  const res = await axios.get(`${BASE_URL}/${pokemonId}`);
  const { name, id, types, stats, sprites, moves } = await res.data;
  const data = {
    name,
    id,
    types: types.map((type) => type.type.name),
    stats: stats.map((stat) => ({
      name: stat.stat.name,
      base_stat: stat.base_stat,
    })),
    sprites: {
      back_default: sprites.back_default,
      front_default: sprites.front_default,
      official_artwork: sprites.other['official-artwork'].front_default,
    },
    moves: moves.slice(0, 12).map((move) => move.move.name),
  };

  return {
    props: {
      pokemon: data,
    },
  };
};

function PokemonDetails({ pokemon }) {
  const {
    setPageFlow,
    pokedex,
    setPokedex,
    setIsOnPokedex,
    setCurrentPokemon,
  } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    setPageFlow(3);
    if (pokemon) {
      setCurrentPokemon(pokemon);
    }
    const storedPokedex = JSON.parse(localStorage.getItem('pokedex'));
    if (storedPokedex) {
      setPokedex(storedPokedex);
    }
    storedPokedex?.some((p) => p?.id === pokemon?.id)
      ? setIsOnPokedex(true)
      : setIsOnPokedex(false);
  }, []);

  useEffect(() => {
    pokedex.length > 0
      ? localStorage.setItem('pokedex', JSON.stringify(pokedex))
      : localStorage.removeItem('pokedex');
  }, [pokedex]);

  let totalStat = 0;
  pokemon?.stats.forEach((stat) => (totalStat += stat.base_stat));

  if (router.isFallback) {
    return <LoadingScreen />;
  }

  return (
    <div
      className={`mx-auto max-w-screen-2xl p-4 sm:p-8 md:px-10 md:py-12 lg:py-16 ${inter.className} max-h-min overflow-hidden`}
    >
      <Title text="Detalhes" />
      <div
        className={`${getColorVariant(
          pokemon.types[0]
        )} relative mt-10 flex max-h-min flex-col-reverse gap-8 rounded-3xl bg-pokeball_full bg-contain bg-right-top bg-no-repeat px-6 py-8 md:px-12 md:py-8 lg:flex-row`}
      >
        <div className="flex flex-1 flex-col-reverse justify-center gap-8 xl:flex-row">
          <div className="flex w-full flex-1 flex-col items-center gap-8 lg:w-1/2 lg:flex-row xl:h-full xl:flex-col">
            <Image
              className="w-full max-w-xs rounded-xl bg-white lg:h-full xl:h-fit"
              src={pokemon.sprites.front_default}
              width={250}
              height={250}
              alt={`${pokemon.name} front sprite`}
            />
            <Image
              className="w-full max-w-xs rounded-xl bg-white lg:h-full xl:h-fit"
              src={pokemon.sprites.back_default}
              width={250}
              height={250}
              alt={`${pokemon.name} back sprite`}
            />
          </div>
          <div
            className={`rounded-xl bg-white ${inter.className} w-full p-4 lg:h-fit xl:h-full xl:w-1/2`}
          >
            <h3 className="text-2xl font-extrabold text-black">Base stats</h3>
            <ul className="mt-6 lg:grid lg:grid-cols-2 lg:flex-col xl:flex">
              {pokemon.stats.map((stat) => (
                <StatContantainer
                  key={stat.name}
                  name={stat.name}
                  value={stat.base_stat}
                />
              ))}
              <li className="col-span-2 flex gap-3 border-y border-gray-500/20 py-3">
                <div className="flex-[0_0_25%] whitespace-nowrap text-right text-gray-500">
                  Total
                </div>
                <div className="flex-[0_0_10%] text-right font-black">
                  {totalStat}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <p className="text-base font-bold text-white">#{pokemon.id}</p>
            <h2 className="text-2xl font-bold capitalize text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {pokemon.name}
            </h2>
            <div className="mt-6 flex gap-4">
              {pokemon.types?.map((type) => (
                <img
                  key={type}
                  src={`/images/type-icons/${type}.svg`}
                  alt={`${type} type`}
                />
              ))}
            </div>
          </div>
          <div className="mt-12 flex-1 rounded-xl bg-white p-8">
            <h3 className="mb-4 text-2xl font-extrabold text-black xl:mb-12">
              Moves
            </h3>
            <ul className="grid-flow-rows grid grid-cols-2 gap-4 md:grid-cols-3">
              {pokemon.moves.map((move) => (
                <li
                  key={move}
                  className={`${montserrant.className} w-full rounded-xl border border-dashed border-black/20 bg-[#ececec] p-3 text-sm font-normal capitalize text-black`}
                >
                  {move.replace(/[^a-zA-Z ]/g, ' ')}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute -top-14 right-4 lg:-top-28">
            <Image
              src={pokemon.sprites.official_artwork}
              width={256}
              height={256}
              alt={`${pokemon.name} official artwork sprite`}
              className="w-36 sm:w-44 lg:w-52 xl:w-64"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;
