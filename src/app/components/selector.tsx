'use client'
import { FormEvent } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SearchKeys } from '@/types'

export const Selector = () => {
  const router = useRouter()
  const pathNameParams = new URLSearchParams(usePathname()?.replace('/', ''))
  const { location, month, budget, activity } = Object.fromEntries(pathNameParams) as Record<
    SearchKeys,
    string
  >

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const formProps = Object.fromEntries(formData)

    if (!formProps[SearchKeys.Location] || !formProps[SearchKeys.Month]) return

    const newSearchParams = new URLSearchParams(formProps as Record<string, string>)

    router.push('/' + newSearchParams.toString())
  }

  return (
    <form onSubmit={submit}>
      <div className="h-8" />

      <div className="flex gap-2 justify-between items-center">
        <p>Please fill </p>

        <input
          type="text"
          name={SearchKeys.Location}
          placeholder="🌍 location *"
          defaultValue={location}
          className="input input-ghost max-w-[150px]"
        />

        <p>and</p>

        <select
          name={SearchKeys.Month}
          className="select select-ghost"
          defaultValue={month || '📅 month *'}
        >
          <option disabled>📅 month *</option>

          {months.map((month) => (
            <option key={month}>{month}</option>
          ))}
        </select>

        <button className="btn" type="submit">
          Suggest
        </button>
      </div>

      <div className="flex gap-2 justify-between items-center">
        <p>Additionally you may add </p>

        <select
          name={SearchKeys.Activity}
          className="select select-ghost"
          defaultValue={activity || '🏄‍ some activities'}
        >
          <option disabled>🏄‍ some activities</option>
          <option>Snowboarding</option>
          <option>Skiing</option>
          <option>Surfing</option>
          <option>Chilling on the beach</option>
          <option>Hiking</option>
          <option>Shopping</option>
          <option>Sightseeing</option>
        </select>

        <p>and</p>

        <input
          name={SearchKeys.Budget}
          type="number"
          placeholder="🤑 your budget in $/month"
          className="input input-ghost w-full max-w-[250px]"
          defaultValue={budget}
        />
      </div>

      <div className="h-8" />
    </form>
  )
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
