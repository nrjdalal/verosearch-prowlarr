import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Home = () => {
  const [search, setSearch] = useState([])

  useEffect(() => {}, [search])

  const Searcher = async () => {
    const xml = await fetch(
      'https://jackett.at7.in/api/v2.0/indexers/all/results/torznab?apikey=qbittorrent&q=harley+quinn+1080p'
    )
    const res = await await xml.text()

    let items = res.split('<item>')

    const array = []

    items.forEach((element) => {
      if (element.includes('<size>')) {
        const title = element.split('<title>')[1].split('</title>')[0]

        console.log(title)

        array.push({ title: title })
      }
    })

    setSearch(array)
  }

  return (
    <div className="w-screen">
      <main className="py-8 pl-4">
        <button className="rounded-xl bg-black p-8 py-2 text-xl text-white" onClick={Searcher}>
          Search
        </button>

        <button className="pl-4" onClick={() => setSearch([])}>
          Clear
        </button>
      </main>

      <div className="flex flex-col gap-y-2 pb-8 pl-4">
        {search.map((element, key) => {
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
