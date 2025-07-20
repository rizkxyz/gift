"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

interface Photo {
  type: "image" | "video"
  src: string
  alt: string
}

function PhotoItem({
  photo,
  index,
  isActive = false,
  onClick,
}: {
  photo: Photo
  index: number
  isActive?: boolean
  onClick?: () => void
}) {
  if (!photo) return null

  return (
    <div className={`bg-white p-3 rounded-md shadow-lg relative ${isActive ? "ring-2 ring-green-400" : ""}`}>
      <div
        className="relative bg-black w-full h-52 mb-2 overflow-hidden"
        onClick={onClick}
        style={{ cursor: photo.type === "video" && isActive ? "pointer" : "default" }}
      >
        {photo.type === "image" ? (
          <div className="relative w-full h-full">
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <div className="w-16 h-16 rounded-full bg-red-600 bg-opacity-75 flex items-center justify-center mb-2">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
            </div>
            <p className="text-white text-xs animate-pulse mb-1">Klik untuk memutar video</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 py-1 px-2">
          <p className="text-yellow-300 text-xs text-center retro-text">{photo.alt}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-2 h-2 rounded-full bg-black" />
        <div className="px-3 py-0.5 bg-yellow-400 text-xs text-black font-bold rounded">
          {new Date().toLocaleDateString("id-ID", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
        <div className="w-2 h-2 rounded-full bg-black" />
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [isPrinting, setIsPrinting] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const photos: Photo[] = [
    { type: "image", src: "/img/gallery/foto1.jpg", alt: "MUTIMUTIMUTI" },
    { type: "image", src: "/img/gallery/foto2.jpg", alt: "IMUTIMUTIMUT" },
    { type: "image", src: "/img/gallery/foto3.jpg", alt: "INSANE LIGHTING" },
    { type: "image", src: "/img/gallery/foto4.jpg", alt: "MY FAV" },
    { type: "video", src: "/videos/clip.mp4", alt: "Random Clip" },
  ]

  const startPrinting = () => {
    setCurrentIndex(-1)
    setProgress(0)
    setIsPrinting(true)
    setTimeout(() => {
      printPhoto(0)
    }, 1000)
  }

  const printPhoto = (index: number) => {
    if (index >= photos.length) {
      setIsPrinting(false)
      return
    }

    setCurrentIndex(index)
    setProgress(0)

    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      if (elapsed < 2500) {
        setProgress(Math.min(100, (elapsed / 2500) * 100))
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setProgress(100)
        if (index === photos.length - 1) {
          setTimeout(() => {
            setIsPrinting(false)
            setShowVideo(true)
          }, 1000)
        } else {
          setTimeout(() => {
            printPhoto(index + 1)
          }, 1000)
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-4 relative">
      <div className="max-w-md mx-auto bg-gray-800 border-4 border-yellow-300 rounded-xl overflow-hidden shadow-2xl p-6 relative">
        <div className="retro-screen bg-black rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-center text-green-400 mb-2 retro-text">Gallery</h1>

          {/* Photobox header */}
          <div className="relative w-full h-12 bg-gray-700 rounded-t-lg flex items-center justify-between px-4 mb-2">
            <div className={`w-3 h-3 rounded-full ${isPrinting ? "bg-red-500 animate-pulse" : "bg-red-800"}`} />
            <div className="font-bold text-yellow-300 text-xs tracking-widest">HEYTML PHOTOBOX</div>
            <div
              className={`w-3 h-3 rounded-full ${!isPrinting && currentIndex >= 0 ? "bg-green-500" : "bg-green-800"}`}
            />
          </div>

          {/* Paper slot */}
          <div className="relative w-full h-10 bg-gray-600 mb-2 overflow-hidden flex justify-center items-center">
            <div className="w-4/5 h-2 bg-black" />
            {isPrinting && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-4/5 h-3 bg-white animate-pulse" />
            )}
          </div>

          {/* Main display area */}
          <div className="bg-gray-800 rounded-lg p-2 border-2 border-gray-700 min-h-[400px] flex flex-col items-center justify-start relative">
            {/* Initial state */}
            {currentIndex === -1 && !isPrinting && (
              <div className="absolute inset-0 bg-gray-900 rounded flex flex-col items-center justify-center">
                <p className="text-gray-500 text-sm mb-6">Photobox siap digunakan</p>
                <button
                  onClick={startPrinting}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-4 rounded-lg retro-text transition-colors animate-pulse"
                >
                  MULAI CETAK
                </button>
              </div>
            )}

            {/* Loading state */}
            {currentIndex === -1 && isPrinting && (
              <div className="absolute inset-0 bg-gray-900 rounded flex items-center justify-center">
                <p className="text-gray-500 text-sm animate-pulse">Mempersiapkan photobox...</p>
              </div>
            )}

            {/* Photo display */}
            <div
              ref={scrollRef}
              style={{ display: currentIndex >= 0 ? "block" : "none" }}
              className="w-full h-full overflow-y-auto hide-scrollbar"
            >
              <div className="flex flex-col items-center py-4 space-y-4">
                {/* Completed photos */}
                {Array.from({ length: currentIndex }).map((_, index) => (
                  <div key={index} className="w-4/5">
                    <PhotoItem photo={photos[index]} index={index} />
                  </div>
                ))}

                {/* Currently printing photo */}
                {currentIndex >= 0 && currentIndex < photos.length && (
                  <div className="w-4/5 relative overflow-hidden">
                    <div style={{ clipPath: `inset(0 0 ${100 - progress}% 0)` }} className="relative">
                      <PhotoItem
                        photo={photos[currentIndex]}
                        index={currentIndex}
                        isActive={true}
                        onClick={() => photos[currentIndex].type === "video" && progress === 100 && setShowVideo(true)}
                      />
                    </div>
                    {progress < 100 && (
                      <div
                        style={{
                          top: `${progress}%`,
                          transform: "translateY(-50%)",
                          boxShadow: "0 0 10px rgba(255,0,0,0.7)",
                        }}
                        className="absolute w-full h-3 bg-red-500 opacity-50"
                      />
                    )}
                  </div>
                )}

                {/* Progress indicator */}
                {isPrinting && currentIndex >= 0 && (
                  <div className="w-4/5 text-center mt-2">
                    <p className="text-yellow-300 text-xs animate-pulse">
                      Mencetak foto {currentIndex + 1} dari {photos.length - 1}... ({Math.round(progress)}%)
                    </p>
                  </div>
                )}

                {/* Restart button */}
                {currentIndex === photos.length - 1 && progress === 100 && !isPrinting && !showVideo && (
                  <div className="w-4/5">
                    <button
                      onClick={() => {
                        setShowVideo(false)
                        setCurrentIndex(-1)
                        setProgress(0)
                        setIsPrinting(false)
                        if (animationRef.current) {
                          cancelAnimationFrame(animationRef.current)
                        }
                        setTimeout(startPrinting, 800)
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 w-full rounded-lg retro-text transition-colors"
                    >
                      CETAK ULANG
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Video modal */}
            {showVideo && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300">
                <div className="relative transform transition-transform duration-300 scale-100">
                  <button
                    onClick={() => setShowVideo(false)}
                    className="absolute -top-10 right-0 text-white text-xl bg-red-600 w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="bg-black rounded-lg shadow-2xl border-4 border-yellow-300 overflow-hidden flex flex-col">
                    <div className="p-2 bg-gray-800 text-yellow-300 text-center text-sm retro-text">Birthday Video</div>
                    <div className="w-[280px] md:w-[320px] flex items-center justify-center bg-black">
                      <video controls autoPlay playsInline className="w-full">
                        <source src={photos[4].src} type="video/mp4" />
                        Browser Anda tidak mendukung pemutaran video.
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div className="relative w-full h-12 bg-gray-700 rounded-b-lg flex items-center justify-center gap-4 mt-2">
            <div className="w-12 h-5 rounded-full bg-gray-800" />
            <div className="w-12 h-5 rounded-full bg-gray-800" />
          </div>
        </div>

        {/* Navigation buttons */}
        <Link
          href="/music"
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

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .border-l-12 {
          border-left-width: 12px;
        }
      `}</style>
    </div>
  )
}
