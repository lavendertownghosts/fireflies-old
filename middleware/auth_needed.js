export default function({ store, redirect, app, route }) {
  if (route.name === null || route.path === null) {
    return true
  }

  if (
    route.path.includes('/conditions/general-business-terms-and-conditions') ||
    route.path.includes('user/reset-password') ||
    route.path.includes('user/change-password') ||
    route.path.includes('user/registration') ||
    route.path.includes('user/impersonation') ||
    route.path.includes('home/gallery') ||
    route.path.includes('/support') ||
    route.path.includes('/privacy') ||
    route.path.includes('maintenance') ||
    route.path.includes('/aszf') ||
    route.path.includes('/about')
  ) {
    return true
  } else if (
    store.getters['user/isLoggedIn'] &&
    route.name.includes('index___')
  ) {
    redirect(app.localePath('/home'))
  } else if (
    store.getters['user/isLoggedIn'] ||
    route.name.includes('index___')
  ) {
    return true
  } else if (!route.name.includes(['index___', 'user-login___'])) {
    store.commit('user/setFrom', window.location.href)
    store.dispatch('general/showSnackbar', {
      message: 'Authentication required'
    })
    redirect(app.localePath('/'))
  }
}
