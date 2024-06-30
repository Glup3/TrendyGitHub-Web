'use client'

import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  repository: z.string(),
})

export const RepoInput = ({ initialText }: { initialText: string | undefined }) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repository: initialText ?? '',
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const params = new URLSearchParams({
      repository: values.repository,
    })
    router.push(`/history?${params.toString()}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="my-4 flex gap-2">
        <FormField
          control={form.control}
          name="repository"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="pattern: coollabsio/coolify OR https://github.com/coollabsio/coolify" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">View star history</Button>
      </form>
    </Form>
  )
}
