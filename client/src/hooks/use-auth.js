import React, { useState, useEffect, useContext, createContext } from 'react'

const authContext = createContext()

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext)
}

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null)

  const login = async () => {
    try {
      const user = await getLoggedInUser()
      setUser(user)
    } catch (err) {
      console.error(err)
      setUser(null)
    }
  }

  const logout = async () => {
    setUser(null)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getLoggedInUser()
        setUser(user)
      } catch (err) {
        console.error(err)
        setUser(null)
      }
    }
    fetchData()
  }, [])

  return {
    user,
    login,
    logout,
  }
}

async function getLoggedInUser() {
  const res = await fetch('/user', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true,
    },
  })
  if (res.status === 200) return res.json()
  throw new Error('failed to authenticate user')
}
