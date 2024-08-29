import Vue from 'vue'
import {
  formatDateApi,
  formatDateDisplay,
  capitalize,
  lowercase,
  truncate,
  numberFormat
} from '@/includes/utils'

Vue.filter('formatDateApi', (val) => formatDateApi(val))
Vue.filter('formatDateDisplay', (val) => formatDateDisplay(val))
Vue.filter('capitalize', (val) => capitalize(val))
Vue.filter('lowercase', (val) => lowercase(val))
Vue.filter('truncate', (val, param) => truncate(val, param))
Vue.filter('parseInt', (val) => parseInt(val))
Vue.filter('formatNumber', (value, format, options) =>
  numberFormat(value, format, options)
)
