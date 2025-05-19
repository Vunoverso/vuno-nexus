export function getUserId(): string {
  if (typeof window === "undefined") return "anon-server"
  const key = "vuno-user-id"
  let userId = localStorage.getItem(key)
  if (!userId) {
    userId = crypto.randomUUID()
    localStorage.setItem(key, userId)
  }
  return userId
}
