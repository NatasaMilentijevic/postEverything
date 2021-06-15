/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createStatus } from './graphql/mutations'
import { listStatuss } from './graphql/queries'

import awsExports from "./aws-exports";
import { withAuthenticator, AmplifyAuthenticator,AmplifySignOut } from '@aws-amplify/ui-react'

Amplify.configure(awsExports);

const initialState = { name: '', description: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [statuses, setStatuses] = useState([])


  useEffect(() => {
    fetchStatuses()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchStatuses() {
    try {
      const statusData = await API.graphql(graphqlOperation(listStatuss))
      const statuses = statusData.data.listStatuss.items
      setStatuses(statuses)
    } catch (err) { console.log('error fetching statuses') }
  }

  async function addStatus() {
    try {
      if (!formState.name || !formState.description) return
      const status = { ...formState }
      setStatuses([...statuses, status])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createStatus, {input: status}))
    } catch (err) {
      console.log('error creating status:', err)
    }
  }

  return (
    <div style={styles.container}>
      <AmplifyAuthenticator>

<AmplifySignOut buttonText="Signout"></AmplifySignOut>
</AmplifyAuthenticator>

      <h2>Amplify statuses</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addStatus}>Create Status</button>
      {
        statuses.map((status, index) => (
          <div key={status.id ? status.id : index} style={styles.status}>
            <p style={styles.statusName}>{status.name}</p>
            <p style={styles.statusDescription}>{status.description}</p>
          </div>
        ))
      }
    </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  status: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  statusName: { fontSize: 20, fontWeight: 'bold' },
  statusDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}


export default withAuthenticator(App)