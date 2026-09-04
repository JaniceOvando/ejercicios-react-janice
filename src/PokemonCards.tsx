import { useEffect, useState } from "react";
import "./PokemonCards.css";

interface PokemonSummary {
  name: string;
  url: string;
}

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  sprites: { front_default: string };
}

function PokemonCards() {
  const [pokemons, setPokemons] = useState<PokemonDetail[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPokemons() {
      try {
        const listResponse = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=9"
        );
        if (!listResponse.ok) throw new Error("No se pudo obtener la lista");
        const listData: { results: PokemonSummary[] } =
          await listResponse.json();

        const details = await Promise.all(
          listData.results.map((p) =>
            fetch(p.url).then((res) => res.json() as Promise<PokemonDetail>)
          )
        );

        setPokemons(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      }
    }

    loadPokemons();
  }, []);

  function verPerfil(pokemon: PokemonDetail) {
    const tipos = pokemon.types.map((t) => t.type.name).join(", ");
    const habilidades = pokemon.abilities
      .map((a) => a.ability.name)
      .join(", ");

    alert(
      `Nombre: ${pokemon.name}\n` +
        `Tipo(s): ${tipos}\n` +
        `Altura: ${pokemon.height / 10} m\n` +
        `Peso: ${pokemon.weight / 10} kg\n` +
        `Habilidades: ${habilidades}`
    );
  }

  if (error) return <div className="pk-error">Error: {error}</div>;
  if (!pokemons) return <div className="pk-loading">Cargando...</div>;

  return (
    <div className="pk-container">
      <h1 className="pk-heading">Pokemones</h1>

      <div className="pk-list">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="pk-row">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="pk-thumb"
            />
            <div className="pk-info">
              <span className="pk-name">{pokemon.name}</span>
              <span className="pk-type">
                Type: {pokemon.types.map((t) => t.type.name).join(", ")}
              </span>
            </div>
            <button className="pk-btn" onClick={() => verPerfil(pokemon)}>
              VER PERFIL
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonCards;