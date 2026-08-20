import { useEffect, useState } from "react";

import api from "../services/api";
import { useAuth } from "./useAuth";
import FavoritesContext from "./FavoritesContext.js";

export function FavoritesProvider({ children }) {
  const {
    isAuthenticated,
    loading: authLoading
  } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;

    const loadFavorites = async () => {
      try {
        setLoading(true);

        const response = await api.get("/favorites");

        if (!cancelled) {
          setFavorites(
            response.data.favorites || []
          );
        }

      } catch (error) {
        console.error(
          "Failed to fetch favorites:",
          error
        );

        if (!cancelled) {
          setFavorites([]);
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      cancelled = true;
    };

  }, [isAuthenticated, authLoading]);

  const isFavorite = (propertyId) => {
    return favorites.some((favorite) => {
      const favoriteProperty =
        favorite.property?._id ||
        favorite.property;

      return favoriteProperty === propertyId;
    });
  };

  const addFavorite = async (propertyId) => {
    try {
      const response = await api.post(
        `/favorites/${propertyId}`
      );

      setFavorites((current) => [
        ...current,
        response.data.favorite
      ]);

    } catch (error) {
      console.error(
        "Failed to add favorite:",
        error
      );

      throw error;
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      await api.delete(
        `/favorites/${propertyId}`
      );

      setFavorites((current) =>
        current.filter((favorite) => {
          const favoriteProperty =
            favorite.property?._id ||
            favorite.property;

          return favoriteProperty !== propertyId;
        })
      );

    } catch (error) {
      console.error(
        "Failed to remove favorite:",
        error
      );

      throw error;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        addFavorite,
        removeFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}