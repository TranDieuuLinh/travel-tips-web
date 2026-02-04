import { createClient } from "next-sanity";

export const sanityClient = createClient({
    projectId: '3b2dc5to',
    dataset: 'production',
    apiVersion: "2024-01-01",
    useCdn: false
});