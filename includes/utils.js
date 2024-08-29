import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addYears,
  differenceInCalendarDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
  lightFormat,
  parseISO
} from 'date-fns'
import CountryList from '@/includes/countrylist'

// példa, ha kellene:
// import { ru } from 'date-fns/locale'

/**
 * Determines if the user is using a mobile device based on the user agent.
 * @returns {boolean} Returns true if the user is on a mobile device, otherwise false.
 */
export function isMobileUser() {
  if (process.client) {
    const userAgent = window.navigator.userAgent.toLowerCase()
    const mobileKeywords = [
      'android',
      'webos',
      'iphone',
      'ipad',
      'ipod',
      'blackberry',
      'iemobile',
      'opera mini'
    ]

    return mobileKeywords.some((keyword) => userAgent.includes(keyword))
  }

  return false
}

/**
 * FORMAT DATE API
 * - Util to format date to string (2020-03-25)
 *
 * @param {Number} year
 * @param {Number} month
 * @param {Number} day
 *
 * @returns {String} @format formatDateApi standard
 */
export function formatDateApi(year, month, day) {
  if (year === undefined || year === '' || year === false) {
    return
  }

  if (month !== undefined) {
    month = parseInt(month) - 1
  }

  return month === undefined
    ? lightFormat(parseISO(year), 'yyyy-MM-dd')
    : lightFormat(new Date(year, month, day), 'yyyy-MM-dd')
}

export function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

/**
 * TIMESTAMP TO DATE
 * - Util to convert UNIX timestamp to date format
 *
 * @param {String} @timestamp
 *
 * @return {String} @format Date
 */

export function timeConverter(timestamp) {
  if (isNaN(timestamp)) {
    return false
  }
  const a = new Date(timestamp * 1000)
  const time = formatDateDisplay(a.getFullYear(), a.getMonth() + 1, a.getDate())
  return time
}

/**
 * FORMAT DATE DISPLAY
 * - Util to format date to string (2020.03.25.)
 *
 * @param {Number} year
 * @param {Number} month
 * @param {Number} day
 *
 * @returns {String} @format formatDateDisplay standard
 */
export function formatDateDisplay(year, month, day) {
  if (window === undefined) {
    return
  }
  let format = 'dd.MM.yyyy.'
  if (window.$nuxt.$i18n.locale === 'en') {
    format = 'MM.dd.yyyy.'
  } else if (window.$nuxt.$i18n.locale === 'hu') {
    format = 'yyyy.MM.dd.'
  }
  if (year === undefined || year === '' || year === false) {
    return
  }

  if (month !== undefined) {
    month = parseInt(month) - 1
  }

  return month === undefined
    ? lightFormat(parseISO(year), format)
    : lightFormat(new Date(year, month, day), format)
}

/**
 * CALC NIGHTS
 * - Calculate nights between two dates
 * - Receives Date strings, not objects
 *
 * @param {String} date1 @format formatDateApi standard
 * @param {String} date2 @format formatDateApi standard
 *
 * @returns {Number}
 */
export function calcNights(date1, date2) {
  return differenceInCalendarDays(parseISO(date2), parseISO(date1))
}

/**
 * GET TOMORROW
 * - Simple global util (today +1 day)
 *
 * @returns {Date} @format formatDateApi standard
 */
export function getTomorrow() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return formatDateApi(
    tomorrow.getFullYear(),
    tomorrow.getMonth() + 1,
    tomorrow.getDate()
  )
}

/**
 * GET TODAY
 * - Simple global util (today +1 day)
 *
 * @returns {Date} @format formatDateApi standard
 */
export function getToday() {
  const tomorrow = new Date()

  return formatDateApi(
    tomorrow.getFullYear(),
    tomorrow.getMonth() + 1,
    tomorrow.getDate()
  )
}

/**
 * GET DAY AFTER TOMORROW
 * - Simple global util (today +2 days)
 *
 * @returns {Date} @format formatDateApi standard
 */
export function getDayAfterTomorrow() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 2)

  return formatDateApi(
    tomorrow.getFullYear(),
    tomorrow.getMonth() + 1,
    tomorrow.getDate()
  )
}

/**
 * FIRST SECTION HOTEL COUNT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function firstSectionHotelCount() {
  let value = 2

  if (window.innerWidth < 520) {
    value = 2
  } else if (window.innerWidth >= 520 && window.innerWidth < 772) {
    value = 4
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 4
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 6
  } else if (window.innerWidth >= 1280) {
    value = 6
  }

  return value
}

/**
 * SECOND SECTION HOTEL COUNT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function secondSectionHotelCount() {
  let value = 3

  if (window.innerWidth < 520) {
    value = 3
  } else if (window.innerWidth >= 520 && window.innerWidth < 772) {
    value = 6
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 6
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 9
  } else if (window.innerWidth >= 1280) {
    value = 9
  }

  return value
}

/**
 * RESPONSIVE HOTEL IMAGE HEIGHT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function responsiveHotelImageHeight() {
  let value = 240

  if (window.innerWidth < 520) {
    value = 240
  } else if (window.innerWidth >= 520 && window.innerWidth < 772) {
    value = 177
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 177
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 177
  } else if (window.innerWidth >= 1280) {
    value = 216
  }

  return value
}

/**
 * EGYEDI AJÁNLAT SZOLGÁLTATÁS NEVEK
 *
 * @returns {String}
 */
export function getServiceName(index) {
  const names = {
    0: window.$nuxt.$t('exclusive_offers.CloseToBeach'),
    1: window.$nuxt.$t('exclusive_offers.SightSeeing'),
    2: window.$nuxt.$t('exclusive_offers.Pool'),
    3: window.$nuxt.$t('exclusive_offers.Wellness'),
    4: window.$nuxt.$t('exclusive_offers.Country')
  }
  return names[index]
}

/**
 * HOTEL SERVICE NUM LIMIT
 * - Hotel page computed var
 *
 * @returns {Number}
 */
export function getServiceLimitNum() {
  let value = 11

  if (window.innerWidth < 520) {
    value = 7
  } else if (window.innerWidth >= 520 && window.innerWidth < 772) {
    value = 11
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 15
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 11
  } else if (window.innerWidth >= 1280) {
    value = 15
  }

  return value
}

/**
 * NEWS COUNT
 * - News results page computed var
 *
 * @returns {Number}
 */
export function newsCount() {
  let value = 2

  if (window.innerWidth < 520) {
    value = 2
  } else if (window.innerWidth >= 520 && window.innerWidth < 772) {
    value = 4
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 4
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 12
  } else if (window.innerWidth >= 1280) {
    value = 12
  }

  return value
}

/**
 * RESPONSIVE NEWS IMAGE HEIGHT
 * - News list  page computed var - The heights of the featured images
 *
 * @returns {Number}
 */
