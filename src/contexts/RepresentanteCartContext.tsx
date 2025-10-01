"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

interface Produto {
  id: string;
  titulo: string;
  sku: string;
  preco: number;
  imagemPrincipal?: string;
  imagensUrls: string[];
  compraMinima: number;
  compraMaxima?: number;
  quantidadeEstoque: number;
}

interface Cliente {
  id: string;
  razaoSocial: string;
  cnpjCpf: string;
  user: {
    name: string;
    email: string;
  };
}

interface CartItem {
  produto: Produto;
  quantidade: number;
}

interface CartState {
  items: CartItem[];
  selectedClient: Cliente | null;
  isLoaded: boolean;
}

type CartAction =
  | { type: "LOAD_CART"; payload: CartState }
  | { type: "ADD_ITEM"; payload: { produto: Produto; quantidade: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { produtoId: string; quantidade: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "SELECT_CLIENT"; payload: Cliente | null };

const initialState: CartState = {
  items: [],
  selectedClient: null,
  isLoaded: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART":
      return { ...action.payload, isLoaded: true };

    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.produto.id === action.payload.produto.id
      );

      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        const itemAtual = newItems[existingItemIndex];
        const maxQuantidade =
          action.payload.produto.compraMaxima ||
          action.payload.produto.quantidadeEstoque;
        const novaQuantidade = itemAtual.quantidade + action.payload.quantidade;

        // Se ultrapassar o máximo, não adiciona
        if (novaQuantidade > maxQuantidade) {
          return state; // Mantém estado atual
        }

        newItems[existingItemIndex].quantidade = novaQuantidade;
        return { ...state, items: newItems };
      } else {
        return {
          ...state,
          items: [
            ...state.items,
            {
              produto: action.payload.produto,
              quantidade: action.payload.quantidade,
            },
          ],
        };
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.produto.id !== action.payload),
      };

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.produto.id === action.payload.produtoId
          ? { ...item, quantidade: action.payload.quantidade }
          : item
      );
      return { ...state, items: newItems };
    }

    case "CLEAR_CART":
      return { ...state, items: [], selectedClient: null };

    case "SELECT_CLIENT":
      return { ...state, selectedClient: action.payload };

    default:
      return state;
  }
}

interface RepresentanteCartContextType {
  items: CartItem[];
  selectedClient: Cliente | null;
  isLoaded: boolean;
  addItem: (produto: Produto, quantidade: number) => Promise<void>;
  removeItem: (produtoId: string) => void;
  updateQuantity: (produtoId: string, quantidade: number) => void;
  clearCart: () => void;
  selectClient: (client: Cliente | null) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const RepresentanteCartContext = createContext<
  RepresentanteCartContextType | undefined
>(undefined);

interface RepresentanteCartProviderProps {
  children: ReactNode;
}

export function RepresentanteCartProvider({
  children,
}: RepresentanteCartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Carregar carrinho do localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("representante-cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      } else {
        dispatch({ type: "LOAD_CART", payload: initialState });
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      dispatch({ type: "LOAD_CART", payload: initialState });
    }
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    if (state.isLoaded) {
      try {
        localStorage.setItem(
          "representante-cart",
          JSON.stringify({
            items: state.items,
            selectedClient: state.selectedClient,
            isLoaded: state.isLoaded,
          })
        );
      } catch (error) {
        console.error("Erro ao salvar carrinho:", error);
      }
    }
  }, [state]);

  const addItem = async (produto: Produto, quantidade: number) => {
    // Verificar se o produto já existe no carrinho
    const itemExistente = state.items.find(
      (item) => item.produto.id === produto.id
    );

    // Validar quantidade inicial
    if (quantidade < produto.compraMinima) {
      throw new Error(`Quantidade mínima: ${produto.compraMinima}`);
    }

    // Calcular quantidade total que ficaria no carrinho
    const quantidadeTotal = itemExistente
      ? itemExistente.quantidade + quantidade
      : quantidade;

    // Validar quantidade máxima considerando o que já está no carrinho
    const maxQuantidade = produto.compraMaxima || produto.quantidadeEstoque;
    if (quantidadeTotal > maxQuantidade) {
      if (itemExistente) {
        throw new Error(
          `Você já tem ${itemExistente.quantidade} unidade(s) deste produto no carrinho. Quantidade máxima permitida: ${maxQuantidade}`
        );
      } else {
        throw new Error(`Quantidade máxima: ${maxQuantidade}`);
      }
    }

    // Validar estoque
    if (quantidadeTotal > produto.quantidadeEstoque) {
      throw new Error(`Estoque disponível: ${produto.quantidadeEstoque}`);
    }

    dispatch({ type: "ADD_ITEM", payload: { produto, quantidade } });
  };

  const removeItem = (produtoId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: produtoId });
  };

  const updateQuantity = (produtoId: string, quantidade: number) => {
    const item = state.items.find((item) => item.produto.id === produtoId);
    if (!item) return;

    // Validar quantidade
    if (quantidade < item.produto.compraMinima) {
      quantidade = item.produto.compraMinima;
    }
    if (item.produto.compraMaxima && quantidade > item.produto.compraMaxima) {
      quantidade = item.produto.compraMaxima;
    }
    if (quantidade > item.produto.quantidadeEstoque) {
      quantidade = item.produto.quantidadeEstoque;
    }

    dispatch({ type: "UPDATE_QUANTITY", payload: { produtoId, quantidade } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const selectClient = (client: Cliente | null) => {
    dispatch({ type: "SELECT_CLIENT", payload: client });
  };

  const getTotal = () => {
    return state.items.reduce(
      (total, item) => total + item.produto.preco * item.quantidade,
      0
    );
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantidade, 0);
  };

  const value: RepresentanteCartContextType = {
    items: state.items,
    selectedClient: state.selectedClient,
    isLoaded: state.isLoaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    selectClient,
    getTotal,
    getItemCount,
  };

  return (
    <RepresentanteCartContext.Provider value={value}>
      {children}
    </RepresentanteCartContext.Provider>
  );
}

export function useRepresentanteCart() {
  const context = useContext(RepresentanteCartContext);
  if (context === undefined) {
    throw new Error(
      "useRepresentanteCart must be used within a RepresentanteCartProvider"
    );
  }
  return context;
}
