"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from "react";

export interface CartItem {
  id: string;
  titulo: string;
  sku: string;
  preco: number;
  imagemPrincipal?: string;
  imagensUrls: string[];
  categoria: {
    id: string;
    nome: string;
    slug: string;
  };
  quantidadeEstoque: number;
  compraMinima: number;
  compraMaxima: number;
  quantidade: number;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  totalItems: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { produto: any; quantidade: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantidade: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

const initialState: CartState = {
  items: [],
  total: 0,
  totalItems: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { produto, quantidade } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === produto.id
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Item já existe, verificar se pode adicionar mais
        const itemAtual = state.items[existingItemIndex];
        const maxQuantidade = produto.compraMaxima || produto.quantidadeEstoque;
        const novaQuantidade = itemAtual.quantidade + quantidade;

        // Se ultrapassar o máximo, manter a quantidade atual (servidor validará)
        if (novaQuantidade > maxQuantidade) {
          return state; // Não altera o estado, servidor retornará erro
        }

        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantidade: novaQuantidade,
              subtotal: novaQuantidade * item.preco,
            };
          }
          return item;
        });
      } else {
        // Novo item
        const cartItem: CartItem = {
          id: produto.id,
          titulo: produto.titulo,
          sku: produto.sku,
          preco: produto.preco,
          imagemPrincipal: produto.imagemPrincipal,
          imagensUrls: produto.imagensUrls || [],
          categoria: produto.categoria,
          quantidadeEstoque: produto.quantidadeEstoque,
          compraMinima: produto.compraMinima,
          compraMaxima: produto.compraMaxima,
          quantidade,
          subtotal: quantidade * produto.preco,
        };
        newItems = [...state.items, cartItem];
      }

      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalItems = newItems.reduce(
        (sum, item) => sum + item.quantidade,
        0
      );

      return {
        items: newItems,
        total,
        totalItems,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalItems = newItems.reduce(
        (sum, item) => sum + item.quantidade,
        0
      );

      return {
        items: newItems,
        total,
        totalItems,
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantidade } = action.payload;
      const newItems = state.items.map((item) => {
        if (item.id === id) {
          const novaQuantidade = Math.max(
            item.compraMinima,
            Math.min(quantidade, item.compraMaxima || item.quantidadeEstoque)
          );
          return {
            ...item,
            quantidade: novaQuantidade,
            subtotal: novaQuantidade * item.preco,
          };
        }
        return item;
      });

      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalItems = newItems.reduce(
        (sum, item) => sum + item.quantidade,
        0
      );

      return {
        items: newItems,
        total,
        totalItems,
      };
    }

    case "CLEAR_CART":
      return initialState;

    case "LOAD_CART":
      return action.payload;

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  isLoaded: boolean;
  isOnline: boolean;
  addItem: (produto: any, quantidade: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantidade: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Carregar carrinho do servidor na inicialização
  useEffect(() => {
    loadCartFromServer();
  }, []);

  // Sincronizar com localStorage como backup
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("b2b-cart", JSON.stringify(state));
      } catch (error) {
        console.error("Erro ao salvar carrinho no localStorage:", error);
      }
    }
  }, [state, isLoaded]);

  // Monitorar conectividade
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncWithServer();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadCartFromServer = async () => {
    try {
      const response = await fetch("/api/carrinho", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (response.ok) {
        const serverCart = await response.json();
        dispatch({ type: "LOAD_CART", payload: serverCart });
      } else {
        // Fallback para localStorage se servidor falhar
        loadCartFromLocalStorage();
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho do servidor:", error);
      loadCartFromLocalStorage();
    } finally {
      setIsLoaded(true);
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem("b2b-cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (
          parsedCart &&
          typeof parsedCart === "object" &&
          Array.isArray(parsedCart.items)
        ) {
          dispatch({ type: "LOAD_CART", payload: parsedCart });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error);
      localStorage.removeItem("b2b-cart");
    }
  };

  const syncWithServer = async () => {
    if (!isOnline || !isLoaded) return;

    try {
      // Sincronizar estado atual com servidor
      await loadCartFromServer();
    } catch (error) {
      console.error("Erro ao sincronizar com servidor:", error);
    }
  };

  const addItem = async (produto: any, quantidade: number) => {
    // Sincronizar com servidor se online
    if (isOnline) {
      try {
        const response = await fetch("/api/carrinho", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ produtoId: produto.id, quantidade }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Se houver erro, mostrar ao usuário
          throw new Error(data.error || "Erro ao adicionar item ao carrinho");
        }

        // Se sucesso, recarregar carrinho do servidor para garantir sincronia
        await loadCartFromServer();
      } catch (error) {
        console.error("Erro ao adicionar item:", error);
        // Re-lançar erro para ser capturado pelo componente que chamou
        throw error;
      }
    } else {
      // Se offline, atualizar estado local apenas
      dispatch({ type: "ADD_ITEM", payload: { produto, quantidade } });
    }
  };

  const removeItem = async (id: string) => {
    // Atualizar estado local imediatamente
    dispatch({ type: "REMOVE_ITEM", payload: { id } });

    // Sincronizar com servidor se online
    if (isOnline) {
      try {
        await fetch(`/api/carrinho/${id}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Erro ao sincronizar remoção com servidor:", error);
      }
    }
  };

  const updateQuantity = async (id: string, quantidade: number) => {
    // Atualizar estado local imediatamente
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantidade } });

    // Sincronizar com servidor se online
    if (isOnline) {
      try {
        await fetch("/api/carrinho", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ produtoId: id, quantidade }),
        });
      } catch (error) {
        console.error("Erro ao sincronizar atualização com servidor:", error);
      }
    }
  };

  const clearCart = async () => {
    // Atualizar estado local imediatamente
    dispatch({ type: "CLEAR_CART" });

    // Sincronizar com servidor se online
    if (isOnline) {
      try {
        await fetch("/api/carrinho", {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Erro ao sincronizar limpeza com servidor:", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        isLoaded,
        isOnline,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
