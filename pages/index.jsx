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
  }

  return (
    <div className="w-screen">
      <main className="ml-4 flex items-center py-8">
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

      <div className="flex flex-col gap-y-2 pb-8 pl-4">
        {results.map((element, key) => {
          return (
            <p className="text-black" key={key}>
              {key + 1} <br /> {element.title}
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default Home
