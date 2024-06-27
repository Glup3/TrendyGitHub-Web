import { evaluateFlags, flagsClient, getDefinitions } from '@unleash/nextjs'
import { cookies } from 'next/headers'

type UnleashFlag = 'tgh-enable-statistics'

export const getFlag = async (flag: UnleashFlag) => {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('unleash-session-id')?.value ?? `${Math.floor(Math.random() * 1_000_000_000)}`

  const definitions = await getDefinitions({
    fetchOptions: {
      next: { revalidate: 15 }, // Cache layer like Unleash Proxy!
    },
  })

  const { toggles } = evaluateFlags(definitions, {
    sessionId,
  })
  const flags = flagsClient(toggles)

  return flags.isEnabled(flag)
}