export function responsiveNewsImageHeight() {
  let value = 288

  if (window.innerWidth < 520) {
    value = 320
  } else if (window.innerWidth >= 520 && window.innerWidth <= 1024) {
    value = 236
  } else if (window.innerWidth > 1024) {
    value = 288
  }

  return value
}

/**
 * THEMATIC CATEGORY COUNT
 * - Thematic results page computed var
 *
 * @returns {Number}
 */
export function thematicCategoryCount() {
  let value = 2

  if (window.innerWidth < 772) {
    value = 4
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 6
  } else if (window.innerWidth >= 1024) {
    value = 8
  }

  return value
}

/**
 * THEMATIC COUNT
 * - thematic results page computed var
 *
 * @returns {Number}
 */
export function thematicCount() {
  let value = 4

  if (window.innerWidth < 520) {
    value = 4
  } else if (window.innerWidth >= 520 && window.innerWidth < 772) {
    value = 8
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 8
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 12
  } else if (window.innerWidth >= 1280) {
    value = 12
  }

  return value
}

/**
 * APARTMENTS COUNT
 * - thematic results page computed var
 *
 * @returns {Number}
 */
export function apartmentsCount() {
  let value = 4

  if (window.innerWidth < 520) {
    value = 8
  } else if (window.innerWidth >= 520 && window.innerWidth < 772) {
    value = 16
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 16
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 24
  } else if (window.innerWidth >= 1280) {
    value = 24
  }

  return value
}

/**
 * EXCLUSIVE COUNT
 * - esclusive results page computed var
 *
 * @returns {Number}
 */
export function exclusiveCount() {
  let value = 4

  if (window.innerWidth < 520) {
    value = 4
  } else if (window.innerWidth >= 520 && window.innerWidth < 772) {
    value = 8
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 8
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 12
  } else if (window.innerWidth >= 1280) {
    value = 12
  }

  return value
}

/**
 * RESPONSIVE THEMATIC IMAGE HEIGHT
 * - Thematic (category) page computed var
 *
 * @returns {Number}
 */
export function responsiveThematicImageHeight() {
  let value = 384

  if (window.innerWidth < 520) {
    value = 426
  } else if (window.innerWidth >= 520 && window.innerWidth < 1280) {
    value = 314
  } else if (window.innerWidth >= 1280) {
    value = 384
  }

  return value
}

/**
 * RESPONSIVE THEMATIC IMAGE HEIGHT
 * - Thematic (category) page computed var
 *
 * @returns {Number}
 */
export function responsiveApartmentImageHeight() {
  let value = 333

  if (window.innerWidth <= 352) {
    value = 180
  } else if (window.innerWidth > 352 && window.innerWidth <= 520) {
    value = 180
  } else if (window.innerWidth > 520 && window.innerWidth <= 772) {
    value = 275
  } else if (window.innerWidth > 772 && window.innerWidth <= 1024) {
    value = 416
  } else if (window.innerWidth > 1024 && window.innerWidth < 1280) {
    value = 275
  } else if (window.innerWidth >= 1280) {
    value = 333
  }

  return value
}

/**
 * RESPONSIVE HOME THEMATIC WIDGET IMAGE
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function responsiveWidgetThematicOfferHeight() {
  let value = 240

  if (window.innerWidth < 520) {
    value = 240
  } else if (window.innerWidth >= 520 && window.innerWidth < 772) {
    value = 177
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 271
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 177
  } else if (window.innerWidth >= 1280) {
    value = 216
  }

  return value
}

/**
 * LIMIT OBJECT BY
 * - Limits object count by amount
 *
 * @param {Object} obj
 * @param {Number} n
 *
 * @returns {Object}
 */
export function limitObjBy(obj, n) {
  return Object.keys(obj)
    .sort()
    .slice(0, n)
    .reduce(function(memo, current) {
      memo[current] = obj[current]
      return memo
    }, {})
}

/**
 * CAPITALIZE
 * - Makes all or only first letter capital
 *
 * @param {String} value
 * @param {Boolean} onlyFirstLetter
 */
export function capitalize(value, onlyFirstLetter = true) {
  if (!value && value !== 0) return ''
  if (onlyFirstLetter === true) {
    return (
      value
        .toString()
        .charAt(0)
        .toUpperCase() + value.toString().slice(1)
    )
  } else {
    value = value
      .toString()
      .toLowerCase()
      .split(' ')
    return value
      .map(function(item) {
        return item.charAt(0).toUpperCase() + item.slice(1)
      })
      .join(' ')
  }
}

/*
 * COUNT VALUES IN OBJECT
 */
export function groupBy(object, key) {
  const groupByFN = (objectArray, ...properties) => {
    return [
      ...Object.values(
        objectArray.reduce((accumulator, object) => {
          const key = JSON.stringify(properties.map((x) => object[x] || null))

          if (!accumulator[key]) {
            accumulator[key] = []
          }
          accumulator[key].push(object)
          return accumulator
        }, {})
      )
    ]
  }

  return groupByFN(object, key)
}

/**
 * LOWERCASE
 * - Converts a string to lowercase
 *
 * @param {String} value
 */
export function lowercase(value) {
  return value || value === 0 ? value.toString().toLowerCase() : ''
}

/**
 * TRUNCATE
 * - Truncate string at length
 *
 * @param {String} value
 * @param {Number} length
 */
export function truncate(value, length) {
  length = length || 30
  if (!value || typeof value !== 'string') return ''
  if (value.length <= length) return value
  return value.substring(0, length) + '...'
}

/**
 * LIMIT BY
 * - Limit filter for arrays
 *
 * @param {Number|Array} arr (If Number, decimal expected)
 * @param {Number} n
 * @param {Number} offset (Decimal expected)
 */
export function limitBy(arr, n, offset) {
  arr = isArray(arr) ? arr : convertRangeToArray(arr)

  offset = offset ? parseInt(offset, 10) : 0
  n = toNumber(n)
  return typeof n === 'number' ? arr.slice(offset, offset + n) : arr
}

/**
 * CONVERT RANGE TO ARRAY
 * - Generates array
 *
 * @param {Number} range
 */
export function convertRangeToArray(range) {
  return [...Array(range + 1).keys()].slice(1)
}

/**
 * IS ARRAY
 * - Checks if param is array
 *
 * @param {ANY} obj
 */
export function isArray(obj) {
  return Array.isArray(obj)
}

/**
 * TO NUMBER
 * - Creates a number from string
 *
 * @param {String} value
 */
export function toNumber(value) {
  if (typeof value !== 'string') {
    return value
  } else {
    const parsed = Number(value)
    return isNaN(parsed) ? value : parsed
  }
}

