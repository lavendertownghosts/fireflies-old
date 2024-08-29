<template>
  <main>
    <LoadingLayerWeboffice v-if="learningCorner === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.LearningCorner')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.LearningCorner') }}
      </div>
      <div class="flex flex-col w-full mt-24">
        <WebofficeCard
          v-for="(video, videoKey) in learningCorner.videoList"
          :key="videoKey"
          :title="video.title"
          class="mb-24"
        >
          <div class="text-sm leading-20" v-html="video.description"></div>
          <div class="flex flex-row w-full text-sm leading-20 mt-16">
            <div class="flex flex-grow items-center">
              <i class="far fa-clock mr-4"></i>{{ $t('weboffice.Uploaded') }}
              {{ video.createDate }}
            </div>
            <div class="flex">
              <ButtonSmall
                type="danger"
                class="w-full"
                @click="showVideoModal(video)"
              >
                {{ $t('weboffice.Show') }}
              </ButtonSmall>
            </div>
          </div>
        </WebofficeCard>
      </div>
    </div>
    <DefaultModal
      v-show="activeVideo !== false"
      :is-full-page="false"
      :modal-max-width="'672px'"
    >
      <div slot="header">
        <div class="flex w-full text-black pb-16 px-16">
          <div class="flex flex-grow text-base font-bold leading-24">
            {{ activeVideo.title }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="showVideoModal(false)"
            ></i>
          </div>
        </div>
      </div>
      <div slot="body">
        <div class="w-full mx-auto">
          <iframe
            v-if="activeVideo !== false"
            id="tutorialVideo"
            :src="'https://player.vimeo.com/video/' + activeVideo.videoLink"
            width="640"
            height="360"
            frameborder="0"
            webkitallowfullscreen=""
            mozallowfullscreen=""
            allowfullscreen=""
            class="w-full"
          ></iframe>
        </div>
      </div>
    </DefaultModal>
  </main>
</template>

<script>
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import DefaultModal from '@/components/modal/DefaultModal'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'LearningCornerPage',
  middleware: 'auth_needed',
  components: {
    ButtonSmall,
    DefaultModal,
    WebofficeBreadcrumb,
    WebofficeCard,
    LoadingLayerWeboffice
  },
  data() {
    return {
      learningCorner: false,
      activeVideo: false
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      this.learningCorner = await this.$store.dispatch(
        'user/getLearningCorner',
        { lang: this.$i18n.locale }
      )
    },
    showVideoModal(video) {
      this.activeVideo = video
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeLearningCornerTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeLearningCornerTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeLearningCornerTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
