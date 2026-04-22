import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "./useAuth";


type CartItem = { cart_slug: string };
type CartResponse = { cart?: CartItem[] };
async function fetchCart(): Promise<string[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/basket/cart`, {
    credentials: "include",
  });
  if (!res.ok) return [];
  const data: CartResponse = await res.json();
  return (data.cart ?? []).map((c) => c.cart_slug);
}

async function addToCart(countrySlug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/basket/cart`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        cart_slug: countrySlug.trim().toLowerCase(),
        cart_country_name: countrySlug.trim().toLowerCase(),
      }),
    });
    if (!res.ok) throw new Error("Failed to add cart");
  }

  async function deleteFromCart(countrySlug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/basket/cart`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        cart_slug: countrySlug.trim().toLowerCase(),
      }),
    });
    if (!res.ok) throw new Error("Failed to delete cart");
  }

  export function useCart() {
    const { data: authUser } = useAuth();
    const userId = authUser?.id ?? 0;
    const qc = useQueryClient();
    const cartQuery = useQuery({
      queryKey: ["cart", userId],
      queryFn: fetchCart,
      enabled: userId > 0,
    });
    const addMutation = useMutation({
      mutationFn: addToCart,
      onSuccess: async (_, countrySlug) => {
        // simple + reliable: refetch
        await qc.invalidateQueries({ queryKey: ["cart", userId] });
        // (optional) optimistic update instead of refetch:
        // qc.setQueryData<string[]>(["cart", userId], (old = []) => [...old, countrySlug]);
      },
    });
    const deleteMutation = useMutation({
      mutationFn: deleteFromCart,
      onSuccess: async (_, countrySlug) => {
        await qc.invalidateQueries({ queryKey: ["cart", userId] });
        // (optional) optimistic:
        // qc.setQueryData<string[]>(["cart", userId], (old = []) => old.filter((x) => x !== countrySlug));
      },
    });
    return {
      cartItems: cartQuery.data ?? [],
      cartLoading: cartQuery.isLoading,
      cartError: cartQuery.error,
      addToCart: addMutation.mutateAsync,
      addLoading: addMutation.isPending,
      deleteFromCart: deleteMutation.mutateAsync,
      deleteLoading: deleteMutation.isPending,
    };
  }