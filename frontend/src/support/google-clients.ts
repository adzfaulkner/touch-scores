interface AuthenticationClient {
  callback: Function
  requestAccessToken(config: any): void
}

interface APIClient {
  init: Function
  setToken: Function
  sheets: {
    spreadsheets: {
      values: {
        batchUpdate: Function
      }
    }
  }
}

interface AccessToken {
  access_token: string
}

let authenticationClient: AuthenticationClient

const initSignInClient = (clientId: string, scopes: string): void => {
  const googleScript = document.createElement('script')
  googleScript.setAttribute('src', 'https://accounts.google.com/gsi/client')
  document.head.appendChild(googleScript)

  googleScript.onload = () => {
    // @ts-ignore
    authenticationClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: scopes,
      callback: '' // defined later
    })
  }
}

const signIn = (cb: Function): void => {
  authenticationClient.callback = cb
  authenticationClient.requestAccessToken({ prompt: 'consent' })
}

const signOut = (token: AccessToken): void => {
  // @ts-ignore
  window.google.accounts.oauth2.revoke(token.access_token)
  resetApiClientToken()
}

const getAPIClient = (): APIClient => {
  // @ts-ignore
  return window.gapi.client as APIClient
}

const initApiClient = (apiKey: string, discoveryDocs: string[], token: string): void => {
  const googleScript = document.createElement('script')
  googleScript.setAttribute('src', 'https://apis.google.com/js/api.js')
  document.head.appendChild(googleScript)

  googleScript.onload = () => {
    // @ts-ignore
    window.gapi.load('client', function () {
      const client = getAPIClient()

      client.init({
        apiKey: apiKey,
        discoveryDocs: discoveryDocs
      })

      client.setToken(token)
    })
  }
}

const resetApiClientToken = (): void => {
  // @ts-ignore
  getAPIClient().setToken('')
}

const makeAPICall = async (call: Function, handleE: Function) => {
  try {
    return await call()
  } catch (e: unknown) {
    // @ts-ignore
    if (e.status === 401) {
      return await handleE()
    }

    throw e
  }
}

const batchUpdateSheetValues =
  async (spreadsheetId: string, data: string[][]): Promise<void> => {
    const apiClient = getAPIClient()
    await apiClient.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource: {
        data,
        valueInputOption: 'RAW'
      }
    })
  }

export {
  initSignInClient,
  initApiClient,
  signIn,
  signOut,
  resetApiClientToken,
  makeAPICall,
  batchUpdateSheetValues
}
