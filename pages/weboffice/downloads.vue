<template>
  <main>
    <LoadingLayerWeboffice v-if="downloads === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.Downloads')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.Downloads') }}
      </div>
      <div class="mt-24">
        <div
          v-for="(yearsData, yearsDataKey) in downloads.yearsData"
          :key="yearsDataKey"
          class="mb-24"
        >
          <div v-html="yearsData.document" />
          <div class="font-bold my-16" v-html="yearsData.certificates" />
          <div
            v-if="yearsData.certificate_href"
            class="link cursor-pointer"
            @click="downloadPdf(yearsData.certificate_href)"
          >
            <span v-html="yearsData.commissionCertificate" />
          </div>
          <div
            v-if="yearsData.tc_certificate_href"
            class="link cursor-pointer"
            @click="downloadPdf(yearsData.tc_certificate_href)"
          >
            <span v-html="yearsData.commissionCreditedToTravelBalance" />
          </div>
          <div
            v-if="yearsData.euro_certificate_href"
            class="link cursor-pointer"
            @click="downloadPdf(yearsData.euro_certificate_href)"
          >
            <span v-html="yearsData.commissionCertificateEUR" />
          </div>
          <div
            v-if="yearsData.tc_certificate_href_EUR"
            class="link cursor-pointer"
            @click="downloadPdf(yearsData.tc_certificate_href_EUR)"
          >
            <span v-html="yearsData.commissionCreditedToTravelBalanceEUR" />
          </div>
        </div>
        <div v-if="downloads.cycleData">
          <div
            class="mt-16 text-lg leading-24 font-bold mb-24"
            v-html="downloads.cycleData.cycleBonusTitle"
          />
          <div>
            <a
              :href="
                downloads.cycleData.cycleBonusLink1.replace(
                  /<\/?span[^>]*>/g,
                  ''
                )
              "
              target="_blank"
              class="link"
              ><div
                v-html="
                  downloads.cycleData.cycleBonusLink1Title.replace(
                    /<br \/>/,
                    ''
                  )
                "
            /></a>
          </div>
          <div>
            <a
              :href="downloads.cycleData.cycleBonusLink2"
              target="_blank"
              class="link"
              v-html="downloads.cycleData.cycleBonusLink2Title2"
              ><div v-html="downloads.cycleData.cycleBonusLink2Title2"
            /></a>
          </div>
        </div>

        <div>
          <div
            v-for="(blockContent, blockContentKey) in downloads.blockContents"
            :key="blockContentKey"
            class="block-content"
          >
            <div
              class="mt-16 text-lg leading-24 font-bold mb-24"
              v-html="blockContent.content"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'

export default {
  name: 'DownloadsPage',
  middleware: 'auth_needed',
  components: {
    WebofficeBreadcrumb,
    LoadingLayerWeboffice
  },
  data() {
    return {
      downloads: false
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      this.downloads = await this.$store.dispatch('user/getDownloads', {
        lang: this.$i18n.locale
      })
      if (
        this.downloads.blockContents !== undefined &&
        this.downloads.blockContents.length > 0
      ) {
        this.downloads.blockContents.forEach((blockContent) => {
          blockContent.content = blockContent.content.replace(
            /style=".*?"/g,
            ''
          )
        })
      }
    },
    downloadPdf(link) {
      window.open(
        this.$api._defaults.prefixUrl +
          'user/income-certificate' +
          '?auth=' +
          this.$store.state.user.token +
          '&' +
          link +
          '&lang=' +
          this.$i18n.locale,
        '_blank'
      )
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeDownloadsTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeDownloadsTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeDownloadsTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
<style>
.block-content h4 {
  @apply text-2x;
  @apply leading-18;
  @apply mt-24;
}
.block-content p {
  @apply text-base;
  @apply leading-20;
  @apply text-black;
  @apply my-8;
  @apply font-normal;
}
.block-content p a {
  @apply text-primary;
}
</style>
