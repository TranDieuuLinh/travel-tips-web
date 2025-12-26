import Link from "next/link";
import { type SanityDocument } from "next-sanity";

import {client} from '@/client' 
const POSTS_QUERY = `*[
  _type == "food"
]|order(publishedAt desc)[0...12]{_id, foodName}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  console.log(posts)

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
              <h2 className="text-xl font-semibold">{post.foodName}</h2>
          </li>
        ))}
      </ul>
    </main>
  );
}