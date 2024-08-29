<template>
  <main>
    <LoadingLayerWeboffice v-if="invites === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.RecommendService')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.RecommendService') }}
      </div>
      <div class="flex flex-col w-full">
        <WebofficeCard
          :title="$t('weboffice.SendInvitationEmail')"
          class="w-full mb-24"
          content-style="pb-20 pt-4"
        >
          <div
            v-for="(recipient, key) in recipientList"
            :id="'recipient-' + key"
            :key="key"
            :class="
              recipientList[key + 1] !== undefined
                ? 'border-b border-grey-light pb-16'
                : ''
            "
            class="relative flex flex-col pt-16"
          >
            <div class="flex flex-col px-16">
              <div class="flex flex-col sm:flex-col">
                <InputCheckbox v-model="recipient.name" class="mb-10">
                  {{ $t('weboffice.InviteShowName') }}
                </InputCheckbox>
                <InputText
                  v-model="recipient.email"
                  :error="recipient.emailError"
                  :label="$t('weboffice.Email')"
                  class="w-full mt-8 sm:mt-0 sm:w-1/2 lg:w-288"
                />
              </div>
              <div class="flex flex-col lg:flex-row mt-8">
                <InputDropdown
                  v-model="recipient.langKey"
                  :label="$t('weboffice.Language')"
                  :values="languageList"
                  class="w-177 lg:mr-8"
                />
                <InputDropdown
                  v-model="recipient.position"
                  :label="$t('weboffice.LoyaltyPosition')"
                  :values="loyaltyPositions"
                  class="w-271 mt-8 lg:mt-0 lg:ml-8"
                />
              </div>
            </div>
            <div
              v-if="key > 0"
              class="absolute delete-recipient text-black bg-white cursor-pointer hover:text-danger"
            >
              <i class="fas fa-times-circle" @click="deleteRecipient(key)"></i>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-between px-16 mt-8">
            <ButtonSmall type="primary" class="mt-8 sm:mt-0" @click="send">{{
              $t('weboffice.SendInvitationEmail')
            }}</ButtonSmall>
          </div>
        </WebofficeCard>
        <div
          v-if="invites.withoutPositionInvitation !== ''"
          class="flex flex-row items-center mb-16"
        >
          <div class="w-2/3">
            <InputText
              :value="invites.withoutPositionInvitation"
              :label="
                $t('weboffice.SocialInviteUrl') +
                  ': ' +
                  $t('weboffice.SendingInvitationWithoutPosition')
              "
            />
          </div>
          <div
            class="link cursor-pointer ml-16 leading-16 pt-8"
            @click="copyUrl(invites.withoutPositionInvitation)"
          >
            {{ $t('weboffice.Copy') }}
          </div>
        </div>
        <div
          v-for="(invitation, key) in invites.positionInvitations"
          :key="key"
          class="flex flex-row items-center mb-16"
        >
          <div class="w-2/3">
            <InputText
              :value="invitation"
              :label="$t('weboffice.SocialInviteUrl') + ': ' + (key + 1)"
            />
          </div>
          <div
            class="link cursor-pointer ml-16 leading-16 pt-8"
            @click="copyUrl(invitation)"
          >
            {{ $t('weboffice.Copy') }}
          </div>
        </div>
        <div
          v-for="(invitation, key) in invites.bonusPositionInvitationsArray"
          :key="'social-invite-' + key"
          class="flex flex-row items-center mb-16"
        >
          <div class="w-2/3">
            <InputText
              :value="invitation"
              :label="$t('weboffice.SocialInviteUrl') + ': B-' + (key + 1)"
            />
          </div>
          <div
            class="link cursor-pointer ml-16 leading-16 pt-8"
            @click="copyUrl(invitation)"
          >
            {{ $t('weboffice.Copy') }}
          </div>
        </div>
        <div
          v-for="(invitation, key) in invites.extraPositionInvitations"
          :key="'extra-invite-' + key"
          class="flex flex-row items-center mb-16"
        >
          <div class="w-2/3">
            <InputText
              :value="invitation"
              :label="$t('weboffice.SocialInviteUrl') + ': E-' + (key + 1)"
            />
          </div>
          <div
            class="link cursor-pointer ml-16 leading-16 pt-8"
            @click="copyUrl(invitation)"
          >
            {{ $t('weboffice.Copy') }}
          </div>
        </div>
      </div>
    </div>
    <InformativeModal
      v-show="sendSuccessModalActive"
      :accept-button="$t('general.Ok')"
      :link-button="false"
      @close="sendSuccessModalActive = false"
      @cancel="sendSuccessModalActive = false"
      @accept="sendSuccessModalActive = false"
    >
      <div slot="body" class="text-black">
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          {{ getSuccessMessage }}
        </div>
      </div>
    </InformativeModal>
  </main>
</template>

<script>
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import InputText from '@/components/micro/InputText'
import InputCheckbox from '@/components/micro/InputCheckbox'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import InputDropdown from '@/components/micro/InputDropdown'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InformativeModal from '@/components/modal/InformativeModal'