/**
 * TO ARRAY
 * - Casts a new array
 *
 * @param {Array} list
 * @param {Number} start
 */
export function toArray(list, start) {
  start = start || 0
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * ORDER BY
 * - Filter order for arrays
 *
 * @param {String|Array<String>|Function} ...sortKeys
 * @param {Number} [order]
 */

export function orderBy(arr) {
  let comparator = null
  let sortKeys
  arr = convertArray(arr)

  // determine order (last argument)
  let args = toArray(arguments, 1)
  let order = args[args.length - 1]
  if (typeof order === 'number') {
    order = order < 0 ? -1 : 1
    args = args.length > 1 ? args.slice(0, -1) : args
  } else {
    order = 1
  }

  // determine sortKeys & comparator
  const firstArg = args[0]
  if (!firstArg) {
    return arr
  } else if (typeof firstArg === 'function') {
    // custom comparator
    comparator = function(a, b) {
      return firstArg(a, b) * order
    }
  } else {
    // string keys. flatten first
    sortKeys = Array.prototype.concat.apply([], args)
    comparator = function(a, b, i) {
      i = i || 0
      return i >= sortKeys.length - 1
        ? baseCompare(a, b, i)
        : baseCompare(a, b, i) || comparator(a, b, i + 1)
    }
  }

  function baseCompare(a, b, sortKeyIndex) {
    const sortKey = sortKeys[sortKeyIndex]
    if (sortKey) {
      if (sortKey !== '$key') {
        if (isObject(a) && '$value' in a) a = a.$value
        if (isObject(b) && '$value' in b) b = b.$value
      }
      a = isObject(a) ? getPath(a, sortKey) : a
      b = isObject(b) ? getPath(b, sortKey) : b
      a = typeof a === 'string' ? a.toLowerCase() : a
      b = typeof b === 'string' ? b.toLowerCase() : b
    }
    return a === b ? 0 : a > b ? order : -order
  }

  // sort on a copy to avoid mutating original array
  return arr.slice().sort(comparator)
}

/**
 * CONVERT ARRAY
 * - Converts objects to arrays
 *
 * @param {Object} value
 */
export function convertArray(value) {
  if (isArray(value)) {
    return value
  } else if (isPlainObject(value)) {
    // convert plain object to array.
    const keys = Object.keys(value)
    let i = keys.length
    const res = new Array(i)
    let key
    while (i--) {
      key = keys[i]
      res[i] = {
        $key: key,
        $value: value[key]
      }
    }
    return res
  } else {
    return value || []
  }
}

/**
 * IS OBJECT
 *
 * @param {*} obj
 */
export function isObject(obj) {
  const type = typeof obj
  return type === 'function' || (type === 'object' && !!obj)
}

/**
 * IS PLAIN OBJECT
 *
 * @param {*} obj
 */
export function isPlainObject(obj) {
  return toString.call(obj) === '[object Object]'
}

/**
 * GET PATH
 *
 * @param {*} obj
 * @param {*} is
 */
export function getPath(obj, is) {
  // obj,'1.2.3' -> multiIndex(obj,['1','2','3'])
  return multiIndex(obj, is.split('.'))
}

/**
 * MULTI INDEX
 *
 * @param {*} obj
 * @param {*} is
 */
export function multiIndex(obj, is) {
  // obj,['1','2','3'] -> ((obj['1'])['2'])['3']
  return is.length ? multiIndex(obj[is[0]], is.slice(1)) : obj
}

/**
 * FILTER BY
 * - Filter arrays by prop
 *
 * @param {Array} arr
 * @param {String} prop
 * @param {Boolean} reversed
 * @param {String|Number} search *n
 */

export function filterBy(arr, search, reversed = false) {
  arr = convertArray(arr)
  if (search == null) {
    return arr
  }
  if (typeof search === 'function') {
    return arr.filter(search)
  }
  // cast to lowercase string
  search = ('' + search).toLowerCase()
  const n = 3
  // extract and flatten keys
  const keys = Array.prototype.concat.apply([], toArray(arguments, n))
  const res = []
  let item, key, val, j
  for (let i = 0, l = arr.length; i < l; i++) {
    item = arr[i]
    val = (item && item.$value) || item
    j = keys.length
    if (j) {
      while (j--) {
        key = keys[j]
        if (
          ((key === '$key' && contains(item.$key, search)) ||
            contains(getPath(val, key), search)) &&
          reversed === false
        ) {
          res.push(item)
          break
        } else if (
          !(
            (key === '$key' && contains(item.$key, search)) ||
            contains(getPath(val, key), search)
          ) &&
          reversed === true
        ) {
          res.push(item)
          break
        }
      }
    } else if (contains(item, search)) {
      res.push(item)
    }
  }
  return res
}

/**
 * CONTAINS
 * - Checks if it's in there somewhere
 *
 * @param {Object|Array|String} val
 * @param {String} search
 */
export function contains(val, search) {
  let i
  if (isPlainObject(val)) {
    const keys = Object.keys(val)
    i = keys.length
    while (i--) {
      if (contains(val[keys[i]], search)) {
        return true
      }
    }
  } else if (isArray(val)) {
    i = val.length
    while (i--) {
      if (contains(val[i], search)) {
        return true
      }
    }
  } else if (val != null) {
    return val
      .toString()
      .toLowerCase()
      .includes(search)
  }
}

/**
 * FIND
 * - Get first matching element from a filtered array
 *
 * @param {Array} arr
 * @param {String|Number} search
 * @returns {mixed}
 */
export function find(arr, search) {
  const array = filterBy.apply(this, arguments)
  array.splice(1)
  return array
}

/**
 * SECOND SECTION FLIGHT COUNT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function secondSectionFlightCount() {
  let value = 4

  if (window.innerWidth < 520) {
    value = 5
  }

  return value
}

/**
 * RESPONSIVE FLIGHT IMAGE HEIGHT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function responsiveFlightImageHeight() {
  let value = 162

  if (window.innerWidth < 520) {
    value = 327
  } else if (window.innerWidth >= 520 && window.innerWidth < 1024) {
    value = 267
  }

  return value
}

/**
 * RESPONSIVE FLIGHT IMAGE HEIGHT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function responsiveFlightOneWayImageHeight() {
  let value = 106

  if (window.innerWidth < 520) {
    value = 182
  } else if (window.innerWidth >= 520 && window.innerWidth < 1024) {
    value = 152
  }

  return value
}

/**
 * CALC HOTEL DISTANCE
 *
 * @param {Number} distance [km]
 */
export function calcHotelDistance(distance) {
  const distanceMeter = parseFloat(distance) * 1000
  let distanceString

  if (distanceMeter <= 1000) {
    distanceString = Math.round(distanceMeter / 10) * 10 + ' m'
  } else if (distanceMeter > 1000 && distanceMeter <= 10000) {
    distanceString = (distanceMeter / 1000).toFixed(1) + ' km'
  } else {
    distanceString = Math.round(distanceMeter / 1000) + ' km'
  }

  return distanceString
}

/**
 * RESPONSIVE TRANSFER IMAGE HEIGHT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function responsiveTransferImageHeight() {
  let value = 176
  if (
    (window.innerWidth >= 772 && window.innerWidth < 1024) ||
    window.innerWidth >= 1280
  ) {
    value = 103
  }
  return value
}

/**
 * RESPONSIVE TRANSFER IMAGE HEIGHT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function responsiveTransferFilterHeight() {
  let value = 189
  if (window.innerWidth >= 520 && window.innerWidth < 1024) {
    value = 97
  } else if (window.innerWidth >= 1024) {
    value = 103
  }
  return value
}

/**
 * RESPONSIVE CAR RENTAL IMAGE HEIGHT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function responsiveCarRentalFilterHeight() {
  let value = 347
  if (window.innerWidth >= 520 && window.innerWidth < 1024) {
    value = 214
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 162
  } else if (window.innerWidth >= 1280) {
    value = 111
  }
  return value
}

/**
 * CAR RENTAL SECTION COUNT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function sectionCarRentalCount() {
  let value = 10

  if (
    (window.innerWidth >= 520 && window.innerWidth < 1024) ||
    window.innerWidth >= 1280
  ) {
    value = 9
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 7
  }

  return value
}

/**
 * UPDATE ARRAY OF OBJECTS
 * - Nem túl elegáns
 *
 * @param {*} array
 * @param {*} propName
 * @param {*} propMatch
 * @param {*} newPropName
 * @param {*} newValue
 */
export function updateArrayOfObjects(
  array,
  propName,
  propMatch,
  newPropName,
  newValue
) {
  if (isArray(array)) {
    return array.map((item) => {
      if (item[propName] === propMatch) {
        const newItem = {}
        newItem[newPropName] = newValue
        return { ...item, ...newItem }
      } else {
        return item
      }
    })
  }
}

/**
 * GET BOARD NAME
 * - Get hotel board name from supply
 *
 * @param {Number} supply
 */
export function getBoardName(supply) {
  switch (parseInt(supply)) {
    case 90:
      return 'Room only'
    case 10:
      return 'Room only'
    case 20:
      return 'Breakfast only'
    case 30:
      return 'Half board'
    case 40:
      return 'Full board'
    case 50:
      return 'All inclusive'
    case 60:
      return 'Dinner only'
  }
}

/**
 * RESPONSIVE Program IMAGE HEIGHT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function responsiveProgramFilterHeight() {
  let value = 436
  if (window.innerWidth >= 520 && window.innerWidth < 1024) {
    value = 233
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 160
  } else if (window.innerWidth >= 1280) {
    value = 111
  }
  return value
}

/**
 * Program SECTION COUNT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function sectionProgramCount() {
  let value = 10
  if (window.innerWidth >= 1024) {
    value = 15
  }
  return value
}

/**
 * RESPONSIVE ROUND TRIP IMAGE HEIGHT
 * - Search results page computed var
 *
 * @returns {Number}
 */
export function responsiveRoundTripFilterHeight() {
  let value = 430
  if (window.innerWidth >= 520 && window.innerWidth < 1024) {
    value = 233
  } else if (window.innerWidth >= 1024) {
    value = 160
  }
  return value
}

/**
 * CONVERT MINUTES TO HOURS MINUTES
 * - Convert minutes to hours and minutes (hh:mm)
 *
 * @returns {STRING}
 */
export function convertMinutesToHoursMinutes(minutes) {
  const hh = Math.floor(minutes / 60)
  const mm = minutes % 60
  return ('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2)
}

/**
 * AVERAGE GEOLOCATION
 *
 * @param {Array} coords
 *
 * Calculate the center/average of multiple GeoLocation coordinates
 * Expects an array of objects with .latitude and .longitude properties
 */
export function averageGeolocation(coords) {
  if (coords.length === 1) {
    return coords[0]
  }

  let x = 0.0
  let y = 0.0
  let z = 0.0

  for (const coord of coords) {
    const latitude = (coord.latitude * Math.PI) / 180
    const longitude = (coord.longitude * Math.PI) / 180

    x += Math.cos(latitude) * Math.cos(longitude)
    y += Math.cos(latitude) * Math.sin(longitude)
    z += Math.sin(latitude)
  }

  const total = coords.length

  x = x / total
  y = y / total
  z = z / total

  const centralLongitude = Math.atan2(y, x)
  const centralSquareRoot = Math.sqrt(x * x + y * y)
  const centralLatitude = Math.atan2(z, centralSquareRoot)

  return {
    lat: (centralLatitude * 180) / Math.PI,
    lng: (centralLongitude * 180) / Math.PI
  }
}

/**
 * GET LANGUAGE NAME
 * - used by roundtrip
 * - user by language select in navbar
 *
 * @param {String} code
 */
export function getLanguageName(code) {
  if (window === undefined) {
    return
  }

  switch (code.toLowerCase()) {
    case 'en':
      return window.$nuxt.$t('general.LangEn')
    case 'hu':
      return window.$nuxt.$t('general.LangHu')
    case 'cz':
      return window.$nuxt.$t('general.LangCz')
    case 'cs':
      return window.$nuxt.$t('general.LangCz')
    case 'sk':
      return window.$nuxt.$t('general.LangSk')
    case 'ro':
      return window.$nuxt.$t('general.LangRo')
    case 'ru':
      return window.$nuxt.$t('general.LangRu')
    case 'es':
      return window.$nuxt.$t('general.LangEs')
    case 'fr':
      return window.$nuxt.$t('general.LangFr')
    case 'it':
      return window.$nuxt.$t('general.LangIt')
    case 'da':
      return window.$nuxt.$t('general.LangDa')
    case 'de':
      return window.$nuxt.$t('general.LangDe')
    case 'sv':
      return window.$nuxt.$t('general.LangSv')
    case 'pt':
      return window.$nuxt.$t('general.LangPt')
    case 'pl':
      return window.$nuxt.$t('general.LangPl')
    case 'tr':
      return window.$nuxt.$t('general.LangTr')
    default:
      return code
  }
}

/**
 * CALC WEEK
 * - week number calculator
 *
 * @param days
 */
export function calculateWeek(days) {
  const weeks = parseInt(days / 7)
  days = days - weeks * 7
  return (
    (weeks > 0
      ? weeks +
        ' ' +
        (weeks > 1
          ? window.$nuxt.$t('general.Weeks')
          : window.$nuxt.$t('general.Week')) +
        (days > 0 ? ', ' : '')
      : '') +
    (days > 0
      ? days +
        ' ' +
        (days > 1
          ? window.$nuxt.$t('general.Days')
          : window.$nuxt.$t('general.Day'))
      : '')
  )
}

/**
 * FORMAT PRICE
 * - used by weboffice
 *
 * @param num
 */
export function formatPrice(num) {
  num = Math.round(num * 100) / 100
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

/**
 * WEBOFFICE TABLE LIMIT
 * - Table rows per page limit
 *
 * @returns {Number}
 */
export function getPerPageLimit() {
  let value = 25

  if (window.innerWidth < 520) {
    value = 10
  } else if (window.innerWidth >= 520 && window.innerWidth < 772) {
    value = 10
  } else if (window.innerWidth >= 772 && window.innerWidth < 1024) {
    value = 10
  } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    value = 15
  } else if (window.innerWidth >= 1280) {
    value = 25
  }

  return value
}

/**
 * CALC REMAINING TIME
 * - used by weboffice
 *
 * @param date
 */
export function calcRemainingTime(date, onlyHourAndMinutes = false) {
  if (window === undefined) {
    return
  }
  let today = new Date()
  // kukás iPhone nem képes dátum függvényt kezelni
  if (typeof date.split !== 'undefined') {
    const arr = date.split(/[- :]/)
    date = new Date(
      arr[0],
      arr[1] - 1,
      arr[2],
      arr[3] !== undefined ? arr[3] : 0,
      arr[4] !== undefined ? arr[4] : 0,
      arr[5] !== undefined ? arr[5] : 0
    )
  } else {
    date = new Date(date)
  }
  if (date.getFullYear() === 9999) {
    return window.$nuxt.$t('general.UnlimitedPeriod')
  }
  const message = []
  let temp
  temp = differenceInYears(date, today)
  if (date < today) {
    return false
  }
  if (!onlyHourAndMinutes) {
    if (temp > 0) {
      message.push(temp + ' ' + window.$nuxt.$t('general.Year'))
    }
    today = addYears(today, temp)
    temp = differenceInMonths(date, today)
    if (temp > 0) {
      message.push(temp + ' ' + window.$nuxt.$t('general.Month'))
    }
    today = addMonths(today, temp)
    temp = differenceInDays(date, today)
    if (temp > 0) {
      message.push(temp + ' ' + window.$nuxt.$t('general.Day'))
    }
    today = addDays(today, temp)
  }

  temp = differenceInHours(date, today)
  if (temp > 0) {
    message.push(temp + ' ' + window.$nuxt.$t('general.Hour'))
  }
  today = addHours(today, temp)
  temp = differenceInMinutes(date, today)
  if (temp > 0) {
    message.push(temp + ' ' + window.$nuxt.$t('general.Minute'))
  }
  if (message.length === 0) {
    return (
      '0 ' +
      window.$nuxt.$t('general.Day') +
      ' 0 ' +
      window.$nuxt.$t('general.Hour') +
      ' 0 ' +
      window.$nuxt.$t('general.Minute')
    )
  } else {
    return message.slice(0, 3).join(' ')
  }
}

/**
 * CALC REMAINING HOUR MINUTE SECOND
 * - used by weboffice
 *
 * @param date
 */
export function calcRemainingHourMinuteSecond(date) {
  if (window === undefined) {
    return
  }
  let today = new Date()
  date = new Date(date)
  const message = []
  let temp
  temp = differenceInHours(date, today)
  if (date < today) {
    return false
  }
  if (temp >= 0) {
    message.push((temp < 10 ? '0' + temp : temp) + ':')
  }
  today = addHours(today, temp)
  temp = differenceInMinutes(date, today)
  if (temp >= 0) {
    message.push((temp < 10 ? '0' + temp : temp) + ':')
  }
  today = addMinutes(today, temp)
  temp = differenceInSeconds(date, today)
  if (temp >= 0) {
    message.push(temp < 10 ? '0' + temp : temp)
  }
  if (message.length === 0) {
    return '00:00:00'
  } else {
    return message.join('')
  }
}

/**
 * FORMAT POINT
 * - used by weboffice
 *
 * @param num
 */
export function formatPoint(num) {
  num = Math.round(num * 100) / 100
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}

/**
 * GET MONTH NAME
 * - localized month name
 *
 * @param monthNum
 */
export function getMonthName(monthNum) {
  if (window === undefined) {
    return
  }

  switch (parseInt(monthNum)) {
    case 1:
      return window.$nuxt.$t('general.January')
    case 2:
      return window.$nuxt.$t('general.February')
    case 3:
      return window.$nuxt.$t('general.March')
    case 4:
      return window.$nuxt.$t('general.April')
    case 5:
      return window.$nuxt.$t('general.May')
    case 6:
      return window.$nuxt.$t('general.June')
    case 7:
      return window.$nuxt.$t('general.July')
    case 8:
      return window.$nuxt.$t('general.August')
    case 9:
      return window.$nuxt.$t('general.September')
    case 10:
      return window.$nuxt.$t('general.October')
    case 11:
      return window.$nuxt.$t('general.November')
    case 12:
      return window.$nuxt.$t('general.December')
    default:
      return monthNum
  }
}

/**
 * GET USER LEVEL NAME
 * - used by weboffice
 *
 * @param {String} level
 */
export function getUserLevelName(level) {
  if (window === undefined) {
    return
  }

  switch (level) {
    case 'FRONT3':
      return window.$nuxt.$t('general.LevelFront3')
    case 'EC':
      return window.$nuxt.$t('general.LevelEc')
    case 'DEC':
      return window.$nuxt.$t('general.LevelDec')
    case 'GOLD':
      return window.$nuxt.$t('general.LevelGold')
    case 'FOUNDERGOLD':
      return window.$nuxt.$t('general.LevelFounderGold')
    case 'PLATINUM':
      return window.$nuxt.$t('general.LevelPlatinum')
    case 'FOUNDERPLATINUM':
      return window.$nuxt.$t('general.LevelFounderPlatinum')
    case 'EMERALD':
      return window.$nuxt.$t('general.LevelEmerald')
    case 'FOUNDEREMERALD':
      return window.$nuxt.$t('general.LevelFounderEmerald')
    case 'DIAMOND':
      return window.$nuxt.$t('general.LevelDiamond')
    case 'ZERO':
      return window.$nuxt.$t('general.BeginnerDistributor')
    case 'FREE':
      return window.$nuxt.$t('weboffice.FreeUser')
    case 'USER':
      return window.$nuxt.$t('general.FirefliesUser')
    default:
      return level
  }
}

/**
 * GET STATUS NAME
 * - used by weboffice
 *
 * @param {String} status
 */
export function getStatusName(status) {
  if (window === undefined) {
    return
  }

  switch (status.toLowerCase()) {
    case 'pending':
      return window.$nuxt.$t('weboffice.StatusPending')
    case 'active':
      return window.$nuxt.$t('weboffice.StatusActive')
    case 'none':
      return window.$nuxt.$t('weboffice.StatusNone')
    default:
      return status
  }
}

/**
 * GET BONUS TYPE NAME
 * - used by weboffice
 *
 * @param {String} bonusType
 */
export function getBonusTypeName(bonusType) {
  if (window === undefined) {
    return
  }
  switch (bonusType) {
    case 'DIRECT':
      return window.$nuxt.$t('weboffice.BonusTypeDirect')
    case 'DIRECTFLIGHT':
      return window.$nuxt.$t('weboffice.BonusTypeDirectFlight')
    case 'DEPTH':
      return window.$nuxt.$t('weboffice.BonusTypeDepth')
    case 'MATRIX':
      return window.$nuxt.$t('weboffice.BonusTypeMatrix')
    case 'GENERATION':
      return window.$nuxt.$t('weboffice.BonusTypeGeneration')
    case 'MIGRATION':
      return window.$nuxt.$t('weboffice.BonusTypeMigration')
    case 'EXTRADEPTH':
      return window.$nuxt.$t('weboffice.BonusTypeExtraDepth')
    case 'LEADERDEPTH':
      return window.$nuxt.$t('weboffice.BonusTypeLeaderDepth')
    case 'LOYALTYCYCLE':
      return window.$nuxt.$t('weboffice.BonusTypeLoyaltyCycle')
    case 'LOYALTYCYCLEBPO':
      return window.$nuxt.$t('weboffice.BonusTypeLoyaltyCycleBPO')
    case 'LOYALTYVIPCYCLEBONUS':
      return window.$nuxt.$t('weboffice.BonusTypeLoyaltyVipCycle')
    case 'CISCOMMISSIONS':
      return window.$nuxt.$t('weboffice.BonusTypeCisCommissions')
    case 'CAR':
      return window.$nuxt.$t('weboffice.BonusTypeCar')
    case 'BPO':
      return window.$nuxt.$t('weboffice.BonusTypeBpo')
    case 'MATCHING':
      return window.$nuxt.$t('weboffice.BonusTypeMatching')
    case 'CAPITALPAID':
      return window.$nuxt.$t('weboffice.CapitalBonus')
    case 'POOL':
      return window.$nuxt.$t('weboffice.VipLeaderBonus')
    case 'PPLB':
      return window.$nuxt.$t('weboffice.PassivePowerlineBonus')
    default:
      return bonusType
  }
}

/**
 * GET GUESTS TEXT
 * - guest number formatted
 *
 * @param {String} adults
 * @param {String} children
 */
export function getGuestText(adults, children) {
  if (window === undefined) {
    return
  }

  const text = []
  if (adults > 0) {
    text.push(
      adults +
        ' ' +
        (adults > 1
          ? window.$nuxt.$t('general.Adults')
          : window.$nuxt.$t('general.Adult'))
    )
  }
  if (children > 0) {
    text.push(
      children +
        ' ' +
        (children > 1
          ? window.$nuxt.$t('general.Children')
          : window.$nuxt.$t('general.Child'))
    )
  }
  return text.join(', ')
}

/**
 * GET USER LEVEL COLOR
 * - used by weboffice
 *
 * @param {String} level
 */
export function getUserLevelColor(level) {
  switch (level) {
    case 'FRONT3':
    case 'EC':
    case 'DEC':
    case 'ZERO':
    case 'FREE':
    case 'USER':
      return 'grey-dark'
    case 'GOLD':
    case 'FOUNDERGOLD':
      return 'gold'
    case 'PLATINUM':
    case 'FOUNDERPLATINUM':
      return 'platinum'
    case 'EMERALD':
    case 'FOUNDEREMERALD':
      return 'green'
    case 'DIAMOND':
      return 'diamond'
    default:
      return level
  }
}

export function bonusTypeSorting(bonuses) {
  const orderArray = [
    'DIRECT',
    'DEPTH',
    'GENERATION',
    'LEADERDEPTH',
    'LOYALTYCYCLE',
    'LOYALTYVIPCYCLEBONUS',
    'LOYALTYCYCLEBPO',
    'POOL',
    'PPLB',
    'CISCOMMISSIONS'
  ]
  const response = []
  orderArray.forEach((key) => {
    if (bonuses[key] !== undefined) {
      bonuses[key].bonustType = key
      response.push(bonuses[key])
    }
  })
  return response
}

/**
 * GET DAY OF WEEK NAME
 * - localized day name
 *
 * @param dayNum
 */
export function getDayOfWeekName(dayNum) {
  if (window === undefined) {
    return
  }

  switch (parseInt(dayNum)) {
    case 1:
      return window.$nuxt.$t('general.Monday')
    case 2:
      return window.$nuxt.$t('general.Tuesday')
    case 3:
      return window.$nuxt.$t('general.Wednesday')
    case 4:
      return window.$nuxt.$t('general.Thursday')
    case 5:
      return window.$nuxt.$t('general.Friday')
    case 6:
      return window.$nuxt.$t('general.Saturday')
    case 7:
      return window.$nuxt.$t('general.Sunday')
    default:
      return dayNum
  }
}

/**
 * GET VOUCHER STATE NAME
 * - used by weboffice
 *
 * @param {String} stateName
 */
export function getVoucherStateName(stateName) {
  if (window === undefined) {
    return
  }
  switch (stateName) {
    case 'EXCHANGED':
      return window.$nuxt.$t('weboffice.StateExchanged')
    case 'NEW':
      return window.$nuxt.$t('weboffice.StateAvailable')
    case 'ADDED_TO_PAYMENT':
      return window.$nuxt.$t('weboffice.StateAddedToPayment')
    case 'USED':
      return window.$nuxt.$t('weboffice.StateUsed')
    case 'GIFTED_WAITING':
      return window.$nuxt.$t('weboffice.StateGiftWaiting')
    case 'GIFTED_ACCEPTED':
      return window.$nuxt.$t('weboffice.StateGIftAccepted')
    case 'GOT_WAITING':
      return window.$nuxt.$t('weboffice.StateGIftGotWaiting')
    default:
      return stateName
  }
}

/**
 * IS EMAIL
 * - Chhecks if string is email
 *
 * @param {String} email
 * @returns {Boolean}
 */
export function isEmail(email) {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    return true
  }
  return false
}

/**
 * NUMBER FORMAT
 * - return a formatted number string
 *
 * @param {Number} value
 * @param {String} format
 * @param {Object} options
 * @returns {String}
 */
export function numberFormat(value, format, options) {
  const regex = /([+|-])?([0-9|,]+)?([.|0-9]+)?([a\s]+)?/
  const regexSeparator = /(\d+)(\d{3})/
  const matches = format ? format.match(regex) : ['', '', '', '', '']
  const float = matches[3]
  const decimals = float ? float.match(/0/g).length : 0
  const config = {
    sign: matches[1] || '',
    base: matches[2] || '',
    decimals,
    unit: matches[4] || ''
  }
  const number = {
    float: Math.abs(parseFloat(value)),
    int: Math.abs(parseInt(value)),
    sign: Math.sign(value) < 0 ? '-' : ''
  }
  const thousandsSeparator =
    options.thousandsSeparator != null ? options.thousandsSeparator : ','
  const decimalSeparator =
    options.decimalSeparator != null ? options.decimalSeparator : '.'
  config.sign = config.sign || number.sign

  if (config.unit) {
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    const si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' }
    ]

    let i
    for (i = si.length - 1; i > 0; i--) {
      if (number.float >= si[i].value) {
        break
      }
    }

    number.float = (number.float / si[i].value)
      .toFixed(config.decimals)
      .replace(rx, '$1')
    const numberWithUnit = number.float + config.unit.replace('a', si[i].symbol)
    return config.sign + numberWithUnit
  }

  let int =
    config.decimals === 0
      ? (+(Math.round(+(number.float + 'e' + 0)) + 'e' + -0)).toFixed(0)
      : number.int
  let string = ''
  let x = ''
  let x1 = ''
  let x2 = ''
  switch (config.base + '') {
    case '':
      int = ''
      break
    case '0,0':
      string = int.toString()
      x = string.split('.')
      x1 = x[0]
      x2 = x.length > 1 ? '.' + x[1] : ''
      while (regexSeparator.test(x1)) {
        x1 = x1.replace(regexSeparator, '$1' + thousandsSeparator + '$2')
      }
      int = x1 + x2
      break
  }
  const fractionTmp = (+(
    Math.round(+(number.float + 'e' + config.decimals)) +
    'e' +
    -config.decimals
  ))
    .toFixed(config.decimals)
    .toString()
    .split('.')[1]
  const fraction = fractionTmp ? decimalSeparator + fractionTmp : ''

  return config.sign + int + fraction
}

