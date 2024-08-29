export default function({ store, redirect, app }) {
  if (store.getters['user/isExclusiveEnabled']) {
    return true
  } else {
    redirect(app.localePath('/weboffice/'))
  }
}
