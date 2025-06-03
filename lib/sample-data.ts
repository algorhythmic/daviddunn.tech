export function generateRealtimeData() {
  const now = new Date()
  const data = []

  for (let i = 9; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000) // 5-minute intervals
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      users: Math.floor(Math.random() * 1000) + 2000,
      revenue: Math.floor(Math.random() * 50000) + 100000,
      performance: Math.floor(Math.random() * 20) + 80,
      growth: Math.floor(Math.random() * 10) + 15,
    })
  }

  return data
}

export function generateUserData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((month) => ({
    month,
    users: Math.floor(Math.random() * 50000) + 10000,
  }))
}

export function generateRevenueData() {
  const quarters = ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024"]
  return quarters.map((quarter) => ({
    quarter,
    revenue: Math.floor(Math.random() * 500000) + 200000,
  }))
}

export function generatePerformanceData() {
  return [
    { name: "Data Processing", value: 35 },
    { name: "API Response", value: 25 },
    { name: "Database Queries", value: 20 },
    { name: "ML Inference", value: 15 },
    { name: "Other", value: 5 },
  ]
}
