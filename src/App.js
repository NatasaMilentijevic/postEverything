/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createStatus } from './graphql/mutations'
import { listStatuss } from './graphql/queries'
import awsExports from "./aws-exports";
import { withAuthenticator, AmplifyAuthenticator,AmplifySignOut } from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

Amplify.configure(awsExports);

const initialState = { description: 'x' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [statuses, setStatuses] = useState([])
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  useEffect(() => {
    fetchStatuses()
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
    });
  }, [])

  function setInput(description) {
    setFormState({ description })
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
      if (!formState.description) return
      const status = { description: formState.description, name: user.username }
      setStatuses([...statuses, status])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createStatus, {input: status}))
    } catch (err) {
      console.log('error creating status:', err)
    }
  }

  return (
      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-center row">
            <div className="col-md-8">
                <div className="feed p-2">
                    <div className="d-flex flex-row justify-content-between align-items-center p-2 bg-white border">
                        <input onChange={event => setInput(event.target.value)}
                              value={formState.name}
                              placeholder="What's on your mind?"
                              className="form-control"/>
                        <button type="button" class="btn btn-success" onClick={addStatus}>Post</button>
                    </div>
                    {
                      statuses.map((status, index) => (
                        <div key={status.id ? status.id : index} className="bg-white border mt-2">
                                      <div>
                                          <div className="d-flex flex-row justify-content-between align-items-center p-2 border-bottom">
                                              <div className="d-flex flex-row align-items-center feed-text px-2"><img className="rounded-circle" src="https://i.imgur.com/aoKusnD.jpg" width="45"/>
                                                  <div className="d-flex flex-column flex-wrap ml-2"><span className="font-weight-bold">{status.name}</span><span className="text-black-50 time">40 minutes ago</span></div>
                                              </div>
                                              <div className="feed-icon px-2"><i className="fa fa-ellipsis-v text-black-50"></i></div>
                                          </div>
                                      </div>
                                      <div className="p-2 px-3"><span>{status.description}</span></div>
                                      <div className="d-flex justify-content-end socials p-2 py-3"><i className="fa fa-thumbs-up"></i><i className="fa fa-comments-o"></i><i className="fa fa-share"></i></div>
                                  </div>
                      ))
                    }
                    <div className="bg-white border mt-2">
                        <div>
                            <div className="d-flex flex-row justify-content-between align-items-center p-2 border-bottom">
                                <div className="d-flex flex-row align-items-center feed-text px-2"><img className="rounded-circle" src="https://i.imgur.com/aoKusnD.jpg" width="45"/>
                                    <div className="d-flex flex-column flex-wrap ml-2"><span className="font-weight-bold">thpmasse</span><span className="text-black-50 time">40 minutes ago</span></div>
                                </div>
                                <div className="feed-icon px-2"><i className="fa fa-ellipsis-v text-black-50"></i></div>
                            </div>
                        </div>
                        <div className="feed-image p-2 px-3"><img className="img-fluid img-responsive" src="https://i.imgur.com/aoKusnD.jpg"/></div>
                        <div className="d-flex justify-content-end socials p-2 py-3"><i className="fa fa-thumbs-up"></i><i className="fa fa-comments-o"></i><i className="fa fa-share"></i></div>
                    </div>
                </div>
            </div>
        </div>
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