export default {
  name: 'SentInvitePage',
  middleware: 'auth_needed',
  components: {
    InformativeModal,
    ButtonSmall,
    InputDropdown,
    WebofficeCard,
    InputText,
    InputCheckbox,
    LoadingLayerWeboffice,
    WebofficeBreadcrumb
  },
  data() {
    return {
      invites: false,
      recipientList: [],
      languageList: [
        this.$t('general.LangHu'),
        this.$t('general.LangCz'),
        this.$t('general.LangEn'),
        this.$t('general.LangRo'),
        this.$t('general.LangRu'),
        this.$t('general.LangSk'),
        this.$t('general.LangPl')
      ],
      languageKeyList: [1, 6, 2, 7, 4, 5, 9],
      recipientDummy: {
        name: true,
        nameError: '',
        email: '',
        emailError: '',
        langKey: 0,
        lang: 1,
        position: 0,
        positionIndex: 0,
        text1: '',
        text2: ''
      },
      sendSuccessModalActive: false,
      sendSuccessEmails: [],
      loyaltyPositions: [this.$t('weboffice.SendingInvitationWithoutPosition')],
      loyaltyPositionsIndex: [0]
    }
  },
  computed: {
    getSuccessMessage() {
      if (this.sendSuccessEmails.length > 0) {
        const message = this.$t('weboffice.SendInvitationSuccess')
        return message.replace('%emails%', this.sendSuccessEmails.join(', '))
      }
      return ''
    }
  },
  mounted() {
    this.getDetails()
    this.addRecipient()
  },
  methods: {
    async getDetails() {
      try {
        this.invites = await this.$store.dispatch('user/getInvites', {
          lang: this.$i18n.locale
        })
      } catch (e) {
        console.log(e)
      }
      if (
        this.invites.loyaltyPositions !== undefined &&
        this.invites.loyaltyPositions.length > 0
      ) {
        const maxSimlpePosition = Math.max.apply(
          Math,
          this.invites.loyaltyPositions.map((o) => {
            return o.isExtraPos === false && o.isrolloutBonus === false
              ? o.index
              : 0
          })
        )
        this.invites.loyaltyPositions.forEach((loyaltyPosition) => {
          if (
            loyaltyPosition.isExtraPos === false &&
            loyaltyPosition.isrolloutBonus === true
          ) {
            this.loyaltyPositions.push(
              'B' +
                loyaltyPosition.index +
                '. ' +
                this.$t('weboffice.LoyaltyPosition')
            )
          } else if (
            loyaltyPosition.isExtraPos === true &&
            loyaltyPosition.isrolloutBonus === false
          ) {
            this.loyaltyPositions.push(
              'E-' +
                (loyaltyPosition.index - maxSimlpePosition) +
                '. ' +
                this.$t('weboffice.LoyaltyPosition')
            )
          } else {
            this.loyaltyPositions.push(
              loyaltyPosition.index +
                '. ' +
                this.$t('weboffice.LoyaltyPosition')
            )
          }
          this.loyaltyPositionsIndex.push(loyaltyPosition.index)
        })
      }
    },
    async copyUrl(url) {
      await navigator.clipboard.writeText(url)
      this.$store.dispatch('general/showSnackbar', {
        message: this.$t('weboffice.SocialInviteUrlCopied')
      })
    },
    addRecipient() {
      const tmp = JSON.parse(JSON.stringify(this.recipientDummy))
      this.recipientList.push(tmp)
      setTimeout(() => {
        this.$scrollTo('#recipient-' + (this.recipientList.length - 1))
      }, 150)
    },
    deleteRecipient(key) {
      this.recipientList.splice(key, 1)
    },
    async send() {
      let errorRecipient = false
      this.recipientList.forEach((recipient, key) => {
        recipient.lang = this.languageKeyList[recipient.langKey]

        if (recipient.email === '') {
          recipient.emailError = this.$t('weboffice.EmailRequired')
          if (errorRecipient === false) {
            errorRecipient = key
          }
        } else {
          recipient.emailError = ''
        }
        recipient.positionIndex = this.loyaltyPositionsIndex[recipient.position]
      })
      if (errorRecipient !== false) {
        setTimeout(() => {
          this.$scrollTo('#recipient-' + errorRecipient)
        }, 150)
      } else {
        const res = await this.$store.dispatch('user/sendInvitation', {
          recipients: this.recipientList
        })
        if (res.recipients !== undefined && res.recipients.length > 0) {
          const sendSuccess = []
          this.sendSuccessEmails = []
          errorRecipient = false
          for (let i = 0; i < res.recipients.length; i++) {
            if (
              res.recipients[i].response !== undefined &&
              res.recipients[i].response.error !== undefined
            ) {
              this.recipientList[i].emailError =
                res.recipients[i].response.error === 'invited_email_address'
                  ? this.$t('weboffice.EmailInvitedAddress')
                  : res.recipients[i].response.error
              errorRecipient = i
            } else {
              sendSuccess.push(1)
              this.sendSuccessEmails.push(res.recipients[i].email)
            }
          }
          if (errorRecipient !== false) {
            setTimeout(() => {
              this.$scrollTo('#recipient-0')
            }, 150)
          }
          if (sendSuccess.length > 0) {
            this.sendSuccessModalActive = true
            for (let i = 0; i < sendSuccess.length; i++) {
              this.deleteRecipient(sendSuccess[i].key)
            }
          }
          if (this.recipientList.length === 0) {
            this.addRecipient()
          }
        }
      }
    }
  },
  head() {
    return {
      title: this.$t('meta.WebofficeInviteTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeInviteTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeInviteTitle') + this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
<style scoped>
.delete-recipient {
  top: -12px;
  right: -8px;
}
</style>
