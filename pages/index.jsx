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
    <div className="w-screen p-4">
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

      <div className="mt-4 mb-4 flex flex-col gap-y-2">
        {results.map((element, key) => {
          return (
            <div className="flex" key={key}>
              <p className="text-black">
                {element.title} {size(element.size)}
              </p>
              <a className="ml-2" href={element.link}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </a>
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
    bytes = (bytes / 1073741824).toFixed(1) + ' GB'
  } else if (bytes >= 1048576) {
    bytes = (bytes / 1048576).toFixed(1) + ' MB'
  } else if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(1) + ' KB'
  } else if (bytes > 1) {
    bytes = bytes + ' bytes'
  } else if (bytes == 1) {
    bytes = bytes + ' byte'
  } else {
    bytes = '0 bytes'
  }
  return bytes
}
