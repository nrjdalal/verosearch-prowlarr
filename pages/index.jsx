import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Home = () => {
  const [search, setSearch] = useState([])

  useEffect(() => {}, [search])

  const Searcher = async () => {
    const xml = await fetch(
      'https://jackett.at7.in/api/v2.0/indexers/cloudtorrents/results/torznab?apikey=qbittorrent&q=the+boys+1080p'
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
    <div>
      <main className="flex w-full items-center justify-center gap-x-8 px-20 py-10 text-center">
        <button className="rounded-xl bg-black p-8 py-2 text-xl text-white" onClick={Searcher}>
          Search
        </button>

        <button onClick={() => setSearch([])}>Clear</button>
      </main>

      <div className="pb-8">
        {search.map((element, key) => {
          return (
            <p className="text-center text-black" key={key}>
              {key + 1} ~ {element.title}
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default Home
