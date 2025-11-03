import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { searchStations } from '../../services/radios.service'
import { VirtualList } from '../../components/VirtualList'
import { AudioPlayer } from '../../components/AudioPlayer'
import { RadioStationRow } from '../../components/RadioStationRow'
import type { RadioStation } from '../../types/radio.stations'

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardPage,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['stations', 2000],
    queryFn: () => searchStations(2000, 0),
    staleTime: 1000 * 60, // 1 min
  })

  const [stations, setStations] = useState<Array<RadioStation>>([])
  const [selectedStation, setSelectedStation] = useState<RadioStation | null>(
    null,
  )
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data && !hasInitialLoaded) {
      setStations(data.data)
      setHasInitialLoaded(true)
    }
  }, [data, hasInitialLoaded])

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)
    setLoadMoreError(null)
    try {
      const current = stations.length
      const resp = await searchStations(2000, current)
      const next = resp.data
      if (next.length) {
        setStations((prev) => [...prev, ...next])
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load more'
      setLoadMoreError(msg)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, stations.length])

  if (isLoading && !hasInitialLoaded) return <div>Loading stations...</div>
  if (isError && !hasInitialLoaded) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return <div>Error loading stations: {errorMessage}</div>
  }
  if (!stations.length && hasInitialLoaded) return <div>No results</div>

  return (
    <div className="p-3">
      {hasInitialLoaded ? (
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {isLoadingMore ? 'Loading...' : 'Load 2000 more'}
          </button>
          {loadMoreError ? (
            <span className="text-red-600 text-sm">{loadMoreError}</span>
          ) : null}
          <span className="text-gray-600 text-sm ml-auto">
            Total: {stations.length}
          </span>
        </div>
      ) : null}

      <VirtualList
        items={stations}
        itemHeight={48}
        height={window.innerHeight - 300}
        renderItem={(station) => (
          <RadioStationRow
            station={station}
            selected={selectedStation?.stationuuid === station.stationuuid}
            onSelect={setSelectedStation}
          />
        )}
        getKey={(station) => station.stationuuid || station.changeuuid}
      />

      {selectedStation ? (
        <AudioPlayer
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      ) : null}
    </div>
  )
}
