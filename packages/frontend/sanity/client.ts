import { createClient } from "next-sanity";
import { config } from 'dotenv';
config({ quiet: true });

export const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_PROJECTID!,
    dataset: process.env.NEXT_PUBLIC_DATASET!,
    apiVersion: "2024-01-01",
    useCdn: false
});
