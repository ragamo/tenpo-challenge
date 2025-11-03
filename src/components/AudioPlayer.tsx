import { useState } from 'react'
import type { RadioStation } from '../types/radio.stations'

export function AudioPlayer({
  station,
  onClose,
}: {
  station: RadioStation
  onClose: () => void
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="mt-4 p-3 border-3 border-slate-300 rounded bg-slate-100">
      <div className="flex items-center gap-3 mb-2">
        {station.favicon && !imgError ? (
          <img
            src={station.favicon}
            alt=""
            className="w-8 h-8 rounded object-cover"
            onError={(e) => setImgError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded bg-gray-200" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{station.name || '—'}</div>
          <div className="text-sm text-gray-600 truncate">
            {station.country || '—'} • {station.language || '—'}
          </div>
        </div>
        <button
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <audio
        key={station.stationuuid}
        src={station.url_resolved || station.url}
        controls
        autoPlay
        className="w-full"
      />
    </div>
  )
}
