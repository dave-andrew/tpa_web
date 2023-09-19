import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { client } from './apollo/apolloClient.tsx'
import { ApolloProvider } from "@apollo/client"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
