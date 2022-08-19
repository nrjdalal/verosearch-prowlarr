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
    if (search !== '') {
      setResults([])
      setStatus(true)

      const api = [
        { link: 'https://jditej.at7.in', key: '531ae118e5fe4b67ade8f1c862a047dd' },
        { link: 'https://potato.at7.in', key: 'c3218081b3b04bc2b22ad919e2e60b3f' },
      ]
      const currentApi = api[1]

      const res = await fetch(currentApi.link + `/api/v1/search?query=${search}&type=search&apikey=` + currentApi.key)

      let json = await res.json()

      if (json !== undefined) {
        json = json.map((element) => {
          const info = {
            title: element.title,
            date: element.publishDate,
            unix: new Date(element.publishDate).getTime() / 1000,
            size: element.size,
            indexer: element.indexer.replace(/ /g, ''),
            link: element.downloadUrl || element.guid || element.magnetUrl,
            torznab: {
              seeders: element.seeders,
            },
          }

          // matcher of all search terms
          search.split(' ').forEach((term) => {
            const title = element.title.toLowerCase()
            if (!title.includes(term.toLowerCase())) {
              info = {}
            }
          })

          return info
        })

        // removing empty objects
        json = json.filter((element) => {
          if (Object.keys(element).length !== 0) {
            return true
          }
          return false
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
  }

  {
    // ~ Filter Logic
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
    <div className="bg-slate-100">
      <div className="mx-auto min-h-screen max-w-6xl p-4 text-sm md:text-base">
        <main className="mt-4 flex items-center justify-between">
          <input
            type="text"
            className="h-12 w-full rounded-lg border-2 border-slate-400 text-lg md:text-xl lg:w-3/4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type here!"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                Searcher()
              }
            }}
          />

          <button
            className={`ml-4 flex h-12 w-1/6 items-center justify-center rounded-lg text-xl text-white lg:w-1/4 ${
              search ? 'bg-slate-900' : 'cursor-not-allowed bg-slate-300'
            } ${status ? 'animate-pulse' : ''}`}
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

        {
          // ~ Search status and number of results
        }
        <p
          className={`mt-4 border-b-2 border-slate-200 pb-4 text-center font-medium ${status ? 'animate-bounce' : ''}`}
        >
          {status
            ? 'Searching...'
            : `${results.length !== 0 ? `${results.length} results found!` : 'No results! Search something!'}`}
        </p>

        {
          // ~ Filters
        }
        <div className="mt-4 flex gap-2 font-medium">
          <button
            className={`w-1/3 rounded-lg py-2 ${
              date ? 'border-[1px] border-slate-300 bg-slate-200 text-slate-700' : ''
            }`}
            onClick={() => SwitchFilter('date')}
          >
            Date
          </button>
          <button
            className={`w-1/3 rounded-lg py-2 ${
              seed ? 'border-[1px] border-slate-300 bg-slate-200 text-slate-700' : ''
            }`}
            onClick={() => SwitchFilter('seed')}
          >
            Seed
          </button>
          <button
            className={`w-1/3 rounded-lg py-2 ${
              size ? 'border-[1px] border-slate-300 bg-slate-200 text-slate-700' : ''
            }`}
            onClick={() => SwitchFilter('size')}
          >
            Size
          </button>
        </div>

        <div className="my-4 flex flex-col gap-y-4">
          {results.map((element, key) => {
            return (
              <div className="relative flex flex-col rounded-lg bg-white p-4 shadow-md" key={key}>
                {
                  // ~ Title
                }
                <p className="break-all font-medium text-black line-clamp-2">{element.title}</p>

                <div className="mt-2 flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    {
                      // ~ Time
                    }
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p>{time(element.unix)}</p>
                    </div>
                    {
                      // ~ Seed
                    }
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <p className="text-green-600">{element.torznab.seeders}</p>
                    </div>
                    {
                      // ~ Size
                    }
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                        />
                      </svg>
                      <p>{hsize(element.size)}</p>
                    </div>
                    {
                      // ~ Index
                    }
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                      <p>{element.indexer}</p>
                    </div>
                  </div>

                  <a href={element.link}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
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
    return Math.floor(interval) + 'y'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + 'm'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + 'd'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + 'h'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + 'min'
  }
  return Math.floor(seconds) + 'sec'
}
