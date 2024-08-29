export function getCarSpecification(carRental) {
  if (window === undefined) {
    return
  }
  const carSpecification = []
  if (carRental.passengers) {
    carSpecification.push({
      icon: 'fas fa-user-alt',
      name: carRental.passengers + ' ' + window.$nuxt.$t('carrent.Passengers'),
      altText:
        window.$nuxt.$t('carrent.Capacity') +
        ': ' +
        carRental.passengers +
        ' ' +
        window.$nuxt.$t('carrent.Passengers'),
      extraClass: 'text-black'
    })
  }
  if (carRental.baggage) {
    carSpecification.push({
      icon: 'fas fa-suitcase',
      name: carRental.baggage + ' ' + window.$nuxt.$t('carrent.Baggage'),
      altText:
        window.$nuxt.$t('carrent.Baggages') +
        ': ' +
        carRental.baggage +
        ' ' +
        window.$nuxt.$t('carrent.Baggage'),
      extraClass: 'text-black'
    })
  }
  if (carRental.aircondition === 'true') {
    carSpecification.push({
      icon: 'fas fa-snowflake',
      name: window.$nuxt.$t('carrent.Climate'),
      altText:
        window.$nuxt.$t('carrent.Aircondition') +
        ': ' +
        window.$nuxt.$t('carrent.Climate'),
      extraClass: ''
    })
  }
  if (carRental.transmission) {
    carSpecification.push({
      icon: 'fas fa-cogs',
      name: carRental.transmission,
      altText:
        window.$nuxt.$t('carrent.Transmission') + ': ' + carRental.transmission,
      extraClass: ''
    })
  }
  if (carRental.distance_max) {
    if (carRental.distance_max !== '0') {
      carSpecification.push({
        icon: 'fas fa-road',
        name:
          carRental.distance_max === '-1'
            ? window.$nuxt.$t('carrent.UnlimitedKM')
            : carRental.distance_max + ' ' + carRental.distance_unit,
        altText:
          'KM: ' +
          (carRental.distance_max === '-1'
            ? window.$nuxt.$t('carrent.UnlimitedKM')
            : carRental.distance_max + ' ' + carRental.distance_unit),
        extraClass: ''
      })
    }
  }
  if (carRental.doorcount) {
    carSpecification.push({
      icon: 'fas fa-car-side',
      name: carRental.doorcount + ' ' + window.$nuxt.$t('carrent.Door'),
      altText:
        window.$nuxt.$t('carrent.DoorCount') +
        ': ' +
        carRental.doorcount +
        ' ' +
        window.$nuxt.$t('carrent.Door'),
      extraClass: ''
    })
  }
  return carSpecification
}