/**
 * IS PHONE NUMBER
 * - Checks if string is phone number
 *
 * @param {String} phoneNumber
 * @returns {Boolean}
 */
export function isPhoneNumber(phoneNumber) {
  if (phoneNumber.replace(/\s/g, '').length > 20) {
    return false
  }

  if (/[^0-9+ ]+/.test(phoneNumber)) {
    return false
  }

  return true
}

/**
 * GET HANDLING FEE
 * - Return commission price
 *
 * @param {Number} price
 * @param {String} type
 * @returns {Number}
 */
export function getHandlingFee(price, type) {
  let handlingFee = 0
  if (type === 'mlm') {
    handlingFee = price * 0.04127
  } else if (type === 'hotel') {
    handlingFee = price * 0.0185
  } else if (type === 'flight') {
    handlingFee = price * 0.030928
  } else if (type === 'roundtrip') {
    handlingFee = price * 0.0142
  }
  return Math.round(handlingFee * 100) / 100
}

/**
 * CONVERT STRING TO PASCAL CASE
 * - Return pascal case string
 *
 * @param {String} text
 * @returns {String} pascal cased text
 */
export function toPascalCase(text) {
  const words = text.match(/[a-z]+/gi)
  if (!words) return ''
  return words
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    })
    .join('')
}

