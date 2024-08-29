export default function({ store, redirect, app }) {
  if (!store.getters['user/isLoggedIn']) {
    return true
  } else {
    redirect(app.localePath('index'))
  }
}
