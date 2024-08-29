<template>
  <main>
    <LoadingLayerWeboffice v-if="cycleGroup === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb
        :links="[
          {
            name: $t('weboffice.Weboffice'),
            link: '/weboffice/'
          },
          {
            name: $t('weboffice.VipCycleBonusGroupData')
          }
        ]"
      />
      <div class="flex items-center text-lg leading-24 font-bold mb-24 mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.VipCycleBonusGroupData') }}
      </div>
    </div>
    <div v-if="cycleGroup !== false" class="flex flex-col w-full mt-24">
      <WebofficeCard :title="$t('weboffice.Information')" :content-style="''">
        <div
          class="flex flex-col px-16 pt-20 pb-12 border-b border-grey text-sm leading-20"
        >
          <div class="mb-8 uppercase">
            <b>{{ $t('weboffice.Sponsore') }}: </b>
            {{ cycleGroup.sponsorName }} -
            {{ cycleGroup.sponsorLevel }}
          </div>
          <div class="uppercase">
            <b>{{ $t('weboffice.Navigation') }}: </b>
            <template v-for="(link, index) in cycleGroup.navigation">
              <span
                :key="'b' + index + Math.round() * 10"
                class="link cursor-pointer"
                @click="
                  getDetails({
                    type: link.linktype,
                    linktype:
                      link.linktype != undefined ? link.linktype : 'positionId',
                    linkparam: link.linkparam
                  })
                "
                >{{ link.text }}
              </span>
              <span
                v-if="index !== cycleGroup.navigation.length - 1"
                :key="'a' + index"
                class="px-4"
              >
                >
              </span>
            </template>
          </div>
          <div class="flex flex-row w-full lg:w-1/3 mt-16">
            <InputBonusGroupNamesearch
              v-model="nameSearch"
              :component-attr-id="'namesearch'"
              :label="$t('weboffice.UserFilter')"
              :class="'mt-16 lg:mt-0 w-full'"
            />
            <ButtonSmall
              class="w-full mt-16 lg:ml-5 mb-2 md:w-82"
              type="primary"
              @click="filterMainTable()"
            >
              {{ $t('weboffice.Filter') }}
            </ButtonSmall>
          </div>
        </div>
      </WebofficeCard>

      <Scrollbar
        :centered="false"
        class="pr-1 mt-16"
        :style="'max-width: ' + scrollbarMaxWidth + 'px'"
      >
        <b v-show="selectedname !== ''">{{ selectedname }}</b>
        <table
          class="table-auto text-sm leading-14 text-black "
          style="min-width: 895px"
        >
          <thead class="font-bold">
            <tr>
              <template v-for="(header, index) in cycleGroup.tableHeader">
                <th :key="'i' + index" class="py-14 px-8 text-left">
                  {{ $t('weboffice.' + convertCase(header)) }}
                </th>
              </template>
              <th class="py-14 px-8 text-left"></th>
            </tr>
          </thead>
          <tbody v-if="cycleGroup.tableData !== undefined">
            <template
              v-for="(row, rowKey) in cycleGroup.tableData.slice(
                (currentPage - 1) * limit,
                (currentPage - 1) * limit + limit
              )"
              :class="rowKey % 2 === 1 ? 'bg-grey-light bg-opacity-30' : ''"
              class="odd:bg-grey-light"
            >
              <tr :key="'h' + rowKey">
                <template v-for="(element, index) in cycleGroup.tableHeader">
                  <td
                    v-if="(element === 'position') | (element === 'username')"
                    :key="'g' + index"
                    class="py-13 px-8 border border-grey-light"
                  >
                    <div
                      class="link cursor-pointer"
                      @click="
                        getDetails({
                          type: row.rowtype,
                          user: row[element],
                          linktype:
                            row.linktype != undefined
                              ? row.linktype
                              : 'positionId',
                          linkparam: row.linkparam
                        })
                      "
                    >
                      {{ row[element] }}
                    </div>
                  </td>
                  <td
                    v-else-if="element === 'level'"
                    :key="'f' + index"
                    class="py-13 px-8 border border-grey-light"
                  >
                    {{ getUserLevelName(row[element]) }}
                  </td>
                  <td
                    v-else
                    :key="'e' + index"
                    class="py-13 px-8 border border-grey-light"
                  >
                    {{ row[element] }}
                  </td>
                </template>
                <td class="py-13 px-8 border border-grey-light">
                  <div
                    class="link cursor-pointer"
                    @click="
                      if (rowKey === activeRow) {
                        activeRow = -1
                      } else {
                        activeRow = rowKey
                      }
                    "
                  >
                    {{ $t('general.Details') }}
                    <i class="fas fa-chevron-down"></i>
                  </div>
                </td>
              </tr>
              <tr :key="rowKey + 'extra'">
                <td
                  v-show="rowKey === activeRow"
                  :colspan="cycleGroup.tableHeader.length + 1"
                  class="py-13 px-8 border border-grey-light bg-grey-light bg-opacity-50"
                >
                  <template v-for="(item, index) in row">
                    <div
                      v-if="
                        !containsOBJ(cycleGroup.tableHeader, index) &&
                          index !== 'details'
                      "
                      :key="'d' + index"
                      class="w-full py-4"
                    >
                      <span
                        >{{ $t('weboffice.' + convertCase(index)) }}:
                        {{ item }}</span
                      >
                    </div>
                    <div v-if="index == 'details'" :key="index">
                      <template v-for="(jsonItem, id) in item">
                        <div
                          v-if="id !== 'rowNames'"
                          :key="'c' + id"
                          class="w-full py-4"
                        >
                          {{ $t('weboffice.' + convertCase(id)) }}:
                          {{ jsonItem }}
                        </div>
                      </template>
                    </div>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </Scrollbar>
      <div class="flex justify-center mt-24">
        <Pagination
          v-if="cycleGroup !== false && maxPage > 1"
          :max-pages="maxPage"
          :current-page="currentPage"
          @click="navPage"
        />
      </div>
    </div>
  </main>