/**
 * GET PRODUCT NAME
 *
 * @param {String} productCode
 */
export function getProductName(productCode) {
  if (window === undefined || productCode === undefined) {
    return
  }

  switch (productCode.toLowerCase()) {
    case 'entry_fee':
      return window.$nuxt.$t('weboffice.Product_entry_fee')
    case 'entry_fee_plus_start_set':
      return window.$nuxt.$t('weboffice.Product_entry_fee_plus_start_set')
    case 'startset':
      return window.$nuxt.$t('weboffice.Product_startset')
    case 'voucher':
      return window.$nuxt.$t('weboffice.Product_voucher')
    case 'new_voucher':
      return window.$nuxt.$t('weboffice.Product_new_voucher')
    case 'challenge_voucher':
      return window.$nuxt.$t('weboffice.Product_challenge_voucher')
    case 'basic_package':
      return window.$nuxt.$t('weboffice.Product_basic_package')
    case 'smart_package':
      return window.$nuxt.$t('weboffice.Product_smart_package')
    case 'life_package':
      return window.$nuxt.$t('weboffice.Product_life_package')
    case 'portal_use':
      return window.$nuxt.$t('weboffice.Product_portal_use')
    case 'basic_upgrade_life':
      return window.$nuxt.$t('weboffice.Product_basic_upgrade_life')
    case 'smart_upgrade_life':
      return window.$nuxt.$t('weboffice.Product_smart_upgrade_life')
    case 'business_upgrade_life':
      return window.$nuxt.$t('weboffice.Product_business_upgrade_life')
    case 'life_upgrade_business':
      return window.$nuxt.$t('weboffice.Product_life_upgrade_business')
    case 'weboffice_entry_fee':
      return window.$nuxt.$t('weboffice.Product_weboffice_entry_fee')
    case 'loyal_product1_title':
      return window.$nuxt.$t('weboffice.Product_loyal_product1_title')
    case 'loyal_product2_title':
      return window.$nuxt.$t('weboffice.Product_loyal_product2_title')
    case 'loyal_product3_title':
      return window.$nuxt.$t('weboffice.Product_loyal_product3_title')
    case 'step_package_1':
      return window.$nuxt.$t('weboffice.Product_step_package_1')
    case 'step_package_2':
      return window.$nuxt.$t('weboffice.Product_step_package_2')
    case 'step_package_3':
      return window.$nuxt.$t('weboffice.Product_step_package_3')
    case 'loyal_product4_title':
      return window.$nuxt.$t('weboffice.Product_loyal_product4_title')
    case 'life_upgrade_dynamic':
      return window.$nuxt.$t('weboffice.Product_life_upgrade_dynamic')
    case 'loyal_one_title':
      return window.$nuxt.$t('weboffice.Product_loyal_one_title')
    case 'loyal_trio_title':
      return window.$nuxt.$t('weboffice.Product_loyal_trio_title')
    case 'loyalty_step_1_title':
      return window.$nuxt.$t('weboffice.Product_loyalty_step_1_title')
    case 'loyalty_step_2_title':
      return window.$nuxt.$t('weboffice.Product_loyalty_step_2_title')
    case 'loyalty_step_3_title':
      return window.$nuxt.$t('weboffice.Product_loyalty_step_3_title')
    case 'step_package_1_v2':
      return window.$nuxt.$t('weboffice.Product_step_package_1_v2')
    case 'step_package_2_v2':
      return window.$nuxt.$t('weboffice.Product_step_package_2_v2')
    case 'step_package_3_v2':
      return window.$nuxt.$t('weboffice.Product_step_package_3_v2')
    case 'loyalty_step_1_title_v2':
      return window.$nuxt.$t('weboffice.Product_loyalty_step_1_title_v2')
    case 'loyalty_step_2_title_v2':
      return window.$nuxt.$t('weboffice.Product_loyalty_step_2_title_v2')
    case 'loyalty_step_3_title_v2':
      return window.$nuxt.$t('weboffice.Product_loyalty_step_3_title_v2')
    case 'portal_use_bpo':
      return window.$nuxt.$t('weboffice.Product_portal_use_bpo')
    case 'portal_only_use_bpo':
      return window.$nuxt.$t('weboffice.Product_portal_only_use_bpo')
    case 'loyal_vip_title':
      return window.$nuxt.$t('weboffice.Product_loyal_vip_title')
    case 'small_step_product_title':
      return window.$nuxt.$t('weboffice.Product_small_step_product_title')
    case 'big_step_product_title':
      return window.$nuxt.$t('weboffice.Product_big_step_product_title')
    case 'loyalty_vip':
      return window.$nuxt.$t('weboffice.Product_loyalty_vip')
    case 'step_product1':
      return window.$nuxt.$t('weboffice.Product_step_product1')
    case 'step_product2':
      return window.$nuxt.$t('weboffice.Product_step_product2')
    case 'step_product3':
      return window.$nuxt.$t('weboffice.Product_step_product3')
    case 'loyalty_pro':
      return window.$nuxt.$t('weboffice.Product_loyalty_pro')
    case 'loyalty_step_1':
      return window.$nuxt.$t('weboffice.Product_loyalty_step_1_title')
    case 'loyalty_step_2':
      return window.$nuxt.$t('weboffice.Product_loyalty_step_2_title')
    case 'loyalty_step_3':
      return window.$nuxt.$t('weboffice.Product_loyalty_step_3_title')
    case 'travel':
      return window.$nuxt.$t('weboffice.Product_travel')
    case 'loyalty_standard':
      return window.$nuxt.$t('weboffice.Product_loyalty_standard')
    case 'loyalty_plus':
      return window.$nuxt.$t('weboffice.Product_loyalty_plus')
    case 'loyalty_auto_big':
      return window.$nuxt.$t('weboffice.Product_loyalty_auto_big')
    case 'car_rent':
      return window.$nuxt.$t('weboffice.Product_car_rent')
    case 'loyal_vip_title_upgrade':
      return window.$nuxt.$t('weboffice.Product_loyalty_vip_upgrade')
    case 'loyalty_vip_upgrade':
      return window.$nuxt.$t('weboffice.Product_loyalty_vip_upgrade')
    case 'discount_pass':
      return window.$nuxt.$t('weboffice.DiscountPass')
    case 'vip_step_1':
      return window.$nuxt.$t('weboffice.vipStep1')
    case 'vip_step_2':
      return window.$nuxt.$t('weboffice.vipStep2')
    case 'vip_step_3':
      return window.$nuxt.$t('weboffice.vipStep3')
    case 'vip_step_4':
      return window.$nuxt.$t('weboffice.vipStep4')
    case 'vip_step_5':
      return window.$nuxt.$t('weboffice.vipStep5')
    case 'connexvoucher_title':
      return window.$nuxt.$t('weboffice.ConnexProductTitle')
    case 'connex':
      return window.$nuxt.$t('weboffice.ConnexProductTitle')
    case 'exclusive_report_title':
      return window.$nuxt.$t('weboffice.ArriviaProductTitle')
    default:
      return productCode
  }
}

