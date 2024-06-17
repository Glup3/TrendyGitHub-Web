import { db } from "@/db/client";
import Link from "next/link";
import { z } from 'zod'

const pageSchema = z.coerce.number().int().positive().catch(1)
const searchSchema = z.object({
  page: pageSchema,
})

const perPage = 50

// 1-based index
async function getData(page: number) {
  return await db
    .selectFrom("mv_weekly_stars")
    .innerJoin("repositories", "repositories.id", "mv_weekly_stars.repository_id")
    .select(["github_id", "name_with_owner", "star_count", "fork_count", "primary_language", "stars_difference"])
    .orderBy("stars_difference", "desc")
    .limit(perPage)
    .offset(Math.round(pageSchema.parse(page) - 1) * perPage)
    .execute()
}

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Home({ searchParams }: Props) {
  const search = searchSchema.parse(searchParams)
  const res = await getData(search.page)

  return (
    <main>
      <h1>Trending GitHub Repositories</h1>
      {search.page > 1 && <Link className="mx-4" href={`?page=${search.page - 1}`}>Prev</Link>}
      <span>{search.page}</span>
      <Link className="mx-4" href={`?page=${search.page + 1}`}>Next</Link>
      <ul>
        {res.map(repo => (<li key={repo.github_id}>{repo.stars_difference} - {repo.name_with_owner}</li>))}
      </ul>
    </main>
  );
}
