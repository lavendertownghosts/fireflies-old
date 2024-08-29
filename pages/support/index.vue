<template>
  <main class="flex-grow">
    <div class="w-full bg-primary relative">
      <div
        class="small-hero-dark-bg w-full bg-primary flex flex-col justify-between"
        :style="{ backgroundImage: `url(${placeholderBackgroundUrl})` }"
      >
        <img
          :src="backgroundUrl"
          class="hidden"
          :alt="$t('general.TravelStatistics')"
          @load="onLoadBackgroundImage"
        />
        <div
          class="p-16 xl:px-40 max-w-screen-xl xl:min-w-xl xl:mx-auto flex flex-col flex-grow justify-center"
        >
          <div
            class="flex flex-col flex-grow justify-center min-w-full z-10 text-center"
          >
            <h1 class="text-center px-14 text-xl text-pink">
              <span>{{ $t('support.Title') }}</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
    <!-- ALERT 1 -->
    <div v-if="$t('support.AlertMessageHero') != ''" class="w-full bg-danger">
      <div class="p-16 xl:px-40 max-w-screen-xl mx-auto text-white text-sm">
        <b>{{ $t('support.AlertMessageGreetings') }}</b>
        {{ $t('support.AlertMessageHero') }}
      </div>
    </div>

    <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
      <div
        class="flex flex-row mt-4 mb-16 cursor-pointer"
        @click="$router.push(localePath('/'))"
      >
        <i class="fa fa-chevron-left text-primary text-sm leading-14"></i>
        <p class="ml-8 text-sm leading-14 link font-bold mb-6">
          {{ $t('general.Back') }}
        </p>
      </div>

      <!-- ALERT 2 - English office close -->
      <div
        v-if="$t('support.AlertMessageTopClose') != ''"
        class="p-16 max-w-screen-xl mx-auto bg-danger font-bold text-white rounded"
      >
        <i
          class="fas fa-exclamation-triangle text-white text-sm mr-8 leading-14"
        ></i>
        {{ $t('support.AlertMessageTopClose') }}
      </div>
    </div>

    <div class="p-8 xl:px-32 max-w-screen-xl mx-auto">
      <div class="flex-grow overflow-hidden">
        <div class="flex flex-wrap justify-start">
          <!-- CURRENT EMAIL -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-8 mb-16">
            <div class="rounded border border-grey-light">
              <div class="grid grid-cols-6 border-b border-grey-light">
                <div class="rounded-tl bg-primary w-48 h-49 text-center py-12">
                  <i class="fas fa-at text-white"></i>
                </div>
                <div
                  class="col-span-3 content-center p-12 ml-8 flex flex-wrap text-sm font-bold text-black"
                >
                  {{ $t('support.EmailLabel') }}
                </div>
                <div class="col-span-2 justify-end flex flex-wrap p-16">
                  <img
                    :src="getFlag(currentLanguage)"
                    width="32"
                    height="17"
                    class="rounded"
                  />
                </div>
              </div>
              <div class="font-bold p-16">
                <div class="h-42 content-center text-primary flex flex-wrap">
                  {{ $t('support.Email' + currentLanguage.toUpperCase()) }}
                </div>
              </div>
            </div>
          </div>

          <!-- CURRENT PHONE -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-8 mb-16">
            <div class="rounded border border-grey-light">
              <div class="grid grid-cols-6 border-b border-grey-light">
                <div
                  class="rounded-tl bg-primary w-48 h-49 text-center py-12 text-white"
                >
                  <i class="fas fa-phone"></i>
                </div>
                <div
                  class="col-span-3 content-center p-12 flex flex-wrap ml-8 font-bold text-sm text-black"
                >
                  {{ $t('support.PhoneLabel') }}
                </div>
                <div class="col-span-2 justify-end flex flex-wrap p-16">
                  <img
                    :src="getFlag(currentLanguage)"
                    width="32"
                    height="17"
                    class="rounded"
                  />
                </div>
              </div>
              <div class="p-16">
                <div class="h-42 text-black flex flex-wrap flex-col">
                  <div class="block font-bold text-base leading-16">
                    {{ $t('support.Phone' + currentLanguage.toUpperCase()) }}
                  </div>
                  <div class="italic text-sm">
                    {{ $t('support.AvailableDuringOffice') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CURRENT CHAT -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-8 mb-16">
            <div class="rounded border border-grey-light">
              <div class="grid grid-cols-6 border-b border-grey-light">
                <div class="rounded-tl bg-primary w-48 h-49 text-center py-12">
                  <i class="fas fa-comments-alt text-white"></i>
                </div>
                <div
                  class="col-span-3 content-center p-12 flex ml-8 flex-wrap font-bold text-sm text-black"
                >
                  {{ $t('support.LiveChatLabel') }}
                </div>
                <div class="col-span-2 justify-end flex flex-wrap p-16">
                  <img
                    :src="getFlag(currentLanguage)"
                    width="32"
                    height="17"
                    class="rounded"
                  />
                </div>
              </div>
              <div class="p-16">
                <div
                  class="h-42 content-center text-black italic flex flex-wrap"
                >
                  {{ $t('support.AvailableDuringOffice') }}
                </div>
              </div>
            </div>
          </div>

          <!-- CURRENT OPENING -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-8 mb-16">
            <div class="rounded border border-grey-light">
              <div class="grid grid-cols-6 border-b border-grey-light">
                <div class="rounded-tl bg-primary w-48 h-49 text-center py-12">
                  <i class="fas fa-clock text-white"></i>
                </div>
                <div
                  class="col-span-3 text-sm content-center ml-8 p-12 flex flex-wrap font-bold text-black"
                >
                  {{ $t('support.OfficeHoursLabel') }}
                </div>
                <div class="col-span-2 justify-end flex flex-wrap p-16">
                  <img
                    :src="getFlag(currentLanguage)"
                    width="32"
                    height="17"
                    class="rounded"
                  />
                </div>
              </div>
              <div class="p-16">
                <div
                  class="h-42 content-center text-black flex flex-wrap leading-14"
                >
                  <span class="text-xs italic">{{
                    $t('support.OfficeHoursBusinessDays')
                  }}</span>
                  <span class="text-sm">
                    {{
                      $t(
                        'support.OfficeHoursLine1' +
                          currentLanguage.toUpperCase()
                      )
                    }}<br
                      v-if="
                        $t(
                          'support.OfficeHoursLine1' +
                            currentLanguage.toUpperCase()
                        ) != ''
                      "
                    />{{
                      $t(
                        'support.OfficeHoursLine2' +
                          currentLanguage.toUpperCase()
                      )
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-16 xl:px-40 max-w-screen-xl mx-auto">
      <!-- INFO BOX 1 -->
      <div
        v-if="$t('support.InfoBox1Content') != ''"
        class="bg-pink mb-24 p-16 flex-grow overflow-hidden text-black"
      >
        <h3 class="font-bold">{{ $t('support.InfoBox1Head') }}</h3>
        <p class="text-sm mt-24">
          {{ $t('support.InfoBox1Content') }}
        </p>
      </div>

      <!-- INFO BOX 2 -->
      <div
        v-if="$t('support.InfoBox2Content') != ''"
        class="bg-pink mb-24 p-16 flex-grow overflow-hidden text-black"
      >
        <h3 class="font-bold">
          {{ $t('support.InfoBox2Head') }}
        </h3>
        <p class="text-sm mt-24">{{ $t('support.InfoBox2Content') }}</p>
      </div>

      <!-- SUPPORT DESCRIPTION -->
      <div class="mb-24 flex-grow overflow-hidden text-black">
        <h3 class="font-bold">
          {{ $t('support.DescriptionHead') }}
        </h3>
        <p class="text-sm mt-16">
          {{ $t('support.DescriptionLine1') }}
        </p>
        <p class="text-sm mt-24">
          {{ $t('support.DescriptionLine2') }}
        </p>
        <p class="text-sm">
          {{ $t('support.DescriptionLine3') }}
        </p>
      </div>

      <!-- MORE INFO -->
      <div class="flex-grow mb-16 overflow-hidden text-black">
        <div class="flex flex-wrap justify-start">
          <h2 class="font-bold">{{ $t('support.MoreContactLabel') }}</h2>
        </div>
      </div>

      <!-- CZ INFO ROW -->
      <div
        class="mb-16 overflow-hidden rounded border border-grey-light text-black"
      >
        <div class="grid md:grid-cols-2 grid-cols-1 border-b border-grey-light">
          <div
            class="md:p-16 px-16 sm:pt-16 xs:pt-16 flex flex-row font-bold content-center"
          >
            <img
              src="~/assets/images/flags/cz.png"
              width="32"
              height="17"
              class="rounded my-4 mr-12"
            />
            {{ $t('support.CountryCSLabel') }}
          </div>
          <div
            v-if="$t('support.ClosedCS') != ''"
            class="content-center md:justify-end md:p-12 sm:pb-16 xs:pb-16 px-16 flex flex-wrap font-bold text-danger"
          >
            {{ $t('support.ClosedCS') }}
          </div>
        </div>

        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          <div
            class="p-16 pb-8 md:pt-16 flex flex-row font-bold content-center"
          >
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-at text-primary"></i>
            </div>
            <div
              class="md:h-42 content-center text-primary flex flex-wrap leading-14"
            >
              {{ $t('support.EmailCS') }}
            </div>
          </div>
          <div class="p-16 py-8 md:py-16 flex flex-row content-center">
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-phone"></i>
            </div>
            <div
              class="md:h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="block font-bold text-base leading-16">{{
                $t('support.PhoneCS')
              }}</span>
              <span class="italic text-sm">{{
                $t('support.AvailableDuringOfficeCS')
              }}</span>
            </div>
          </div>
          <div class="py-8 md:py-16 p-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-comments-alt"></i>
            </div>
            <div class="h-42 content-center flex flex-wrap leading-14">
              <span class="block text-base leading-16">{{
                $t('support.LiveChatLabelCS')
              }}</span>
            </div>
          </div>
          <div class="p-16 pt-8 md:pt-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-clock"></i>
            </div>
            <div
              class="h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="text-xs italic">{{
                $t('support.OfficeHoursBusinessDaysCS')
              }}</span>
              <span class="text-sm"
                >{{ $t('support.OfficeHoursLine1CS')
                }}<br v-if="$t('support.OfficeHoursLine2CS') != ''" />{{
                  $t('support.OfficeHoursLine2CS')
                }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- EN INFO ROW -->
      <div
        class="mb-16 overflow-hidden rounded border border-grey-light text-black"
      >
        <div class="grid md:grid-cols-2 grid-cols-1 border-b border-grey-light">
          <div
            class="md:p-16 px-16 sm:pt-16 xs:pt-16 flex flex-row font-bold content-center"
          >
            <img
              src="~/assets/images/flags/en.png"
              width="32"
              height="17"
              class="rounded my-4 mr-12"
            />
            {{ $t('support.CountryENLabel') }}
          </div>
          <div
            v-if="$t('support.ClosedEN') != ''"
            class="content-center md:justify-end md:p-12 sm:pb-16 xs:pb-16 px-16 flex flex-wrap font-bold text-danger"
          >
            {{ $t('support.ClosedEN') }}
          </div>
        </div>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          <div
            class="p-16 pb-8 md:pt-16 flex flex-row font-bold content-center"
          >
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-at text-primary"></i>
            </div>
            <div
              class="md:h-42 content-center text-primary flex flex-wrap leading-14"
            >
              {{ $t('support.EmailEN') }}
            </div>
          </div>
          <div class="p-16 py-8 md:py-16 flex flex-row content-center">
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-phone"></i>
            </div>
            <div
              class="md:h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="block font-bold text-base leading-16">{{
                $t('support.PhoneEN')
              }}</span>
              <span class="italic text-sm">{{
                $t('support.AvailableDuringOfficeEN')
              }}</span>
            </div>
          </div>
          <div class="py-8 md:py-16 p-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-comments-alt"></i>
            </div>
            <div class="h-42 content-center flex flex-wrap leading-14">
              <span class="block text-base leading-16">{{
                $t('support.LiveChatLabelEN')
              }}</span>
            </div>
          </div>
          <div class="p-16 pt-8 md:pt-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-clock"></i>
            </div>
            <div
              class="h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="text-xs italic">{{
                $t('support.OfficeHoursBusinessDaysEN')
              }}</span>
              <span class="text-sm"
                >{{ $t('support.OfficeHoursLine1EN')
                }}<br v-if="$t('support.OfficeHoursLine2EN') != ''" />{{
                  $t('support.OfficeHoursLine2EN')
                }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- HU INFO ROW -->
      <div
        class="mb-16 overflow-hidden rounded border border-grey-light text-black"
      >
        <div class="grid md:grid-cols-2 grid-cols-1 border-b border-grey-light">
          <div
            class="md:p-16 px-16 sm:pt-16 xs:pt-16 flex flex-row font-bold content-center"
          >
            <img
              src="~/assets/images/flags/hu.png"
              width="32"
              height="17"
              class="rounded my-4 mr-12"
            />
            {{ $t('support.CountryHULabel') }}
          </div>
          <div
            v-if="$t('support.ClosedHU') != ''"
            class="content-center md:justify-end md:p-12 sm:pb-16 xs:pb-16 px-16 flex flex-wrap font-bold text-danger"
          >
            {{ $t('support.ClosedHU') }}
          </div>
        </div>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          <div
            class="p-16 pb-8 md:pt-16 flex flex-row font-bold content-center"
          >
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-at text-primary"></i>
            </div>
            <div
              class="md:h-42 content-center text-primary flex flex-wrap leading-14"
            >
              {{ $t('support.EmailHU') }}
            </div>
          </div>
          <div class="p-16 py-8 md:py-16 flex flex-row content-center">
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-phone"></i>
            </div>
            <div
              class="md:h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="block font-bold text-base leading-16">{{
                $t('support.PhoneHU')
              }}</span>
              <span class="italic text-sm">{{
                $t('support.AvailableDuringOfficeHU')
              }}</span>
            </div>
          </div>
          <div class="py-8 md:py-16 p-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-comments-alt"></i>
            </div>
            <div class="h-42 content-center flex flex-wrap leading-14">
              <span class="block text-base leading-16">{{
                $t('support.LiveChatLabelHU')
              }}</span>
            </div>
          </div>
          <div class="p-16 pt-8 md:pt-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-clock"></i>
            </div>
            <div
              class="h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="text-xs italic">{{
                $t('support.OfficeHoursBusinessDaysHU')
              }}</span>
              <span class="text-sm"
                >{{ $t('support.OfficeHoursLine1HU')
                }}<br v-if="$t('support.OfficeHoursLine2HU') != ''" />{{
                  $t('support.OfficeHoursLine2HU')
                }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- RO INFO ROW -->
      <div
        class="mb-16 hidden overflow-hidden rounded border border-grey-light text-black"
      >
        <div class="grid md:grid-cols-2 grid-cols-1 border-b border-grey-light">
          <div
            class="md:p-16 px-16 sm:pt-16 xs:pt-16 flex flex-row font-bold content-center"
          >
            <img
              src="~/assets/images/flags/ro.png"
              width="32"
              height="17"
              class="rounded my-4 mr-12"
            />
            {{ $t('support.CountryROLabel') }}
          </div>
          <div
            v-if="$t('support.ClosedRO') != ''"
            class="content-center md:justify-end md:p-12 sm:pb-16 xs:pb-16 px-16 flex flex-wrap font-bold text-danger"
          >
            {{ $t('support.ClosedRO') }}
          </div>
        </div>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          <div
            class="p-16 pb-8 md:pt-16 flex flex-row font-bold content-center"
          >
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-at text-primary"></i>
            </div>
            <div
              class="md:h-42 content-center text-primary flex flex-wrap leading-14"
            >
              {{ $t('support.EmailRO') }}
            </div>
          </div>
          <div class="p-16 py-8 md:py-16 flex flex-row content-center">
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-phone"></i>
            </div>
            <div
              class="md:h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="block font-bold text-base leading-16">{{
                $t('support.PhoneRO')
              }}</span>
              <span class="italic text-sm">{{
                $t('support.AvailableDuringOfficeRO')
              }}</span>
            </div>
          </div>
          <div class="py-8 md:py-16 p-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-comments-alt"></i>
            </div>
            <div class="h-42 content-center flex flex-wrap leading-14">
              <span class="block text-base leading-16">{{
                $t('support.LiveChatLabelRO')
              }}</span>
            </div>
          </div>
          <div class="p-16 pt-8 md:pt-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-clock"></i>
            </div>
            <div
              class="h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="text-xs italic">{{
                $t('support.OfficeHoursBusinessDaysRO')
              }}</span>
              <span class="text-sm"
                >{{ $t('support.OfficeHoursLine1RO')
                }}<br v-if="$t('support.OfficeHoursLine2RO') != ''" />{{
                  $t('support.OfficeHoursLine2RO')
                }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- SK INFO ROW -->
      <div
        class="mb-16 overflow-hidden rounded border border-grey-light text-black"
      >
        <div class="grid md:grid-cols-2 grid-cols-1 border-b border-grey-light">
          <div
            class="md:p-16 px-16 sm:pt-16 xs:pt-16 flex flex-row font-bold content-center"
          >
            <img
              src="~/assets/images/flags/sk.png"
              width="32"
              height="17"
              class="rounded my-4 mr-12"
            />
            {{ $t('support.CountrySKLabel') }}
          </div>
          <div
            v-if="$t('support.ClosedSK') != ''"
            class="content-center md:justify-end md:p-12 sm:pb-16 xs:pb-16 px-16 flex flex-wrap font-bold text-danger"
          >
            {{ $t('support.ClosedSK') }}
          </div>
        </div>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          <div
            class="p-16 pb-8 md:pt-16 flex flex-row font-bold content-center"
          >
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-at text-primary"></i>
            </div>
            <div
              class="md:h-42 content-center text-primary flex flex-wrap leading-14"
            >
              {{ $t('support.EmailSK') }}
            </div>
          </div>
          <div class="p-16 py-8 md:py-16 flex flex-row content-center">
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-phone"></i>
            </div>
            <div
              class="md:h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="block font-bold text-base leading-16">{{
                $t('support.PhoneSK')
              }}</span>
              <span class="italic text-sm">{{
                $t('support.AvailableDuringOfficeSK')
              }}</span>
            </div>
          </div>
          <div class="py-8 md:py-16 p-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-comments-alt"></i>
            </div>
            <div class="h-42 content-center flex flex-wrap leading-14">
              <span class="block text-base leading-16">{{
                $t('support.LiveChatLabelSK')
              }}</span>
            </div>
          </div>
          <div class="p-16 pt-8 md:pt-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-clock"></i>
            </div>
            <div
              class="h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="text-xs italic">{{
                $t('support.OfficeHoursBusinessDaysSK')
              }}</span>
              <span class="text-sm"
                >{{ $t('support.OfficeHoursLine1SK')
                }}<br v-if="$t('support.OfficeHoursLine2SK') != ''" />{{
                  $t('support.OfficeHoursLine2SK')
                }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- RU INFO ROW -->
      <div
        class="mb-32 overflow-hidden rounded border border-grey-light text-black"
      >
        <div class="grid md:grid-cols-2 grid-cols-1 border-b border-grey-light">
          <div
            class="md:p-16 px-16 sm:pt-16 xs:pt-16 flex flex-row font-bold content-center"
          >
            <img
              src="~/assets/images/flags/ru.png"
              width="32"
              height="17"
              class="rounded my-4 mr-12"
            />
            {{ $t('support.CountryRULabel') }}
          </div>
          <div
            v-if="$t('support.ClosedRU') != ''"
            class="content-center md:justify-end md:p-12 sm:pb-16 xs:pb-16 px-16 flex flex-wrap font-bold text-danger"
          >
            {{ $t('support.ClosedRU') }}
          </div>
        </div>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          <div
            class="p-16 pb-8 md:pt-16 flex flex-row font-bold content-center"
          >
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-at text-primary"></i>
            </div>
            <div
              class="md:h-42 content-center text-primary flex flex-wrap leading-14"
            >
              {{ $t('support.EmailRU') }}
            </div>
          </div>
          <div class="p-16 py-8 md:py-16 flex flex-row content-center">
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-phone"></i>
            </div>
            <div
              class="md:h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="block font-bold text-base leading-16">{{
                $t('support.PhoneRU')
              }}</span>
              <span class="italic text-sm">{{
                $t('support.AvailableDuringOfficeRU')
              }}</span>
            </div>
          </div>
          <div class="py-8 md:py-16 p-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-comments-alt"></i>
            </div>
            <div class="h-42 content-center flex flex-wrap leading-14">
              <span class="block text-base leading-16">{{
                $t('support.LiveChatLabelRU')
              }}</span>
            </div>
          </div>
          <div class="p-16 pt-8 md:pt-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-clock"></i>
            </div>
            <div
              class="h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="text-xs italic">{{
                $t('support.OfficeHoursBusinessDaysRU')
              }}</span>
              <span class="text-sm"
                >{{ $t('support.OfficeHoursLine1RU')
                }}<br v-if="$t('support.OfficeHoursLine2RU') != ''" />{{
                  $t('support.OfficeHoursLine2RU')
                }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- UA INFO ROW -->
      <div
        class="mb-32 overflow-hidden rounded border border-grey-light text-black"
      >
        <div class="grid md:grid-cols-2 grid-cols-1 border-b border-grey-light">
          <div
            class="md:p-16 px-16 sm:pt-16 xs:pt-16 flex flex-row font-bold content-center"
          >
            <img
              src="~/assets/images/flags/ua.png"
              width="32"
              height="17"
              class="rounded my-4 mr-12"
            />
            {{ $t('support.CountryUALabel') }}
          </div>
          <div
            v-if="$t('support.ClosedUA') != ''"
            class="content-center md:justify-end md:p-12 sm:pb-16 xs:pb-16 px-16 flex flex-wrap font-bold text-danger"
          >
            {{ $t('support.ClosedUA') }}
          </div>
        </div>
        <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          <div
            class="p-16 pb-8 md:pt-16 flex flex-row font-bold content-center"
          >
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-at text-primary"></i>
            </div>
            <div
              class="md:h-42 content-center text-primary flex flex-wrap leading-14"
            >
              {{ $t('support.EmailUA') }}
            </div>
          </div>
          <div class="p-16 py-8 md:py-16 flex flex-row content-center">
            <div
              class="md:h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-phone"></i>
            </div>
            <div
              class="md:h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="block font-bold text-base leading-16">{{
                $t('support.PhoneUA')
              }}</span>
              <span class="italic text-sm">{{
                $t('support.AvailableDuringOfficeUA')
              }}</span>
            </div>
          </div>
          <div class="py-8 md:py-16 p-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-comments-alt"></i>
            </div>
            <div class="h-42 content-center flex flex-wrap leading-14">
              <span class="block text-base leading-16">{{
                $t('support.LiveChatLabelUA')
              }}</span>
            </div>
          </div>
          <div class="p-16 pt-8 md:pt-16 flex flex-row content-center">
            <div
              class="h-42 content-center text-black flex mr-8 flex-wrap leading-14"
            >
              <i class="fas fa-clock"></i>
            </div>
            <div
              class="h-42 content-center flex sm:flex-col md:flex-col flex-wrap leading-14"
            >
              <span class="text-xs italic">{{
                $t('support.OfficeHoursBusinessDaysUA')
              }}</span>
              <span class="text-sm"
                >{{ $t('support.OfficeHoursLine1UA')
                }}<br v-if="$t('support.OfficeHoursLine2UA') != ''" />{{
                  $t('support.OfficeHoursLine2UA')
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import placeholderBackgroundUrl from '~/assets/images/news-bg-small.jpg'
import backgroundUrl from '~/assets/images/support-hero.jpg'

export default {
  name: 'SupportPage',
  components: {},
  data() {
    return { backgroundUrl, placeholderBackgroundUrl }
  },
  computed: {
    currentLanguage() {
      if (this.$i18n.locale === 'ro') {
        return 'en'
      } else {
        return this.$i18n.locale
      }
    }
  },
  mounted() {},
  methods: {
    onLoadBackgroundImage() {
      this.placeholderBackgroundUrl = backgroundUrl
    },
    getFlag(pic) {
      if (pic === 'cs') {
        pic = 'cz'
      }
      return require('~/assets/images/flags/' + pic + '.png')
    },
    head() {
      return {
        title: this.$t('meta.SupportTitle') + this.$t('meta.TitleSuffix'),
        meta: [
          {
            property: 'og:title',
            content: this.$t('meta.SupportTitle') + this.$t('meta.TitleSuffix')
          },
          {
            property: 'twitter:title',
            content: this.$t('meta.SupportTitle') + this.$t('meta.TitleSuffix')
          },
          {
            property: 'og:description',
            content:
              this.$t('meta.SupportDescription') + this.$t('meta.TitleSuffix')
          },
          {
            hid: 'description',
            name: 'description',
            content:
              this.$t('meta.SupportDescription') + this.$t('meta.TitleSuffix')
          },
          {
            property: 'twitter:description',
            content:
              this.$t('meta.SupportDescription') + this.$t('meta.TitleSuffix')
          }
        ]
      }
    }
  }
}
</script>
