import { useState, useEffect } from 'react'
 
function Water() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    fetch('https://danepubliczne.imgw.pl/api/data/hydro2/id/153190080')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>
 
  return (
      <p>{data[0].stan} cm</p>
  )
}