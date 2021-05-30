import * as React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Global } from '@emotion/core'
import { WalletProvider } from './contexts/wallet'
import { ConnectionProvider } from './contexts/connection'
import { AccountsProvider } from './contexts/accounts'
import { MarketProvider } from './contexts/market'
import {PoolPage} from './pages/pool'
import Root from './components/layout/Root'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import normalize from './styles/normalize'
import globals from './styles/globals'

// If your app is big + you have routes with a lot of components, you should consider
// code-splitting your routes! If you bundle stuff up with Webpack, I recommend `react-loadable`.
//
// $ yarn add react-loadable
// $ yarn add --dev @types/react-loadable
//
// The given `pages/` directory provides an example of a directory structure that's easily
// code-splittable.

const Routes: React.FC = () => (
  <Root>
    <Global styles={normalize} />
    <Global styles={globals} />
    <HashRouter basename={'/'}>
      <ConnectionProvider>
        <WalletProvider>
          <AccountsProvider>
            <MarketProvider>
              <Header/>
              <Switch>
                <Route exact path="/">
                  <Redirect to="/pool" />
                </Route>
                <Route path="/pool" component={PoolPage} />
              </Switch>
              <Footer></Footer>
            </MarketProvider>
          </AccountsProvider>
        </WalletProvider>
      </ConnectionProvider>
    </HashRouter>
  </Root>
)

export default Routes
