import { parseString } from 'xml2js'
import { useEffect, useState } from 'react'

const Home = () => {
  const [status, setStatus] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  // filtering
  const [filter, setFilter] = useState('seed')
  const [date, setDate] = useState(false)
  const [seed, setSeed] = useState(true)
  const [size, setSize] = useState(false)

  const Searcher = async () => {
    setResults([])
    setStatus(true)

    const res = await fetch(
      `https://jditej.at7.in/api/v1/search?query=${search}&apikey=531ae118e5fe4b67ade8f1c862a047dd&type=search`
    )

    let json = await res.json()

    if (json !== undefined) {
      json = json.map((element) => {
        const torznab = {}

        const info = {
          title: element.title,
          date: element.publishDate,
          unix: new Date(element.publishDate).getTime() / 1000,
          size: element.size,
          indexer: element.indexer,
          link: element.magneturl,
          torznab: {
            seeders: element.seeders,
          },
        }

        return info
      })

      if (filter === 'date') {
        const res = json.sort((a, b) => b.unix - a.unix)
        setResults(res)
      }

      if (filter === 'seed') {
        const res = json.sort((a, b) => b.torznab.seeders - a.torznab.seeders)
        setResults(res)
      }

      if (filter === 'size') {
        setFilter('size')
        setDate(false)
        setSeed(false)
        setSize(true)

        const res = json.sort((a, b) => b.size - a.size)
        setResults(res)
      }
    }

    setStatus(false)
  }

  const SwitchFilter = (filter) => {
    if (filter === 'date') {
      setFilter('date')
      setDate(true)
      setSeed(false)
      setSize(false)

      const res = results.sort((a, b) => b.unix - a.unix)
      setResults(res)
    }

    if (filter === 'seed') {
      setFilter('seed')
      setDate(false)
      setSeed(true)
      setSize(false)

      const res = results.sort((a, b) => b.torznab.seeders - a.torznab.seeders)
      setResults(res)
    }

    if (filter === 'size') {
      setFilter('size')
      setDate(false)
      setSeed(false)
      setSize(true)

      const res = results.sort((a, b) => b.size - a.size)
      setResults(res)
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 text-sm md:text-base">
      <main className="mt-4 flex items-center justify-between">
        <input
          type="text"
          className="h-12 w-full rounded-lg border-2 border-gray-300 text-xl lg:w-3/4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className={`ml-4 flex h-12 w-1/6 items-center justify-center rounded-lg text-xl text-white lg:w-1/4 ${
            search ? 'bg-gray-900' : 'cursor-not-allowed bg-gray-300'
          } ${status ? 'animate-pulse' : ''}`}
          onClick={Searcher}
          disabled={!search}
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

      <p className={`mt-8 text-center ${status ? 'animate-bounce' : ''}`}>
        {status
          ? 'Searching...!'
          : `${results.length !== 0 ? `${results.length} results found!` : 'No results! Search something!'}`}
      </p>

      <div className="mt-8 flex font-mono">
        <button
          className={`w-1/3 rounded-lg py-2 ${date ? 'border-2 border-gray-300' : ''}`}
          onClick={() => SwitchFilter('date')}
        >
          Date
        </button>
        <button
          className={`w-1/3 rounded-lg py-2 ${seed ? 'border-2 border-gray-300' : ''}`}
          onClick={() => SwitchFilter('seed')}
        >
          Seed
        </button>
        <button
          className={`w-1/3 rounded-lg py-2 ${size ? 'border-2 border-gray-300' : ''}`}
          onClick={() => SwitchFilter('size')}
        >
          Size
        </button>
      </div>

      <div className="my-4 flex flex-col gap-y-4 font-mono">
        {results.map((element, key) => {
          return (
            <div className="relative flex flex-col rounded-lg bg-gray-200 p-4 " key={key}>
              <p className="break-all text-black line-clamp-2">{element.title}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs md:text-sm">
                  {time(element.unix)} / {element.torznab.seeders} / {hsize(element.size)} / {element.indexer}
                </p>

                <a href={element.link}>
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

const hsize = (bytes) => {
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
