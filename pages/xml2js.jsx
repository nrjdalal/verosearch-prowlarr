import { parseString } from 'xml2js'
import { useEffect, useState } from 'react'

const XML2JS = () => {
  const [results, setResults] = useState('')

  const Searcher = async () => {
    setResults('')

    const res = await fetch(
      `https://jackett.at7.in/api/v2.0/indexers/all/results/torznab?apikey=qbittorrent&q=harley+quinn+s03e01+hmax+1080p+rarbg`
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
      setResults(JSON.stringify(json))
    }
  }

  return (
    <div className="m-4">
      <button onClick={Searcher}>Search</button>
      <p>{results}</p>
    </div>
  )
}

export default XML2JS
