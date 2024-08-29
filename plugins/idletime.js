import Vue from 'vue'
import IdleTimer from '@/includes/IdleTimer'

export default () => {
  Vue.use(IdleTimer, {
    idleTime: 60 * 60, // secs
    trigger: ['mousedown', 'touchstart', 'mouseover', 'scroll']
  })
}
