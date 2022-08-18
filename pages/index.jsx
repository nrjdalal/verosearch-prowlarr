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

    let json

    parseString(xml, function (err, result) {
      json = result
    })

    json = json.rss.channel[0].item

    json = json.map((element) => {
      const torznab = {}

      element['torznab:attr'].forEach((element) => {
        torznab[`${element.$.name}`] = element.$.value
      })

      const info = {
        title: element.title[0],
        date: element.pubDate[0],
        unix: new Date(element.pubDate[0]).getTime() / 1000,
        size: element.size[0],
        index: element.jackettindexer[0]._,
        torznab,
      }

      return info
    })

    if (json !== undefined) {
      setResults(json)
      console.log(json[0])
    }

    setStatus(false)
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <main className="mt-4 flex items-center justify-between">
        <input
          type="text"
          className="h-12 w-full rounded-lg border-2 border-gray-300 text-xl lg:w-3/4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className={`ml-4 flex h-12 w-14 items-center justify-center rounded-lg bg-black text-xl text-white lg:w-1/4 ${
            status ? 'animate-pulse' : ''
          }`}
          onClick={Searcher}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </main>

      <div className="mt-4 mb-4 flex flex-col gap-y-4 font-mono">
        {results.map((element, key) => {
          return (
            <div className="relative flex flex-col rounded-lg bg-gray-200 p-4 " key={key}>
              <p className="break-words  text-black line-clamp-2">{element.title}</p>
              <div className="mt-2 flex items-center justify-between">
                <p>
                  {time(element.unix)} / {element.torznab.seeders} / {size(element.size)}
                </p>

                <a href={element.torznab.magneturl}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                  </svg>
                </a>
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

const time = (date) => {
  let seconds = Math.floor(new Date() / 1000 - date)
  let interval = seconds / 31536000
  if (interval > 1) {
    return Math.floor(interval) + ' years'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' months'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' days'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes'
  }
  return Math.floor(seconds) + ' seconds'
}
