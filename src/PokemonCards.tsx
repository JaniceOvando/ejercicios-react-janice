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
  sprites: { front_default: string };
}

function PokemonCards() {
  const [pokemons, setPokemons] = useState<PokemonDetail[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPokemons() {
      try {
        // 1. Trae la lista base (nombre + url) de los primeros 20 pokemones
        const listResponse = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20"
        );
        if (!listResponse.ok) throw new Error("No se pudo obtener la lista");
        const listData: { results: PokemonSummary[] } =
          await listResponse.json();

        // 2. Por cada uno, pide el detalle (imagen, tipos, peso, altura)
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

  if (error) return <div className="pk-error">Error: {error}</div>;
  if (!pokemons) return <div className="pk-loading">Cargando...</div>;

  return (
    <div className="pk-container">
      <h1 className="pk-heading">Pokédex</h1>

      <div className="pk-grid">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="pk-card">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="pk-image"
            />
            <h2 className="pk-name">{pokemon.name}</h2>
            <p className="pk-types">
              {pokemon.types.map((t) => t.type.name).join(" / ")}
            </p>
            <p className="pk-stats">
              {pokemon.height / 10} m &middot; {pokemon.weight / 10} kg
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonCards;