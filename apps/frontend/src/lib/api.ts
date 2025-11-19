export type DataItem = {
    id: number
    value: string
    type: string
  }
  
  export async function fetchData(nb: number): Promise<DataItem[]> {
    const res = await fetch(`http://167.86.110.198:8085/data/${nb}`)
    if (!res.ok) throw new Error("Erreur lors du fetch")
    return res.json()
  }