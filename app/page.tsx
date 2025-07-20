"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("BOOTING...")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const updateStatus = (progress: number) => {
    if (progress < 20) {
      setStatus("BOOTING SYSTEM...")
    } else if (progress < 40) {
      setStatus("INITIALIZING...")
    } else if (progress < 60) {
      setStatus("LOADING GAME DATA...")
    } else if (progress < 80) {
      setStatus("PREPARING BIRTHDAY SURPRISE...")
    } else {
      setStatus("READY!")
    }
  }

  useEffect(() => {
    let currentProgress = 0
    intervalRef.current = setInterval(() => {
      currentProgress += 2
      setProgress(currentProgress)
      updateStatus(currentProgress)

      if (currentProgress >= 100) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        setTimeout(() => {
          onLoadingComplete()
        }, 800)
      }
    }, 150)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-6">
        <div className="border-4 border-green-500 rounded-lg p-6 bg-black">
          <h2 className="text-green-400 text-xl mb-4 font-bold retro-text text-center">A SPECIAL PAGE FOR MUTI</h2>
          <div className="mb-4 font-mono text-green-400 flex items-center">
            <span className="mr-2">{">"}</span>
            <span>{status}</span>
            <span className="animate-pulse ml-1">_</span>
          </div>
          <div className="w-full bg-gray-900 h-6 rounded-lg overflow-hidden border border-green-800 mb-2">
            <div
              className="h-full bg-green-500 transition-all duration-300 flex items-center justify-end px-2"
              style={{ width: `${progress}%` }}
            >
              <span className="text-black text-xs font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
          <p className="text-yellow-400 text-xs text-center mt-4 retro-text animate-pulse">SMILE!</p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)

  const completeLoading = () => {
    setShowLoadingScreen(false)
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Loading Screen */}
      {showLoadingScreen && <LoadingScreen onLoadingComplete={completeLoading} />}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[320px] sm:max-w-md mx-auto">
        <div className="bg-gray-300 rounded-[30px] p-3 sm:p-5 pt-6 sm:pt-8 pb-12 sm:pb-16 shadow-xl border-4 border-gray-400">
          {/* Top decoration */}
          <div className="absolute top-0 left-10 right-10 h-3 bg-gray-300 rounded-t-lg" />

          {/* Power indicator */}
          <div className="absolute top-3 left-6 flex items-center">
            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-500 mr-1 sm:mr-2" />
            <span className="text-[8px] sm:text-[10px] text-gray-700 font-bold">POWER</span>
          </div>

          {/* Brand name */}
          <div className="absolute top-3 right-6">
            <span className="text-[8px] sm:text-[10px] text-gray-700 font-bold italic">NINTENDO GAME BOY</span>
          </div>

          {/* Screen */}
          <div className="bg-gray-800 rounded-lg p-2 sm:p-3 mb-4 sm:mb-8 mt-2 sm:mt-3">
            <div className="retro-screen bg-black rounded-lg p-2 sm:p-4 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-center text-green-400 mb-0.5 sm:mb-2 retro-text">
                Happy Birthday!
              </h1>
              <p className="text-sm sm:text-base text-yellow-300 text-center retro-text whitespace-nowrap">
                Press Start Button
              </p>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[6px] sm:text-[8px] text-gray-500 font-bold">DOT MATRIX WITH STEREO SOUND</span>
              <div className="flex items-center">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500 mr-0.5 sm:mr-1" />
                <span className="text-[6px] sm:text-[8px] text-gray-500">BATTERY</span>
              </div>
            </div>
          </div>

          {/* Game buttons */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
            <div className="col-span-2 grid grid-cols-2 gap-2 sm:gap-4 mb-2">
              <Link
                href="/message"
                className="retro-button bg-blue-500 text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-center hover:bg-blue-600 transition-colors text-xs sm:text-base"
              >
                Message
              </Link>
              <Link
                href="/gallery"
                className="retro-button bg-red-500 text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-center hover:bg-red-600 transition-colors text-xs sm:text-base"
              >
                Gallery
              </Link>
              <Link
                href="/music"
                className="retro-button bg-purple-500 text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-center hover:bg-purple-600 transition-colors text-xs sm:text-base"
              >
                Music
              </Link>
              <Link
                href="/tetris"
                className="retro-button bg-green-500 text-white font-bold py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-center hover:bg-green-600 transition-colors text-xs sm:text-base"
              >
                Tetris
              </Link>
            </div>

            {/* D-pad */}
            <div className="relative h-20 sm:h-24 flex items-center justify-center">
              <div className="relative w-20 sm:w-24 h-20 sm:h-24">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 sm:w-8 h-6 sm:h-8 bg-gray-700 rounded-full" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-gray-900 flex items-center justify-center rounded-sm">
                  <span className="text-gray-400 text-[10px] sm:text-xs">↑</span>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-gray-900 flex items-center justify-center rounded-sm">
                  <span className="text-gray-400 text-[10px] sm:text-xs">↓</span>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-gray-900 flex items-center justify-center rounded-sm">
                  <span className="text-gray-400 text-[10px] sm:text-xs">←</span>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-gray-900 flex items-center justify-center rounded-sm">
                  <span className="text-gray-400 text-[10px] sm:text-xs">→</span>
                </div>
              </div>
            </div>

            {/* A/B buttons */}
            <div className="flex items-center justify-end space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-[10px] sm:text-xs font-bold text-white">B</span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-[10px] sm:text-xs font-bold text-white">A</span>
              </div>
            </div>
          </div>

          {/* Select/Start buttons */}
          <div className="flex justify-center items-center space-x-4 sm:space-x-6">
            <div className="w-10 sm:w-12 h-3 sm:h-4 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-[6px] sm:text-[8px] text-gray-400">SELECT</span>
            </div>
            <Link href="/message">
              <div className="w-10 sm:w-12 h-3 sm:h-4 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
                <span className="text-[6px] sm:text-[8px] text-gray-400">START</span>
              </div>
            </Link>
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-0 left-10 right-10 h-3 bg-gray-300 rounded-b-lg" />

          {/* Speaker grille */}
          <div className="absolute bottom-6 sm:bottom-8 right-5 sm:right-6">
            <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
