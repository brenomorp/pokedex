import PokemonCard from '@/components/PokemonCard';
import Title from '@/components/Title';
import { BASE_URL, limit } from '@/constants/api';
import useGlobalConext from '@/hooks/useGlobalContext';
import axios from 'axios';

export const getStaticProps = async () => {
    const res = await axios.get(`${BASE_URL}/pokemon?limit=${limit}`);
    const pokemonList = res.data.results;
    const pokemonDataList = await Promise.all(
        pokemonList.map(async (pokemon) => {
            const pokemonResponse = await axios.get(pokemon.url);
            const { name, id, types, stats, sprites, moves } =
                pokemonResponse.data;
            return {
                name,
                id,
                types: types.map((type) => type.type.name),
                stats: stats.map((stat) => {
                    return {
                        name: stat.stat.name,
                        base_stat: stat.base_stat,
                    };
                }),
                sprites: {
                    back_default: sprites.back_default,
                    front_default: sprites.front_default,
                    official_artwork:
                        sprites.other['official-artwork'].front_default,
                },
                moves: moves.slice(0, 4).map((move) => move.move.name),
            };
        })
    );

    return {
        props: { pokemonDataList },
    };
};

export default function Home({ pokemonDataList }) {
    const { setPageFlow } = useGlobalConext();
    setPageFlow(1);

    return (
        <div className="py-16 px-10 max-w-screen-2xl mx-auto">
            <Title text="Todos Pokémon" />
            <div className="grid grid-cols-2 grid-flow-row gap-x-4 gap-y-16 xl:grid-cols-3">
                {pokemonDataList.map((pokemon) => (
                    <PokemonCard
                        key={pokemon.name}
                        name={pokemon.name}
                        id={pokemon.id}
                        types={pokemon.types}
                        imageSrc={pokemon.sprites.official_artwork}
                    />
                ))}
            </div>
        </div>
    );
}
