import React from 'react'
import { compose, createStore, applyMiddleware } from 'redux'
import organizerApp from '../reducers'
import thunkMiddleware from 'redux-thunk'
import { persistStore } from 'redux-persist'
import { connect, Provider } from 'react-redux'
import createRavenMiddleware from 'raven-for-redux'
import Raven from 'raven-js'
import _model from './model'
import _selectable from './select'
import _filterable from './filter'

import { connectRouter, routerMiddleware } from 'connected-react-router/immutable'
import { createBrowserHistory } from 'history'
import { getCurrentUser } from '../selectors/auth'

export const Model = _model
export const Selectable = _selectable
export const Filterable = _filterable

const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createBrowserHistory()

export const store = createStore(
    connectRouter(history)(organizerApp),
    composer(applyMiddleware(createRavenMiddleware(Raven, {getUserContext: getCurrentUser} ), thunkMiddleware, routerMiddleware(history)))
)

export const withProvider = Component => {
    return function wrapped(props) {
        return (
            <Provider store={store}>
                <Component {...props} />
            </Provider>
        )
    }
}

export const persistor = persistStore(store)

export const withModelData = mapModelToFetch => WrappedComponent => {
    return connect()(class Fetcher extends React.PureComponent {
        constructor(props) {
            super(props)
            this.state = {
                hasFetched: false,
                fetchErrors: {}
            }
        }

        componentDidMount() {
            this.fetch()
        }

        componentDidUpdate(prevProps) {
            if (prevProps.model != this.props.model) {
                this.fetch()
            }
        }

        fetch() {
            return Promise.all(Object.entries(mapModelToFetch(this.props)).map(([modelName, params]) => {
                const model = new Model(modelName)
                const catcher = err => {
                    this.setState(oldState => ({...oldState, [modelName]: err}))
                    console.error('Failed to fetch %s %o', modelName, params, err)
                    return err
                }
                if (typeof(params) == 'object') {
                    this.props.dispatch(model.fetchAll(params)).catch(catcher).then(() => {
                        this.setState({hasFetched: true})
                    })
                } else {
                    this.props.dispatch(model.fetchIfNeeded(params)).catch(catcher).then(() => {
                        this.setState({hasFetched: true})
                    })
                }
            }))
        }

        render() {
            return <WrappedComponent {...this.state} {...this.props} />
        }
    })
}

if (module.hot) {
    module.hot.accept('../reducers', () => {
        store.replaceReducer(require('../reducers').default)
    })
}
