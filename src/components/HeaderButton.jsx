import useGlobalContext from '@/hook/useGlobalContext';

function HeaderButton() {
  const { isOnPokedex, setIsOnPokedex, pokedex, setPokedex, currentPokemon } =
    useGlobalContext();

  return !isOnPokedex ? (
    <button
      type="button"
      className="h-12 w-36 rounded-md bg-button-blue text-sm text-white md:h-12 md:w-48 md:text-lg lg:h-20 lg:w-56 lg:text-2xl xl:w-72"
      onClick={() => {
        setIsOnPokedex(true);
        setPokedex([...pokedex, currentPokemon]);
      }}
    >
      Capturar
    </button>
  ) : (
    <button
      type="button"
      className="h-12 w-36 rounded-md bg-button-red text-sm text-white md:h-12 md:w-48 md:text-lg lg:h-20 lg:w-72 lg:text-2xl"
      onClick={() => {
        setIsOnPokedex(false);
        setPokedex((prev) =>
          prev.filter((item) => !pokedex.some((p) => p?.name === item?.name))
        );
      }}
    >
      Excluir da Pokédex
    </button>
  );
}

export default HeaderButton;
