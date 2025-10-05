import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import PropTypes from 'prop-types'
import { HelmetProvider } from '@dr.pogodin/react-helmet'

const queryClient = new QueryClient()

export function App({ children }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
App.propTypes = {
  children: PropTypes.element.isRequired,
}
