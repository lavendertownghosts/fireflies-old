<template>
  <main>
    <LoadingLayerWeboffice v-if="newsletters === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.Profile'),
            link: '/weboffice/personal-data'
          },
          {
            name: $t('weboffice.Newsletter')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.NewsletterSettings') }}
      </div>
      <div class="flex flex-col w-full">
        <div class="flex flex-col">
          <div class="text-2x leading-18 font-bold">
            {{ $t('weboffice.NewsletterName') }}
          </div>
          <div class="flex md:flex-row md:items-center flex-col">
            <div class="flex flex-row mb-10">
              <InputRadio
                v-model="subscribe"
                selected="1"
                :label="$t('weboffice.Subscribe')"
                class="mr-16 mt-18"
              />
              <InputRadio
                v-model="subscribe"
                selected="0"
                :label="$t('weboffice.Unsubscribe')"
                class="mr-16 mt-18"
              />
            </div>
            <div class="flex flex-col">
              <InputDropdown
                v-model="selectedLanguage"
                :values="languageList"
                :label="$t('weboffice.Language')"
                class="w-128 mr-16"
              />
            </div>
            <div class="flex flex-col">
              <ButtonMedium type="primary" class="mt-16" @click="saveOptions">{{
                $t('weboffice.Save')
              }}</ButtonMedium>
            </div>
          </div>
        </div>
        <div class="flex items-center text-2x leading-18 font-bold my-16">
          {{ $t('weboffice.NewsletterList') }}
        </div>
        <Scrollbar
          :centered="false"
          class="pr-1"
          :style="'max-width: ' + scrollbarMaxWidth + 'px'"
        >
          <table
            class="table-auto text-sm leading-14 text-black "
            style="min-width: 895px"
          >
            <thead class="font-bold">
              <tr>
                <th class="py-14 px-8 text-left w-177">
                  {{ $t('weboffice.DateSent') }}
                </th>
                <th class="py-14 px-8 text-left">
                  {{ $t('weboffice.NewsletterSubject') }}
                </th>
                <th class="py-14 px-8 text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowKey) in newsletters.lastNewsletters.slice(
                  (currentPage - 1) * limit,
                  (currentPage - 1) * limit + limit
                )"
                :key="rowKey"
                :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
                class="odd:bg-grey-light"
              >
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.date }}
                </td>
                <td class="py-13 px-8 border border-grey-light">
                  {{ row.title }}
                </td>
                <td class="py-13 px-8 border border-grey-light text-right">
                  <a
                    target="_blank"
                    class="link"
                    :href="
                      localePath(
                        '/newsletter-view/' + row.id + '/' + row.listId
                      )
                    "
                    >{{ $t('weboffice.ShowNewsletter') }}</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </Scrollbar>
        <div class="flex justify-center mt-24">
          <Pagination
            v-if="newsletters !== false && maxPage > 1"
            :max-pages="maxPage"
            :current-page="currentPage"
            @click="navPage"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import Pagination from '@/components/Pagination'
import InputRadio from '@/components/micro/InputRadio'
import InputDropdown from '@/components/micro/InputDropdown'
import ButtonMedium from '@/components/micro/ButtonMedium'
import Scrollbar from '@/components/Scrollbar'
import { getPerPageLimit } from '@/includes/utils'

export default {
  name: 'NewsletterPage',
  middleware: 'auth_needed',
  components: {
    Scrollbar,
    ButtonMedium,
    InputDropdown,
    InputRadio,
    Pagination,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      newsletters: false,
      currentPage: 1,
      maxPage: 1,
      subscribe: '1',
      languageList: [
        this.$t('general.LangHu'),
        this.$t('general.LangCz'),
        this.$t('general.LangEn'),
        this.$t('general.LangRo'),
        this.$t('general.LangRu'),
        this.$t('general.LangSk'),
        this.$t('general.LangPl')
      ],
      languageIds: [1, 6, 2, 7, 4, 5, 9],
      selectedLanguage: 0
    }
  },
  computed: {
    limit() {
      return getPerPageLimit()
    }
  },
  mounted() {
    this.getDetails()
  },

  methods: {
    async getDetails() {
      this.newsletters = await this.$store.dispatch('user/getNewsletter')
      this.maxPage = Math.ceil(
        this.newsletters.lastNewsletters.length / this.limit
      )
      if (
        this.newsletters.list !== undefined &&
        this.newsletters.list[0] !== undefined
      ) {
        if (this.newsletters.list[0].list_freq !== undefined) {
          this.selectedLanguage = this.languageIds.indexOf(
            this.newsletters.list[0].list_freq
          )
        } else {
          this.subscribe = '0'
        }
      }
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
    },
    async saveOptions() {
      try {
        await this.$store.dispatch('user/saveNewsletterOption', {
          langId: this.languageIds[this.selectedLanguage],
          isActive: this.subscribe === '1'
        })
      } catch (e) {
        let body = await e.response
        if (body && e.response !== undefined) {
          body = await e.response.json()
          if (body.messages !== undefined) {
            this.$store.dispatch('general/showSnackbar', {
              message: body.messages
            })
          }
        }
      }
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeNewsletterTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeNewsletterTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeNewsletterTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
