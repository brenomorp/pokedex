/* eslint-disable no-shadow */
import { Poppins } from 'next/font/google';
import { useEffect, useState } from 'react';
import PokemonCard from '@/components/PokemonCard';
import Title from '@/components/Title';
import useGlobalContext from '@/hook/useGlobalContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-poppins',
});

function pokedex() {
  const { setPageFlow, pokedex, setPokedex } = useGlobalContext();
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPageFlow(2);
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

  const filteredPokedex = pokedex
    .filter((pokemon) =>
      pokemon?.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(
          search
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        )
    )
    .sort((a, b) => {
      if (a.id < b.id) return -1;
      return 0;
    });

  return (
    <div className="mx-auto max-w-screen-2xl px-10 py-16">
      <div className="mb-32 flex flex-col items-center justify-center gap-8 lg:flex-row lg:justify-between">
        <Title text="Meus Pokémon" />
        <input
          type="search"
          className={`h-12 w-full max-w-2xl rounded-xl p-4 text-2xl outline-none lg:w-1/2 ${poppins.className}`}
          placeholder="Pesquisar por nome"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>

      {filteredPokedex.length > 0 ? (
        <div className="grid grid-flow-row grid-cols-1 gap-x-4 gap-y-16 lg:grid-cols-2 xl:grid-cols-3">
          {filteredPokedex.map((pokemon) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} />
          ))}
        </div>
      ) : search ? (
        <div className="align-center mt-20 flex justify-center">
          <p className={`text-white ${poppins.className} text-3xl`}>
            Pokemon não encontrado!
          </p>
        </div>
      ) : (
        <div className="align-center mt-20 flex justify-center">
          <p className={`text-white ${poppins.className} text-3xl`}>
            Pokedex vazia!
          </p>
        </div>
      )}
    </div>
  );
}

export default pokedex;
