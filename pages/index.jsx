import { parseString } from 'xml2js'
import { useEffect, useState } from 'react'

const Home = () => {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {}, [results])

  const Searcher = async () => {
    setResults([])

    const res = await fetch(
      `https://jackett.at7.in/api/v2.0/indexers/all/results/torznab?apikey=qbittorrent&q=${search}`
    )
    const xml = await res.text()

    const json = []

    parseString(xml, function (err, result) {
      json = result.rss.channel[0].item
    })

    setResults(json)
    console.log(json[0])
  }

  return (
    <div className="w-screen p-4">
      <main className="flex items-center">
        <input
          type="text"
          className="h-10 rounded-lg border-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>

        <button className="ml-4 h-10 rounded-lg bg-black px-8 text-xl text-white" onClick={Searcher}>
          Search
        </button>
      </main>

      <div className="mt-4 flex flex-col gap-y-2 pb-8">
        {results.map((element, key) => {
          return (
            <div className="flex" key={key}>
              <p className="text-black">{element.title}</p>
              <a href={element.link}>
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
