<template>
  <main class="flex-grow">
    <div class="max-w-screen-xl mx-auto m-32">
      <h2 class="font-bold p-16">Hotel search - Hero</h2>
      <div class="search-bg w-full text-white z-10">
        <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
          <div class="flex flex-col lg:flex-row">
            <div class="lg:w-5/12 lg:pr-1 xl:w-7/12">
              <InputHotelNamesearch
                v-model="nameSearch"
                :is-dark="true"
                :label="'Szállodák keresése'"
              >
              </InputHotelNamesearch>
            </div>
            <div class="flex flex-col sm:flex-row lg:w-7/12 xl:w-5/12">
              <InputDateRange
                v-model="dates"
                :is-dark="true"
                :label-checkin="'Bejelentkezés'"
                :label-checkout="'Kijelentkezés'"
                class="flex flex-row mt-8 sm:w-1/2 md:w-4/12 lg:mt-0 lg:w-5/12"
                :input-style="['lg:border-r-0 lg:-mr-1 lg:rounded-none']"
              />
              <div class="mt-8 sm:w-1/2 md:w-4/12 lg:mt-0 lg:w-4/12">
                <InputGuests
                  v-model="guests"
                  class="w-full sm:pl-8 md:pl-16 lg:pl-0 lg:pr-1"
                  :label="'Utasok'"
                  :is-dark="true"
                  :input-style="['lg:rounded-none']"
                />
              </div>
              <div class="hidden mt-24 md:w-5/12 md:block lg:mt-16 lg:w-3/12">
                <div class="flex flex-row items-end justify-end">
                  <ButtonMedium
                    class="uppercase w-1/2 lg:w-full lg:mt-1"
                    type="danger"
                    :input-style="['lg:rounded-l-none']"
                  >
                    {{ $t('general.Search') }}
                  </ButtonMedium>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col md:flex-row md:justify-between">
            <div
              class="flex flex-col sm:flex-row sm:items-center md:w-3/4 md:justify-start mt-8"
            >
              <div
                class="text-sm leading-14 mt-1 mb-6 sm:w-3/12 md:w-auto md:pr-16"
              >
                {{ $t('general.WhatWouldYouPay') }}
              </div>
              <div class="mb-6 sm:w-4/12 md:w-auto md:pr-16">
                <InputRadio
                  v-model="radio"
                  :label="$t('general.BestPriceOption')"
                  :selected="'1'"
                  :is-dark="true"
                />
              </div>
              <div class="mb-6 sm:w-3/12 md:w-auto md:pr-16">
                <InputRadio
                  v-model="radio"
                  :label="$t('general.CreditCard')"
                  :selected="'2'"
                  :is-dark="true"
                />
              </div>
              <div class="mb-6 sm:w-4/12 md:w-auto">
                <InputRadio
                  v-model="radio"
                  :label="'Diamond Voucher'"
                  :selected="'3'"
                  :is-dark="true"
                />
              </div>
            </div>
            <div class="mt-12 md:hidden">
              <ButtonMedium class="uppercase w-full" type="danger">
                {{ $t('general.Search') }}
              </ButtonMedium>
            </div>
            <ServiceSelectDropdown>
              Egyéb szolgáltatásaink
            </ServiceSelectDropdown>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-screen-xl mx-auto m-32">
      <h2 class="font-bold p-16">Hotel search - Travel Assistant</h2>
      <div class="w-full">
        <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
          <div class="flex flex-col lg:flex-row">
            <div class="lg:w-5/12 lg:pr-1 xl:w-7/12">
              <InputHotelNamesearch
                v-model="nameSearch"
                :label="'Szállodák keresése'"
              >
              </InputHotelNamesearch>
            </div>
            <div class="flex flex-col sm:flex-row lg:w-7/12 xl:w-5/12">
              <InputDateRange
                v-model="dates"
                :label-checkin="'Bejelentkezés'"
                :label-checkout="'Kijelentkezés'"
                class="flex flex-row mt-8 sm:w-1/2 md:w-4/12 lg:mt-0 lg:w-5/12"
                :input-style="['lg:border-r-0 lg:-mr-1 lg:rounded-none']"
              />
              <div class="mt-8 sm:w-1/2 md:w-4/12 lg:mt-0 lg:w-4/12">
                <InputGuests
                  v-model="guests"
                  class="w-full sm:pl-8 md:pl-16 lg:pl-0 lg:pr-1"
                  :label="'Utasok'"
                  :input-style="['lg:rounded-l-none lg:rounded-r']"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-screen-xl mx-auto m-32">
      <h2 class="font-bold p-16">Hotel search - Hotel Page - Modal Search</h2>
      <div class="w-full">
        <div class="p-16 mx-auto">
          <div class="flex flex-col md:flex-row">
            <div class="flex flex-col sm:flex-row md:w-3/4 md:pr-8 lg:pr-0">
              <InputDateRange
                v-model="dates"
                :label-checkin="'Bejelentkezés'"
                :label-checkout="'Kijelentkezés'"
                class="flex flex-row mt-8 w-full sm:w-1/2"
                :input-style="['']"
                :input-style-checkin="['lg:rounded-l lg:rounded-r-none']"
                :input-style-checkout="[
                  'lg:rounded-none lg:border-l-0 lg:border-r-0'
                ]"
              />
              <div class="mt-8 w-full sm:pl-8 sm:w-1/2 lg:pl-0">
                <InputGuests
                  v-model="guests"
                  class="w-full"
                  :label="'Utasok'"
                  :input-style="['lg:rounded-none']"
                />
              </div>
            </div>
            <div class="mt-16 md:mt-24 md:w-1/4 md:pl-8 lg:pl-0">
              <div class="flex flex-row items-end justify-end sm:mt-1">
                <ButtonMedium
                  class="uppercase w-full"
                  type="danger"
                  :input-style="['lg:rounded-l-none']"
                >
                  {{ $t('general.Search') }}
                </ButtonMedium>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-screen-xl mx-auto m-32">
      <h2 class="font-bold p-16">Hotel search - Hotel Page - No Offer</h2>
      <div class="w-full">
        <div class="p-16 mx-auto">
          <div class="flex flex-col xl:flex-row">
            <div class="flex flex-col sm:flex-row xl:w-3/4">
              <InputDateRange
                v-model="dates"
                :label-checkin="'Bejelentkezés'"
                :label-checkout="'Kijelentkezés'"
                class="flex flex-row mt-8 w-full sm:w-1/2"
                :input-style="['']"
                :input-style-checkin="['xl:rounded-l xl:rounded-r-none']"
                :input-style-checkout="[
                  'xl:rounded-none xl:border-l-0 xl:border-r-0'
                ]"
                :wrapper-style-checkin="['sm:w-1/2 xl:pr-0']"
                :wrapper-style-checkout="['sm:w-1/2 sm:pr-8 xl:pl-0 xl:pr-0']"
              />
              <div class="mt-8 w-full sm:pl-8 sm:w-1/2 xl:pl-0">
                <InputGuests
                  v-model="guests"
                  class="w-full"
                  :label="'Utasok'"
                  :input-style="['xl:rounded-none']"
                />
              </div>
            </div>
            <div class="mt-16 xl:mt-24 xl:w-1/4">
              <div class="flex flex-row items-end justify-end sm:mt-1">
                <ButtonMedium
                  class="uppercase w-full"
                  type="danger"
                  :input-style="['xl:rounded-l-none']"
                >
                  {{ $t('general.Search') }}
                </ButtonMedium>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import InputDateRange from '@/components/micro/InputDateRange'
import InputRadio from '@/components/micro/InputRadio'
import InputGuests from '@/components/micro/InputGuests'
import ButtonMedium from '@/components/micro/ButtonMedium'
import InputHotelNamesearch from '@/components/micro/InputHotelNamesearch'
import ServiceSelectDropdown from '@/components/heroes/ServiceSelectDropdown'
import { getTomorrow, getDayAfterTomorrow } from '@/includes/utils'

export default {
  components: {
    InputDateRange,
    InputRadio,
    InputGuests,
    ButtonMedium,
    InputHotelNamesearch,
    ServiceSelectDropdown
  },
  data() {
    return {
      nameSearch: {
        text: 'buda',
        id: false
      },
      guests: {
        adults: 2,
        children: 2,
        childrenAges: [1, 6]
      },
      dates: {
        date1: getTomorrow(),
        date2: getDayAfterTomorrow()
      },
      radio: '1'
    }
  }
}
</script>

<style>
.search-bg {
  background-color: rgba(57, 62, 70, 0.6);
  max-height: 464px;
}
</style>
