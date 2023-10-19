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
        get: Function
        batchGet: Function
        batchUpdate: Function
      }
    }
  }
}

interface AccessToken {
  access_token: string
}

interface BatchGetItem {
  range: string
  values: string[][]
}

const initSignInClient = (clientId: string, scopes: string): Promise<any> => {
  const googleScript = document.createElement('script')
  googleScript.setAttribute('src', 'https://accounts.google.com/gsi/client')
  document.head.appendChild(googleScript)

  return new Promise<any>((resolve) => {
    googleScript.onload = () => {
      // @ts-ignore
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scopes,
        callback: '' // defined later
      })

      resolve(tokenClient)
    }
  })
}

const signIn = (authenticationClient: AuthenticationClient, cb: Function): void => {
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

const initApiClient = (apiKey: string, discoveryDocs: string[]): Promise<APIClient> => {
  const googleScript = document.createElement('script')
  googleScript.setAttribute('src', 'https://apis.google.com/js/api.js')
  document.head.appendChild(googleScript)

  return new Promise((resolve) => {
    googleScript.onload = () => {
      // @ts-ignore
      window.gapi.load('client', async function () {
        const client = getAPIClient()

        await client.init({
          apiKey: apiKey,
          discoveryDocs: discoveryDocs
        })

        resolve(client)
      })
    }
  })
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

const getSheetValues =
  (apiClient: APIClient) =>
  async (spreadsheetId: string, range: string): Promise<string[][]> => {
    const r = await apiClient.sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    })

    return r.result.values
  }

const batchGetSheetValues =
  (apiClient: APIClient) =>
  async (spreadsheetId: string, ranges: string[]): Promise<BatchGetItem[]> => {
    const r = await apiClient.sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges
    })

    return r.result.valueRanges
  }

const batchUpdateSheetValues =
  (apiClient: APIClient) =>
  async (spreadsheetId: string, data: string[][]): Promise<void> => {
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
  getSheetValues,
  batchGetSheetValues,
  batchUpdateSheetValues
}