</template>

<script>
import { contains, toPascalCase, getUserLevelName } from '@/includes/utils'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import WebofficeCard from '@/components/weboffice/WebofficeCard'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import InputBonusGroupNamesearch from '@/components/micro/InputBonusGroupNamesearch'
import ButtonSmall from '@/components/micro/ButtonSmall'
import Pagination from '@/components/Pagination'
import Scrollbar from '@/components/Scrollbar'

export default {
  name: 'VIPGroupDataPage',
  middleware: 'auth_needed',
  components: {
    LoadingLayerWeboffice,
    WebofficeCard,
    WebofficeBreadcrumb,
    Pagination,
    Scrollbar,
    InputBonusGroupNamesearch,
    ButtonSmall
  },
  props: {
    scrollbarMaxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cycleGroup: false,
      currentPage: 1,
      limit: 10,
      maxPage: 1,
      subscribe: '1',
      activeRow: -1,
      type: 'position',
      selectedname: '',
      nameSearch: {
        text: '',
        id: false
      }
    }
  },
  mounted() {
    this.getDetails(false)
  },
  methods: {
    getUserLevelName,
    async getDetails(params) {
      this.cycleGroup = false
      this.activeRow = -1
      this.currentPage = 1
      const request = params === false ? {} : params
      this.selectedname = params.username !== undefined ? params.username : ''
      this.cycleGroup = await this.$store.dispatch(
        'user/getVipCycleGroup',
        request
      )

      this.maxPage = this.cycleGroup.tableData
        ? Math.ceil(this.cycleGroup.tableData.length / this.limit)
        : 0
    },
    containsOBJ(obj, val) {
      if (val === 'linkparam') {
        return true
      }
      if (val === 'linktype') {
        return true
      }
      if (val === 'rowtype') {
        return true
      }
      if (val === 'rowId') {
        return true
      }
      return contains(obj, val)
    },
    filterMainTable() {
      this.getDetails({
        username: this.nameSearch.text
      })
    },
    convertCase(text) {
      return toPascalCase(text)
    },
    navPage(page) {
      this.currentPage = page
      this.activeRow = -1
      this.$scrollTo('#__nuxt')
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeGroupDataTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeGroupDataTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeGroupDataTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
