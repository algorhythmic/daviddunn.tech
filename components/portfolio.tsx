"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Play, Filter } from "lucide-react"
import { projects } from "@/lib/portfolio-data"

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const categories = ["all", "data-engineering", "web-apps", "machine-learning", "analytics"]

  const filteredProjects =
    selectedCategory === "all" ? projects : projects.filter((project) => project.category === selectedCategory)

  return (
    <section id="portfolio" className="min-h-screen bg-neo-cyan-light dark:bg-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-foreground dark:text-white mb-4">PROJECT PORTFOLIO</h2>
          <p className="text-xl font-bold text-foreground dark:text-gray-200 mb-8">
            Showcasing cutting-edge data engineering and web development projects
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Filter className="text-foreground dark:text-white mr-2" size={24} />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 font-bold border-4 border-theme-border dark:border-neo-blue-500 transition-all duration-150 ${
                  selectedCategory === category
                    ? "bg-neo-yellow-light dark:bg-neo-yellow-dark shadow-[4px_4px_0px_0px] shadow-theme-border dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-theme-border dark:text-black"
                    : "bg-theme-surface dark:bg-slate-700 text-foreground dark:text-white shadow-[4px_4px_0px_0px] shadow-theme-border dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px] hover:shadow-theme-border dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] hover:bg-neo-yellow-light dark:hover:bg-neo-yellow-dark"
                }`}
              >
                {category.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={project.id}
              className={`border-4 border-theme-border dark:border-neo-blue-500 shadow-[8px_8px_0px_0px] shadow-theme-border dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-graph-paper dark:bg-graph-paper-dark transition-all duration-200 cursor-pointer ${
                hoveredProject === index
                  ? "shadow-[4px_4px_0px_0px] shadow-theme-border dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[4px] translate-y-[4px]"
                  : "hover:shadow-[4px_4px_0px_0px] hover:shadow-theme-border dark:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px]"
              }`}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <CardHeader className="pb-4">
                <div className="aspect-video bg-gradient-to-br from-neo-pink-light to-neo-purple-light dark:from-neo-pink-dark dark:to-neo-purple-dark border-2 border-theme-border dark:border-neo-blue-500 mb-4 flex items-center justify-center">
                  <div className="text-5xl">{project.icon}</div>
                </div>
                <CardTitle className="font-black text-2xl text-foreground dark:text-white mb-2">
                  {project.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Badge
                      key={tech}
                      className="bg-neo-pink-light dark:bg-neo-pink-dark text-theme-border dark:text-black border-2 border-theme-border dark:border-black font-bold hover:bg-pink-500"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 4 && (
                    <Badge className="bg-gray-200 dark:bg-gray-600 text-theme-border dark:text-white border-2 border-theme-border dark:border-neo-blue-500 font-bold">
                      +{project.technologies.length - 4} more
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground dark:text-gray-200 font-bold mb-5 text-base leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-3 mb-5">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-sm font-bold text-foreground dark:text-gray-300">
                      <div className="w-3 h-3 bg-neo-green-light dark:bg-neo-green-dark border border-theme-border dark:border-black mr-2 mt-1 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-neo-green-light dark:bg-neo-green-dark hover:bg-green-500 text-theme-border dark:text-black font-bold py-2 px-3 border-2 border-theme-border dark:border-black text-center transition-all duration-150 text-sm flex items-center justify-center shadow-[2px_2px_0px_0px] shadow-theme-border dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px] hover:shadow-theme-border dark:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]"
                    >
                      <ExternalLink className="inline mr-1" size={16} />
                      LIVE
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-neo-yellow-light dark:bg-neo-yellow-dark hover:bg-yellow-500 text-theme-border dark:text-black font-bold py-2 px-3 border-2 border-theme-border dark:border-black text-center transition-all duration-150 text-sm flex items-center justify-center shadow-[2px_2px_0px_0px] shadow-theme-border dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px] hover:shadow-theme-border dark:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]"
                    >
                      <Play className="inline mr-1" size={16} />
                      DEMO
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-theme-border dark:text-white font-bold py-2 px-3 border-2 border-theme-border dark:border-neo-blue-500 text-center transition-all duration-150 text-sm flex items-center justify-center shadow-[2px_2px_0px_0px] shadow-theme-border dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px] hover:shadow-theme-border dark:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <Github className="inline mr-1" size={16} />
                    CODE
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-theme-surface dark:bg-slate-800 border-4 border-theme-border dark:border-neo-blue-500 p-8 shadow-[8px_8px_0px_0px] shadow-theme-border dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
              <h3 className="text-2xl font-black text-foreground dark:text-white mb-2">NO PROJECTS FOUND</h3>
              <p className="font-bold text-foreground dark:text-gray-200">Try selecting a different category</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
