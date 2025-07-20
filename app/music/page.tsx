"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"

interface Song {
  title: string
  artist: string
  src: string
  duration: string
}

export default function MusicPage() {
  const [currentSong, setCurrentSong] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const songs: Song[] = [
    { title: "Best Part", artist: "Daniel Casesar", src: "/music/lagu1.mp3", duration: "3:31" },
    { title: "Until I Found You", artist: "Stephen Sanchez", src: "/music/lagu2.mp3", duration: "2:58" },
    { title: "Butterflies", artist: "Kacey Musgraves", src: "/music/lagu3.mp3", duration: "3:40" },
  ]

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextSong = () => {
    setCurrentSong((prev) => (prev + 1) % songs.length)
  }

  const prevSong = () => {
    setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime)
      const updateDuration = () => setDuration(audio.duration)

      audio.addEventListener("timeupdate", updateTime)
      audio.addEventListener("loadedmetadata", updateDuration)

      return () => {
        audio.removeEventListener("timeupdate", updateTime)
        audio.removeEventListener("loadedmetadata", updateDuration)
      }
    }
  }, [currentSong])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-4 relative">
      <div className="max-w-md mx-auto bg-gray-800 border-4 border-yellow-300 rounded-xl overflow-hidden shadow-2xl p-6 relative">
        <div className="retro-screen bg-black rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-center text-green-400 mb-4 retro-text">Music Player</h1>

          {/* Music display */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4 border-2 border-gray-700">
            <div className="text-center mb-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <div className="text-4xl">🎵</div>
              </div>

              <h2 className="text-yellow-300 text-lg retro-text mb-1 truncate">{songs[currentSong].title}</h2>
              <p className="text-green-400 text-sm retro-text truncate">{songs[currentSong].artist}</p>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{songs[currentSong].duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center space-x-6">
              <button
                onClick={prevSong}
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <span className="text-white text-lg">⏮</span>
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <span className="text-white text-xl">{isPlaying ? "⏸" : "▶"}</span>
              </button>

              <button
                onClick={nextSong}
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <span className="text-white text-lg">⏭</span>
              </button>
            </div>
          </div>

          {/* Playlist */}
          <div className="bg-gray-900 rounded-lg p-3 border-2 border-gray-700">
            <h3 className="text-green-400 text-sm retro-text mb-2">PLAYLIST:</h3>
            <div className="space-y-1">
              {songs.map((song, index) => (
                <div
                  key={index}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    index === currentSong ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setCurrentSong(index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold truncate">{song.title}</div>
                      <div className="text-xs opacity-75 truncate">{song.artist}</div>
                    </div>
                    <div className="text-xs">{song.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <audio ref={audioRef} src={songs[currentSong].src} onEnded={nextSong} />

        <Link
          href="/tetris"
          className="block w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg text-center hover:bg-green-600 transition-colors retro-button mb-4"
        >
          SELANJUTNYA
        </Link>
        <Link
          href="/"
          className="block w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg text-center hover:bg-red-600 transition-colors retro-button"
        >
          KEMBALI
        </Link>
      </div>
    </div>
  )
}
