import { parseString } from 'xml2js'
import { useEffect, useState } from 'react'

const Home = () => {
  const [status, setStatus] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {}, [results])

  const Searcher = async () => {
    setResults([])
    setStatus(true)

    const res = await fetch(
      `https://jackett.at7.in/api/v2.0/indexers/all/results/torznab?apikey=qbittorrent&q=${search}`
    )
    const xml = await res.text()

    const json = []

    parseString(xml, function (err, result) {
      json = result.rss.channel[0].item
    })

    if (json !== undefined) {
      setResults(json)
      console.log(json[0])
    }

    setStatus(false)
  }

  return (
    <div className="w-screen p-6">
      <div className="mb-4 text-xl">The Ultimate Torrent Searcher by @nrjdalal</div>

      <main className="flex items-center">
        <input
          type="text"
          className="h-10 rounded-lg border-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className={`ml-4 h-10 rounded-lg bg-black px-8 text-xl text-white ${status ? 'animate-pulse' : ''}`}
          onClick={Searcher}
        >
          {status ? 'Searching' : 'Search'}
        </button>
      </main>

      <div className="mt-4 mb-4 flex flex-col gap-y-4">
        {results.map((element, key) => {
          return (
            <div className="relative flex flex-col rounded-lg bg-gray-200 p-4" key={key}>
              <p className="break-words font-mono text-black line-clamp-2">{element.title}</p>
              <div className="mt-2 flex justify-between">
                <p>{size(element.size)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home

const size = (bytes) => {
  if (bytes >= 1073741824) {
    bytes = (bytes / 1073741824).toFixed(1) + ' gb'
  } else if (bytes >= 1048576) {
    bytes = (bytes / 1048576).toFixed(1) + ' mb'
  } else if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(1) + ' kb'
  } else if (bytes > 1) {
    bytes = bytes + ' bytes'
  } else if (bytes == 1) {
    bytes = bytes + ' byte'
  } else {
    bytes = ' bytes'
  }
  return bytes
}
