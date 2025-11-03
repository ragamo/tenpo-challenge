import { useState } from 'react'
import { CountryFlag } from './CountryFlag'
import type { RadioStation } from '../types/radio.stations'

export function RadioStationRow({
  station,
  selected,
  onSelect,
}: {
  station: RadioStation
  selected?: boolean
  onSelect?: (station: RadioStation) => void
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <button
      type="button"
      onClick={() => onSelect?.(station)}
      className={
        'w-full text-left flex items-center gap-3 px-3 py-2 border-b border-gray-200 bg-white hover:bg-gray-50 focus:outline-none ' +
        (selected ? 'bg-blue-200! ' : '')
      }
    >
      {station.favicon && !imgError ? (
        <img
          src={station.favicon}
          alt=""
          className="w-5 h-5 rounded object-cover"
          onError={(e) => setImgError(true)}
        />
      ) : (
        <div className="w-5 h-5 rounded bg-gray-200" />
      )}
      <div className="flex-1 font-semibold truncate">{station.name || '—'}</div>
      <div className="text-gray-600 text-xs">
        {station.country} &nbsp;
        <CountryFlag country={station.countrycode} />
      </div>
    </button>
  )
}
