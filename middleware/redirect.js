export default function({ store, redirect, route, app }) {
  if (process.env.MAINTENANCE_MODE.toLowerCase() === 'true') {
    redirect('/en/maintenance')
  }

  // Refuse mail link redirect
  if (route.path.includes('/refuse-invite')) {
    store.dispatch('general/showPopup', {
      title: app.i18n.t('general.RefuseInviteTitle'),
      message: app.i18n.t('general.RefuseInviteMessage'),
      acceptText: app.i18n.t('general.RefuseAcceptBtn'),
      disableCancel: true
    })
    redirect(app.localePath('/'))
  } else if (route.path.includes('/refuse-signup-error')) {
    store.dispatch('general/showPopup', {
      title: app.i18n.t('general.RefuseSignupErrorTitle'),
      message: app.i18n.t('general.RefuseSignupErrorMessage'),
      acceptText: app.i18n.t('general.RefuseErrorBtn'),
      disableCancel: true
    })
    redirect(app.localePath('/'))
  } else if (route.path.includes('/refuse-invite-error')) {
    store.dispatch('general/showPopup', {
      title: app.i18n.t('general.RefuseInviteErrorTitle'),
      message: app.i18n.t('general.RefuseInviteErrorMessage'),
      acceptText: app.i18n.t('general.RefuseErrorBtn'),
      disableCancel: true
    })
    redirect(app.localePath('/'))
  }

  // redirect old CZ paths
  if (route.path.includes('/cs/cz')) {
    redirect(route.fullPath.replace('/cs/cz', '/cs'))
  } else if (route.path.includes('/en/cz')) {
    redirect(route.fullPath.replace('/en/cz', '/cs'))
  } else if (route.path.includes('/ro/cz')) {
    redirect(route.fullPath.replace('/ro/cz', '/cs'))
  } else if (route.path.includes('/hu/cz')) {
    redirect(route.fullPath.replace('/hu/cz', '/cs'))
  } else if (route.path.includes('/ru/cz')) {
    redirect(route.fullPath.replace('/ru/cz', '/cs'))
  } else if (route.path.includes('/sk/cz')) {
    redirect(route.fullPath.replace('/sk/cz', '/cs'))
  } else if (route.path.includes('/cz')) {
    redirect(route.fullPath.replace('/cz', '/'))
  }
}
