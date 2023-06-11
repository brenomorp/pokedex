import axios from 'axios';
import { Poppins } from 'next/font/google';
import { useEffect, useState } from 'react';
import PokemonCard from '@/components/PokemonCard';
import Title from '@/components/Title';
import { BASE_URL, DEFAULT_LIMIT } from '@/constants/api';
import useGlobalContext from '@/hook/useGlobalContext';
import Pagination from '@/components/Pagination';

export const getServerSideProps = async (context) => {
  const { offset } = context.query;

  const res = await axios.get(
    `${BASE_URL}/?limit=${DEFAULT_LIMIT}&offset=${offset ?? 0}`
  );

  const pokemonList = res.data.results;
  const { count } = res.data;

  const pokemonDataList = await Promise.all(
    pokemonList.map(async (pokemon) => {
      const pokemonResponse = await axios.get(pokemon.url);
      const { name, id, types, sprites } = pokemonResponse.data;
      return {
        name,
        id,
        types: types.map((item) => item.type.name),
        sprites: {
          official_artwork: sprites.other['official-artwork'].front_default,
        },
      };
    })
  );

  return {
    props: { pokemonDataList, count },
  };
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-poppins',
});

export default function Home({ pokemonDataList, count }) {
  const { setPageFlow, pokedex, setPokedex } = useGlobalContext();
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPageFlow(1);
    const storedPokedex = JSON.parse(localStorage.getItem('pokedex'));
    if (storedPokedex) {
      setPokedex(storedPokedex);
    }
  }, []);

  useEffect(() => {
    pokedex.length > 0
      ? localStorage.setItem('pokedex', JSON.stringify(pokedex))
      : localStorage.removeItem('pokedex');
  }, [pokedex]);

  const filteredPokemonList = pokemonDataList
    .filter((pokemon) => !pokedex.some((p) => p?.name === pokemon?.name))
    .filter((pokemon) =>
      pokemon.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(
          search
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        )
    );

  return (
    <div className="mx-auto max-w-screen-2xl px-10 py-16">
      <div className="mb-32 flex flex-col items-center justify-center gap-8 lg:flex-row lg:justify-between">
        <Title text="Todos Pokémon" />
        <input
          type="search"
          className={`h-12 w-full max-w-2xl rounded-xl p-4 text-2xl outline-none lg:w-1/2 ${poppins.className}`}
          placeholder="Pesquisar por nome"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      {filteredPokemonList.length > 0 ? (
        <div className="grid grid-flow-row grid-cols-1 gap-x-4 gap-y-16 lg:grid-cols-2 xl:grid-cols-3">
          {filteredPokemonList.map((pokemon) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} />
          ))}
        </div>
      ) : (
        <div className="align-center mt-20 flex justify-center">
          <p className={`text-white ${poppins.className} text-3xl`}>
            Pokémon não encontrado! Verifique sua pokedex.
          </p>
        </div>
      )}
      <Pagination count={count} />
    </div>
  );
}
