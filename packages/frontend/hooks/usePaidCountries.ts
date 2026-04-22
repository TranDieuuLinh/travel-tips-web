import {useQuery} from "@tanstack/react-query";
import {useAuth} from "./useAuth";

const fetchPaidCountries = async (): Promise<string[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/paidcountries/paidcountryname`, {
        credentials: "include",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.paidcountries?? [];
}

export const usePaidCountries = () => {
    const {data: authUser} = useAuth();
    return useQuery({
        queryKey: ["paidcountries", authUser?.id?? 0],
        queryFn: fetchPaidCountries,
        enabled: !!authUser?.id,
    });
}