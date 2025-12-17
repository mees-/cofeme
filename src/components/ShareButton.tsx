"use client"

import { useState } from "react"
import { QRCode } from "./QRCode"

type ShareButtonProps = {
  groupId: string
  groupName: string
}

export function ShareButton({ groupId, groupName }: ShareButtonProps) {
  const [showQR, setShowQR] = useState(false)
  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/${groupId}/join` : ""

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${groupName} on CoffeeMe`,
          text: `Join ${groupName} on CoffeeMe`,
          url: joinUrl,
        })
      } catch (error) {
        // User cancelled or error occurred
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(joinUrl)
        alert("Link copied to clipboard!")
      } catch (error) {
        console.error("Error copying:", error)
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          Share
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          {showQR ? "Hide" : "QR"}
        </button>
      </div>
      {showQR && joinUrl && (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-indigo-200 dark:border-purple-800 shadow-lg p-4 flex justify-center">
          <QRCode value={joinUrl} size={180} />
        </div>
      )}
    </div>
  )
}
