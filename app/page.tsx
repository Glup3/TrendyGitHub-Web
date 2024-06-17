import { db } from "@/db/client";

async function getData() {
  return await db
    .selectFrom("mv_weekly_stars")
    .innerJoin("repositories", "repositories.id", "mv_weekly_stars.repository_id")
    .select(["github_id", "name_with_owner", "star_count", "fork_count", "primary_language", "stars_difference"])
    .orderBy("stars_difference", "desc")
    .limit(50)
    .offset(0)
    .execute()
}

export default async function Home() {
  const res = await getData()

  return (
    <main>
      <ul>
        {res.map(repo => (<li key={repo.github_id}>{repo.stars_difference} - {repo.name_with_owner}</li>))}
      </ul>
    </main>
  );
}
