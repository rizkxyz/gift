"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export default function BirthdayMessage() {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const fullMessage = `Happy Birthday Mutii!!!!

Semoga dengan bertambahnya umur ini kamu makin pinter, makin dewasa, makin keren, yaa pokoknya jadi diri kamu yang lebih baik lah dari yang sebelumnya. Semoga apapun yang jadi cita-cita kamu, entah itu tentang kampus, karir, keluarga, atau apapun itu bisa tercapai yaa.

Aku bersyukur banget bisa kenal orang seindah dan sebaik kamu. Makasih ya udah jadi temen curhat, partner in crime, dan seseorang yang bisa memotivasi aku buat terus berkembang. Jangan lupa kita bakal terus jalan dan mengejar mimpi kita bareng2.

Sekali lagi,
Happy Birthday Mutii!!!
Love u a lot`

const currentIndex = useRef(0)
useEffect(() => {

  if (isComplete) {
    setDisplayedText(fullMessage)
    return
  }

  const interval = setInterval(() => {
    if (currentIndex.current < fullMessage.length) {
      const nextChar = fullMessage.charAt(currentIndex.current)

      setDisplayedText((prev) => prev + nextChar)
      currentIndex.current += 1
    } else {
      clearInterval(interval)
      setIsComplete(true)
    }
  }, 35)

  return () => clearInterval(interval)
}, [isComplete])

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-2 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-[360px] sm:max-w-md mx-auto bg-gray-900 border-4 border-yellow-300 rounded-xl overflow-hidden shadow-2xl p-3 sm:p-6">
        <div className="retro-screen bg-black rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 h-[70vh] sm:h-96 overflow-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-green-400 mb-2 sm:mb-4 retro-text">Message</h1>

          <pre className="whitespace-pre-wrap text-green-400 font-mono text-xs sm:text-sm leading-relaxed text-justify">
            {displayedText || "Loading message..."}
          </pre>

          {!isComplete && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIsComplete(true)}
                className="bg-blue-500 px-4 py-2 rounded-lg text-white retro-text text-xs hover:bg-blue-600 transition-colors"
              >
                SKIP
              </button>
            </div>
          )}
        </div>

        <Link
          href="/gallery"
          className="block w-full bg-green-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-center hover:bg-green-600 transition-colors retro-button mb-2 sm:mb-4 text-sm sm:text-base"
        >
          SELANJUTNYA
        </Link>

        <Link
          href="/"
          className="block w-full bg-red-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-center hover:bg-red-600 transition-colors retro-button text-sm sm:text-base"
        >
          KEMBALI
        </Link>
      </div>

      <style jsx global>{`
        .retro-text {
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 10px currentColor;
        }
        .retro-screen {
          box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.2);
        }
        .retro-button {
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 5px currentColor;
        }
      `}</style>
    </div>
  )
}
