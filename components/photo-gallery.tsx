"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const photos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    alt: "Speaking at Data Conference 2024",
    title: "Data Conference 2024",
    description: 'Presenting on "The Future of Real-time Analytics"',
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
    alt: "Team collaboration session",
    title: "Team Collaboration",
    description: "Working with the engineering team on data pipeline optimization",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
    alt: "Hackathon winner",
    title: "Hackathon Victory",
    description: "First place at the AI/ML Hackathon 2024",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
    alt: "Office workspace",
    title: "My Workspace",
    description: "Where the magic happens - my data engineering setup",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop",
    alt: "Conference networking",
    title: "Networking Event",
    description: "Connecting with fellow data professionals",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    alt: "Mountain hiking",
    title: "Weekend Adventure",
    description: "Finding inspiration in nature - hiking in the mountains",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop",
    alt: "Code review session",
    title: "Code Review",
    description: "Collaborative code review with the development team",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    alt: "Data visualization workshop",
    title: "Workshop Teaching",
    description: "Teaching data visualization techniques to junior developers",
  },
]

export function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setSelectedPhoto(photos[index].id)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    const nextIndex = (currentIndex + 1) % photos.length
    setCurrentIndex(nextIndex)
    setSelectedPhoto(photos[nextIndex].id)
  }

  const prevPhoto = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length
    setCurrentIndex(prevIndex)
    setSelectedPhoto(photos[prevIndex].id)
  }

  return (
    <section id="gallery" className="min-h-screen bg-neo-green-light dark:bg-gray-700 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-foreground dark:text-white mb-4">PHOTO GALLERY</h2>
          <p className="text-xl font-bold text-foreground dark:text-gray-200 mb-8">
            Behind the scenes - professional moments and personal adventures
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <div key={photo.id} className="group cursor-pointer" onClick={() => openLightbox(index)}>
              <div className="bg-theme-surface dark:bg-slate-800 border-4 border-theme-border dark:border-neo-blue-500 shadow-[8px_8px_0px_0px] shadow-theme-border dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_0px] group-hover:shadow-theme-border dark:group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.src || "/placeholder.svg"}
                    alt={photo.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-black text-foreground dark:text-white text-sm mb-1">{photo.title}</h3>
                  <p className="text-xs font-bold text-muted-foreground dark:text-gray-300">{photo.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 bg-neo-red-light dark:bg-neo-red-dark hover:bg-red-600 text-theme-surface p-2 border-2 border-theme-surface font-bold"
              >
                <X size={24} />
              </button>

              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-theme-surface hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground p-2 border-2 border-theme-border font-bold"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-theme-surface hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground p-2 border-2 border-theme-border font-bold"
              >
                <ChevronRight size={24} />
              </button>

              <div className="bg-theme-surface border-4 border-theme-border">
                <img
                  src={photos[currentIndex].src || "/placeholder.svg"}
                  alt={photos[currentIndex].alt}
                  className="max-w-full max-h-[70vh] object-contain"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-black text-foreground mb-2">{photos[currentIndex].title}</h3>
                  <p className="font-bold text-muted-foreground">{photos[currentIndex].description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
