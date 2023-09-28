interface AuthenticationClient {
  callback: Function
  requestAccessToken(config: any): void
}

interface AccessToken {
  access_token: string
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
  // @ts-ignore
  window.gapi.client.setToken('')
}

const initApiClient = (apiKey: string, discoveryDocs: string[]): Promise<any> => {
  const googleScript = document.createElement('script')
  googleScript.setAttribute('src', 'https://apis.google.com/js/api.js')
  document.head.appendChild(googleScript)

  return new Promise((resolve) => {
    googleScript.onload = () => {
      // @ts-ignore
      window.gapi.load('client', async function () {
        // @ts-ignore
        const client = window.gapi.client

        await client.init({
          apiKey: apiKey,
          discoveryDocs: discoveryDocs
        })

        resolve(client)
      })
    }
  })
}

export { initSignInClient, initApiClient, signIn, signOut }
