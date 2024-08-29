const backendUrls = {
  development:
    process.env.DEV_BACKEND_URL || 'http://fireflies-backend.localhost/',
  production: process.env.BACKEND_URL
}

function getUrl() {
  return process.env.NODE_ENV === 'development'
    ? backendUrls.development
    : backendUrls.production
}

export default function({ $http, store }, inject) {
  const $api = $http.create({
    timeout: 110000,
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set('X-Requested-With', 'XMLHttpRequest')

          if (
            store.state.user.token !== undefined &&
            store.state.user.token !== null
          ) {
            request.headers.set('Authorization', store.state.user.token)
          }

          /* RESOLVE SESSION */
          const HOUR = 1000 * 60 * 60
          const anHourAgo = Date.now() - HOUR
          const stamp =
            store.state.user.sessionStamp !== null
              ? new Date(store.state.user.sessionStamp)
              : null
          const reset = stamp !== null ? stamp.getTime() < anHourAgo : true
          if (store.state.user.sessionGUID == null || reset) {
            store.commit(
              'user/setSessionGUID',
              Date.now().toString(36) +
                Math.random()
                  .toString(36)
                  .substring(2)
            )

            if (process.env.NODE_ENV === 'development') {
              if (reset) {
                console.log(
                  '%c i SESSION TIMEOUT ',
                  'background: #02A; color: #FFFFFF; font-weight: bold;'
                )
              }
              console.log(
                '%c i NEW SESSION: ' + store.state.user.sessionGUID + ' ',
                'background: #02A; color: #FFFFFF; font-weight: bold;'
              )
            }
          }

          store.commit('user/resetSessionTime')
          request.headers.set('Sessionguid', store.state.user.sessionGUID)
        }
      ],
      afterResponse: [
        (_request, _options, response) => {
          const debugTimes = response.headers.get('DebugTimes')
          if (debugTimes && debugTimes !== null) {
            console.table(JSON.parse(debugTimes))
          }

          const token = response.headers.get('Authorization')
          if (token && token !== null) {
            store.commit('user/setToken', token)
          }
        }
      ]
    }
  })
  $api.onError((error) => {
    if (
      error.response?.data !== undefined &&
      error.response?.data.messages === 'Expired token'
    ) {
      store.commit('user/resetState')
      window.location.href('/')
    }

    if (process.env.NODE_ENV === 'development') {
      if (error.statusCode !== 200) {
        console.log(
          '%c ! BACKEND ERROR ' + error.statusCode + ' ! ',
          'background: #F00; color: #FFFFFF; font-weight: bold;'
        )
        console.log(error.response?.data)
      }
    }
  })

  $api.setBaseURL(getUrl())

  inject('api', $api)
}
