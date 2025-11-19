import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

export default function OtherPage() {
  const [inputText, setInputText] = useState("")
  const [displayText, setDisplayText] = useState("")

  const backendUrl = "https://example.com/backend-url"

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col items-center p-20 gap-6">
      <h1 className="text-2xl font-bold">Other Page</h1>

      {/* Backend URL section */}
      <div className="flex items-center gap-2">
        <p className="text-lg">{backendUrl}</p>
        <Button onClick={() => handleCopy(backendUrl)}>Copy</Button>
      </div>

      {/* Input URL section */}
      <Input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your URL..."
        className="max-w-md"
      />

      <Link to="/">
        <Button>Submit</Button>
      </Link>
    </div>
  )
}