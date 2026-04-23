import {useQuery} from "@tanstack/react-query";

interface AuthUser{
    id: number;
    email: string;
    name: string;
}

const fetchAuthUser = async (): Promise<AuthUser | null> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/login/me`, {
        credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.id || !data.email) return null;
    return data;
}

export const useAuth = () => {
    return useQuery({
        queryKey: ["auth"],
        queryFn: fetchAuthUser,
        staleTime: 1000*60*5,
        retry: false,
    })
}