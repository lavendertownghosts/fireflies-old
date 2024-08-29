export default function({ store, redirect, app }) {
  if (store.getters['user/isDistributor']) {
    return true
  } else {
    store.dispatch('general/showSnackbar', {
      message: 'Permission denied'
    })
    redirect(app.localePath('/'))
  }
}