/**
 * GET INVOICE CATEGORY NAME
 *
 * @param {String} categoryCode
 */
export function getInvoiceCategoryName(categoryCode) {
  if (window === undefined || categoryCode === undefined) {
    return
  }

  switch (categoryCode.toUpperCase()) {
    case 'CORRECTION_PDF':
      return window.$nuxt.$t('weboffice.TransactionTypeCorrectionPdf')
    case 'PAYMENT':
      return window.$nuxt.$t('weboffice.Invoice')
    case 'TRAVELCARD_DEBIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeTravelCardDebitNote')
    case 'VOUCHER_DEBIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeVoucherDebitNote')
    case 'COUPON_DEBIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeCouponDebitNote')
    case 'PAYMENT_CREDIT_NOTE':
      return window.$nuxt.$t('weboffice.PaymentCreditNote')
    case 'TRAVELCARD_CREDIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeTravelCardCreditNote')
    case 'VOUCHER_CREDIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeVoucherCreditNote')
    case 'COUPON_CREDIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeCouponCreditNote')
    case 'DIAMOND_VOUCHER_CREDIT_NOTE':
      return window.$nuxt.$t('weboffice.DiamondVoucherCreditNote')
    case 'DIAMOND_VOUCHER_DEBIT_NOTE':
      return window.$nuxt.$t('weboffice.DiamondVoucherDebitNote')
    case 'COMMISSION_DEBIT_NOTE':
      return window.$nuxt.$t(
        'weboffice.TransactionTypeCommissionDebitNoteDebit'
      )
    case 'COMMISSION_CREDIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeCommissionDebitNote')
    case 'BPO_CREDIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeBpoCreditNote')
    case 'BPO_DEBIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeBpoDebitNote')
    case 'BPO_OLD_CREDIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeBpoOldCreditNote')
    case 'BPO_OLD_DEBIT_NOTE':
      return window.$nuxt.$t('weboffice.TransactionTypeBpoOldDebitNote')
    default:
      return categoryCode
  }
}

export function getCountrySelectDatas() {
  const countrySelect = []
  const countrySelectIds = []
  const countrySelectCodes = []
  if (
    CountryList.countryCodesFullName !== undefined &&
    CountryList.countryIdFullName !== undefined
  ) {
    for (const [key, value] of Object.entries(CountryList.countryIdFullName)) {
      countrySelect.push(CountryList.countryCodesFullName[value])
      countrySelectIds.push(key)
      countrySelectCodes.push(value)
    }
  }
  return { countrySelect, countrySelectIds, countrySelectCodes }
}

export function createDate(string) {
  string = string.split(/[- :]/)
  return new Date(
    string[0],
    string[1] - 1,
    string[2],
    string[3] !== undefined ? string[3] : 0,
    string[4] !== undefined ? string[4] : 0,
    string[5] !== undefined ? string[5] : 0
  )
}

export function addDay(date, days) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  )
}

export function decodeHtml(html) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

export function shuffle(array) {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ]
  }

  return array
}
