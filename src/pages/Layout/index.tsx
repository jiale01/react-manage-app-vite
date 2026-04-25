import { useEffect } from "react"
import { request } from "@/utils"
const Layout = () => {
  useEffect(() => {
    request.get('/user/profile')
  }, [])
  return (
    <div>
      this is layout
    </div>
  )
}

export default Layout