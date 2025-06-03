"use client"

import { Download, Linkedin, Github, Twitter, Mail, MapPin, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function About() {
  const skills = [
    "Python",
    "SQL",
    "Apache Spark",
    "Kafka",
    "Flink",
    "Airflow",
    "Docker",
    "Kubernetes",
    "AWS",
    "GCP",
    "Snowflake",
    "dbt",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
  ]

  const achievements = [
    "Led data pipeline optimization reducing processing time by 70%",
    "Built real-time analytics platform serving 1M+ daily users",
    "Architected ML infrastructure handling 10TB+ daily data",
    "Mentored 15+ junior engineers in data engineering best practices",
  ]

  return (
    <section id="about" className="min-h-screen bg-neo-red-light dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-4 dark:text-white">ABOUT ME</h2>
          <p className="text-xl font-bold text-foreground mb-8 dark:text-gray-200">
            Passionate about transforming data into actionable insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-4 border-theme-border shadow-[8px_8px_0px_0px] shadow-theme-border bg-theme-surface dark:bg-slate-800 dark:border-neo-blue-500 dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-neo-cyan-light to-blue-500 dark:from-neo-cyan-dark dark:to-blue-400 border-4 border-theme-border dark:border-neo-blue-500 mx-auto mb-4 flex items-center justify-center text-4xl font-black text-theme-border dark:text-white">
                    DD
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2 dark:text-white">DAVID DUNN</h3>
                  <p className="font-bold text-muted-foreground mb-4 dark:text-gray-300">
                    Senior Data & Analytics Engineer
                  </p>

                  <div className="space-y-2 text-sm font-bold text-foreground dark:text-gray-200">
                    <div className="flex items-center justify-center">
                      <MapPin size={16} className="mr-2 dark:text-neo-blue-400" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center justify-center">
                      <Calendar size={16} className="mr-2 dark:text-neo-blue-400" />
                      3+ Years Experience
                    </div>
                  </div>
                </div>

                <button className="w-full bg-neo-green-light dark:bg-neo-green-dark hover:bg-green-500 text-theme-border dark:text-black font-black py-3 px-4 border-4 border-theme-border dark:border-black shadow-[4px_4px_0px_0px] shadow-theme-border dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px] hover:shadow-theme-border dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all duration-150 mb-6 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px]">
                  <Download className="inline mr-2" size={20} />
                  DOWNLOAD RESUME
                </button>

                <div className="space-y-3">
                  <a
                    href="https://linkedin.com/in/mrdaviddunn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-2 border-black dark:border-neo-blue-500 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <Linkedin className="mr-3" size={20} />
                    LINKEDIN
                  </a>
                  <a
                    href="https://github.com/algorhythmic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 border-2 border-black dark:border-neo-blue-500 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <Github className="mr-3" size={20} />
                    GITHUB
                  </a>
                  <a
                    href="https://x.com/MrDavidDunn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-2 px-4 border-2 border-black dark:border-neo-blue-500 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <Twitter className="mr-3" size={20} />
                    TWITTER
                  </a>
                  <a
                    href="mailto:davidalexanderdunn@gmail.com"
                    className="flex items-center w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 border-2 border-black dark:border-neo-blue-500 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <Mail className="mr-3" size={20} />
                    EMAIL
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Cards */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <Card className="border-4 border-theme-border shadow-[8px_8px_0px_0px] shadow-theme-border bg-theme-surface dark:bg-slate-800 dark:border-neo-blue-500 dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6">
                <h3 className="text-2xl font-black text-foreground mb-4 dark:text-white">MY STORY</h3>
                <div className="space-y-4 text-foreground dark:text-gray-200 font-bold leading-relaxed">
                  <p>
                    I'm a <span className="dark:text-neo-blue-300">passionate</span> data engineer with 3+ years of
                    experience building <span className="dark:text-neo-blue-300">"scalable"</span> data infrastructure
                    and analytics platforms (because apparently everything needs to scale these days). My journey
                    started with a Physics degree from the University of Mars, where I fell in love with the power of
                    data to drive decisions—and by "fell in love," I mean I realized spreadsheets pay better than
                    theoretical physics.
                  </p>
                  <p>
                    Currently, I lead data engineering initiatives at a Fortune 500 company, where I've architected
                    systems processing petabytes of data daily. I specialize in real-time analytics, machine learning
                    pipelines, creating data pipelines for dinosaurs (particularly stegosaurus—they have very specific
                    ETL requirements), and building full-stack applications that make complex data accessible to
                    everyone who has the proper security clearance and a PhD in data interpretation.
                  </p>
                  <p>
                    When I'm not coding (which is never, because work-life balance is just another buzzword), you'll
                    find me hiking in the Bay Area mountains while checking Slack notifications, contributing to
                    open-source projects that nobody will ever use, or mentoring the next generation of data engineers
                    who will inevitably replace me with a ChatGPT plugin. I believe in the power of data to solve
                    real-world problems and create positive impact—because nothing says "changing the world" quite like
                    optimizing ad click-through rates and helping corporations extract maximum value from user behavior
                    patterns. Together, we're not just building pipelines; we're building a better tomorrow, one A/B
                    test at a time! 🚀✨
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white dark:bg-slate-800 dark:border-neo-blue-500 dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6">
                <h3 className="text-2xl font-black text-black dark:text-white mb-4">TECHNICAL SKILLS</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-neo-pink-light dark:bg-neo-pink-dark text-theme-border dark:text-black font-bold px-3 py-1 border-2 border-theme-border dark:border-black text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white dark:bg-slate-800 dark:border-neo-blue-500 dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6">
                <h3 className="text-2xl font-black text-black dark:text-white mb-4">KEY ACHIEVEMENTS</h3>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-neo-green-light dark:bg-neo-green-dark border-2 border-theme-border dark:border-black flex items-center justify-center mr-3 mt-0.5 font-black text-sm text-theme-border dark:text-black">
                        {index + 1}
                      </div>
                      <p className="font-bold text-foreground dark:text-gray-200">{achievement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
