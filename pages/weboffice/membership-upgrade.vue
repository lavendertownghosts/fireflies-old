<template>
  <main>
    <LoadingLayerWeboffice v-if="membershipUpgrade === false" />
    <div v-else class="text-black">
      <WebofficeBreadcrumb :links="links" />
      <div class="flex items-center text-lg leading-24 font-bold mt-16">
        <i
          class="fa fa-chevron-left text-base leading-16 text-primary cursor-pointer mr-8"
          @click="$router.push(localePath('/'))"
        ></i>
        {{ $t('weboffice.PurchaseFirefliesProducts') }}
      </div>
      <div class="flex flex-row w-full mt-16">
        <div
          class="flex w-full rounded-tl border-t border-l border-grey-light px-16 py-8"
          :class="[
            activeTab !== 1 ? 'bg-primary-opaque cursor-pointer' : '',
            stepDenied && loyaltyProducts.length == 0
              ? 'rounded-tr border-r'
              : ''
          ]"
          @click="activeTab = 1"
        >
          {{ $t('weboffice.GeneralProducts') }}
        </div>
        <div
          v-if="!stepDenied || loyaltyProducts.length > 0"
          class="flex w-full rounded-tr border-t border-r border-grey-light px-16 py-8"
          :class="activeTab !== 2 ? 'bg-primary-opaque cursor-pointer' : ''"
          @click="activeTab = 2"
        >
          {{ $t('weboffice.VIPProducts') }}
        </div>
      </div>
      <div
        v-show="activeTab === 1"
        class="p-16 pb-0 border border-grey-light rounded-b"
      >
        <div class="flex flex-col w-full">
          <div
            v-show="mainProducts.length > 0"
            class="flex flex-col lg:flex-row flex-wrap border-b border-grey-light pb-32"
          >
            <div
              v-for="(product, key) in mainProducts"
              :key="key"
              :class="key === 0 ? 'lg:pr-8' : key === 2 ? 'lg:pl-8' : 'lg:px-8'"
              class="w-full mb-16 lg:mb-0 lg:w-1/3"
            >
              <div
                :class="
                  productInCart(product.cartId)
                    ? 'border-primary'
                    : 'border-grey-light'
                "
                class="flex flex-col rounded border"
              >
                <div
                  :class="
                    productInCart(product.cartId)
                      ? 'bg-primary text-white'
                      : 'bg-grey-light bg-opacity-20'
                  "
                  class="p-16 font-bold leading-16"
                  v-html="product.localizedTitle"
                ></div>
                <div
                  class="p-16 text-sm leading-14 h-82"
                  v-html="product.localizedContent"
                />
                <div
                  class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                >
                  <div class="w-1/2 font-bold">
                    {{ currency }}
                    {{
                      product.price
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                  </div>
                  <div class="w-1/2 text-right">
                    <ButtonSmall
                      :type="
                        productInCart(product.cartId) ? 'primary' : 'inverted'
                      "
                      :is-disabled="!isOrderable(product)"
                      :is-loading="isLoading"
                      class="w-92"
                      @click="selectProduct(product.cartId)"
                    >
                      {{
                        productInCart(product.cartId)
                          ? $t('weboffice.Reject')
                          : $t('weboffice.Select')
                      }}
                    </ButtonSmall>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="!VIPDenied"
            class="flex flex-col lg:flex-row flex-wrap border-b border-grey-light pt-32 pb-32"
          >
            <!-- VIP NEW STATIC PRODUCTS -->
            <div
              v-for="(product, key) in VIPProducts"
              :key="key"
              :class="key === 0 ? 'lg:pr-8' : key === 2 ? 'lg:pl-8' : 'lg:px-8'"
              class="w-full mb-16 lg:mb-0 lg:w-1/3"
            >
              <div
                :class="
                  inVIPCart(product) ? 'border-primary' : 'border-grey-light'
                "
                class="flex flex-col rounded border"
              >
                <div
                  :class="[
                    inVIPCart(product)
                      ? 'bg-primary text-white'
                      : product.quantity === 3
                      ? 'bg-warning'
                      : product.quantity === 2
                      ? 'bg-grey-dark'
                      : 'bg-primary',
                    !inVIPCart(product) ? 'bg-opacity-50' : ''
                  ]"
                  class="p-16 font-bold leading-16"
                  v-html="product.localizedTitle"
                ></div>
                <div
                  class="p-16 text-sm leading-14 h-82"
                  v-html="product.localizedContent"
                />
                <div
                  class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                >
                  <div class="w-1/2 font-bold">
                    {{ currency }}
                    {{
                      product.price
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                  </div>
                  <div class="w-1/2 text-right">
                    <ButtonSmall
                      :type="inVIPCart(product) ? 'primary' : 'inverted'"
                      :is-loading="isLoading"
                      class="w-92"
                      @click="selectVIPProduct(product)"
                    >
                      {{
                        inVIPCart(product)
                          ? $t('weboffice.Reject')
                          : $t('weboffice.Select')
                      }}
                    </ButtonSmall>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- CONNEX PRODUCTS -->
          <div
            v-show="connexProducts.length > 0 || arrivaProducts.length > 0"
            class="flex flex-col border-b border-grey-light pt-32 pb-32"
          >
            <div class="flex flex-col lg:flex-row flex-wrap">
              <div
                v-for="(product, key) in connexProducts"
                :key="key"
                :class="
                  key === 0 ? 'lg:pr-8' : key === 2 ? 'lg:pl-8' : 'lg:px-8'
                "
                class="w-full lg:w-1/3"
              >
                <div
                  :class="
                    isConnexInCart ? 'border-primary' : 'border-grey-light'
                  "
                  class="flex flex-col rounded border"
                >
                  <div
                    :class="
                      isConnexInCart
                        ? 'bg-primary text-white'
                        : 'bg-grey-light bg-opacity-20'
                    "
                    class="p-16 font-bold leading-16"
                    v-html="product.localizedTitle"
                  ></div>
                  <div
                    class="p-16 text-sm leading-14"
                    v-html="product.localizedContent"
                  />
                  <div
                    class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                  >
                    <div class="w-1/2 font-bold">
                      {{ currency }}
                      {{
                        product.price
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div class="w-1/2 text-right">
                      <ButtonSmall
                        :type="isConnexInCart ? 'primary' : 'inverted'"
                        :is-loading="isLoading"
                        class="w-92"
                        @click="selectConnexProduct()"
                      >
                        {{
                          isConnexInCart
                            ? $t('weboffice.Reject')
                            : $t('weboffice.Select')
                        }}
                      </ButtonSmall>
                    </div>
                  </div>
                </div>
              </div>
              <!-- TICKET PRODUCTS -->
              <div
                v-for="(product, key) in ticketProducts"
                :key="key"
                :class="'lg:pl-8 lg:px-8'"
                class="w-full lg:w-1/3"
              >
                <div
                  :class="
                    isTicketInCart ? 'border-primary' : 'border-grey-light'
                  "
                  class="flex flex-col rounded border"
                >
                  <div
                    :class="
                      isTicketInCart
                        ? 'bg-primary text-white'
                        : 'bg-grey-light bg-opacity-20'
                    "
                    class="p-16 font-bold leading-16"
                    v-html="product.localizedTitle"
                  ></div>
                  <div class="flex flex-row p-16">
                    <div class="w-1/2 text-sm leading-14">
                      {{ product.localizedContent }}
                    </div>
                    <div v-if="product.quantity !== undefined" class="w-1/2">
                      <InputQuantity
                        v-if="product.quantity !== undefined"
                        v-model="product.quantity"
                        :max="
                          product.availableTicketNumber < 6
                            ? product.availableTicketNumber
                            : 6
                        "
                        @input="quantityChange(product.cartId)"
                      />
                    </div>
                  </div>

                  <div
                    class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                  >
                    <div class="w-1/2 font-bold">
                      {{ currency }}
                      {{
                        product.price
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div class="w-1/2 text-right">
                      <ButtonSmall
                        :type="
                          isOrderable
                            ? isTicketInCart
                              ? 'primary'
                              : 'inverted'
                            : ''
                        "
                        :is-loading="isLoading"
                        :is-disabled="!isOrderable(product)"
                        class="w-92"
                        @click="selectTicketProduct()"
                      >
                        {{
                          isTicketInCart
                            ? $t('weboffice.Reject')
                            : $t('weboffice.Select')
                        }}
                      </ButtonSmall>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ARRIVA PRODUCTS -->
              <div
                v-for="(product, key) in arrivaProducts"
                :key="key"
                :class="'lg:pl-8 lg:px-8'"
                class="w-full lg:w-1/3"
              >
                <div
                  :class="
                    isArrivaInCart ? 'border-primary' : 'border-grey-light'
                  "
                  class="flex flex-col rounded border"
                >
                  <div
                    :class="
                      isArrivaInCart
                        ? 'bg-primary text-white'
                        : 'bg-grey-light bg-opacity-20'
                    "
                    class="p-16 font-bold leading-16"
                    v-html="product.localizedTitle"
                  ></div>
                  <div
                    class="p-16 text-sm leading-14"
                    v-html="product.localizedContent"
                  />
                  <div
                    class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                  >
                    <div class="w-1/2 font-bold">
                      {{ currency }}
                      {{
                        product.price
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div class="w-1/2 text-right">
                      <ButtonSmall
                        :type="
                          isOrderable
                            ? isArrivaInCart
                              ? 'primary'
                              : 'inverted'
                            : ''
                        "
                        :is-loading="isLoading"
                        :is-disabled="!isOrderable(product)"
                        class="w-92"
                        @click="selectArrivaProduct()"
                      >
                        {{
                          isArrivaInCart
                            ? $t('weboffice.Reject')
                            : $t('weboffice.Select')
                        }}
                      </ButtonSmall>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row flex-wrap mt-12 -ml-8 -mr-8">
            <!-- PREMIUM STATIC PRODUCTS -->
            <div
              v-for="(product, key) in PremiumProducts"
              :key="key"
              class="w-full pb-16 lg:mb-0 lg:w-1/3 lg:px-8"
            >
              <div
                :class="
                  productInCart(product.cartId)
                    ? 'border-primary'
                    : 'border-grey-light'
                "
                class="flex flex-col rounded border"
              >
                <div
                  :class="['bg-grey-light bg-opacity-20']"
                  class="p-16 font-bold leading-16"
                  v-html="product.localizedTitle"
                ></div>
                <div class="p-16 flex flex-row text-sm leading-14 h-82">
                  <div :class="{ 'w-1/2': product.quantity !== undefined }">
                    {{ product.localizedContent }}
                  </div>
                  <div v-if="product.quantity !== undefined" class="w-1/2">
                    <InputQuantity
                      v-if="product.quantity !== undefined"
                      v-model="product.quantity"
                      @input="quantityChange(product.cartId)"
                    />
                  </div>
                </div>
                <div
                  class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                >
                  <div class="w-1/2 font-bold">
                    {{ currency }}
                    {{
                      product.price
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                  </div>
                  <div class="w-1/2 text-right">
                    <ButtonSmall
                      :type="
                        productInCart(product.cartId) ? 'primary' : 'inverted'
                      "
                      :is-disabled="!isOrderable(product)"
                      :is-loading="isLoading"
                      class="w-92"
                      @click="selectProduct(product.cartId)"
                    >
                      {{
                        productInCart(product.cartId)
                          ? $t('weboffice.Reject')
                          : $t('weboffice.Select')
                      }}
                    </ButtonSmall>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- CIS PRODUCTS -->
          <div
            v-show="cisProducts.length > 0"
            class="flex flex-col lg:flex-row flex-wrap mt-40"
          >
            <div
              v-for="(product, key) in cisProducts"
              :key="key"
              :class="key === 0 ? 'lg:pr-8' : key === 2 ? 'lg:pl-8' : 'lg:px-8'"
              class="w-full mb-16 lg:mb-0 lg:w-1/3"
            >
              <div
                :class="
                  productInCart(product.cartId)
                    ? 'border-primary'
                    : 'border-grey-light'
                "
                class="flex flex-col rounded border"
              >
                <div
                  :class="
                    productInCart(product.cartId)
                      ? 'bg-primary text-white'
                      : 'bg-grey-light bg-opacity-20'
                  "
                  class="p-16 font-bold leading-16"
                  v-html="product.localizedTitle"
                ></div>
                <div
                  class="p-16 text-sm leading-14 h-128"
                  v-html="product.localizedContent"
                />
                <div
                  class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                >
                  <div class="w-1/2 font-bold">
                    {{ currency }}
                    {{
                      product.price
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                  </div>
                  <div class="w-1/2 text-right">
                    <ButtonSmall
                      :type="
                        productInCart(product.cartId) ? 'primary' : 'inverted'
                      "
                      :is-disabled="!isOrderable(product)"
                      :is-loading="isLoading"
                      class="w-92"
                      @click="selectProduct(product.cartId)"
                    >
                      {{
                        productInCart(product.cartId)
                          ? $t('weboffice.Reject')
                          : $t('weboffice.Select')
                      }}
                    </ButtonSmall>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- PACKAGE PRODUCTS -->
          <div v-show="packageProducts.length > 0" class="flex flex-col mt-40">
            <div class="leading-16 mb-16">
              {{ $t('weboffice.Packages') }}
            </div>
            <div class="flex flex-col lg:flex-row flex-wrap">
              <div
                v-for="(product, key) in packageProducts"
                :key="key"
                :class="
                  key === 0 ? 'lg:pr-8' : key === 2 ? 'lg:pl-8' : 'lg:px-8'
                "
                class="w-full mb-16 lg:mb-0 lg:w-1/3"
              >
                <div
                  :class="
                    productInCart(product.cartId)
                      ? 'border-primary'
                      : 'border-grey-light'
                  "
                  class="flex flex-col rounded border"
                >
                  <div
                    :class="
                      productInCart(product.cartId)
                        ? 'bg-primary text-white'
                        : 'bg-grey-light bg-opacity-20'
                    "
                    class="p-16 font-bold leading-16"
                    v-html="product.localizedTitle"
                  ></div>
                  <div
                    class="p-16 text-sm leading-14"
                    v-html="product.localizedContent"
                  />
                  <div
                    class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                  >
                    <div class="w-1/2 font-bold">
                      {{ currency }}
                      {{
                        product.price
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div class="w-1/2 text-right">
                      <ButtonSmall
                        :type="
                          productInCart(product.cartId) ? 'primary' : 'inverted'
                        "
                        :is-disabled="!isOrderable(product)"
                        :is-loading="isLoading"
                        class="w-92"
                        @click="selectProduct(product.cartId)"
                      >
                        {{
                          productInCart(product.cartId)
                            ? $t('weboffice.Reject')
                            : $t('weboffice.Select')
                        }}
                      </ButtonSmall>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- OTHER PRODUCTS -->
          <div v-show="otherProducts.length > 0" class="flex flex-col">
            <div class="leading-16 mt-40 mb-16">
              {{ $t('weboffice.OtherProducts') }}
            </div>
            <div class="flex flex-col lg:flex-row flex-wrap">
              <div
                v-for="(product, key) in otherProducts"
                :key="key"
                :class="
                  key === 0 ? 'lg:pr-8' : key === 1 ? 'lg:px-8' : 'lg:pl-8'
                "
                class="w-full mb-16 lg:w-1/3"
              >
                <div
                  :class="
                    productInCart(product.cartId)
                      ? 'border-primary'
                      : 'border-grey-light'
                  "
                  class="flex flex-col rounded border"
                >
                  <div
                    :class="
                      productInCart(product.cartId)
                        ? 'bg-primary text-white'
                        : 'bg-grey-light bg-opacity-20'
                    "
                    class="p-16 font-bold leading-16"
                    v-html="product.localizedTitle"
                  ></div>
                  <div v-if="product.cartId === diamondVoucherId">
                    <div
                      class="flex flex-row justify-between items-center p-16 text-sm leading-14"
                    >
                      <div>{{ $t('general.Piece') }}</div>
                      <div class="flex flex-row items-center">
                        <ButtonSmall
                          type="inverted"
                          :is-disabled="
                            diamondVoucher <= 1 || productInCart(product.cartId)
                          "
                          @click="diamondVoucher--"
                        >
                          <i class="fal fa-minus"></i>
                        </ButtonSmall>
                        <div class="font-bold px-16 w-42 text-center">
                          {{ diamondVoucher }}
                        </div>
                        <ButtonSmall
                          type="inverted"
                          :is-disabled="productInCart(product.cartId)"
                          @click="diamondVoucher++"
                        >
                          <i class="fal fa-plus"></i>
                        </ButtonSmall>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    class="flex w-full items-center p-16 text-sm leading-14 min-height-description"
                  >
                    <div
                      class="flex flex-col"
                      v-html="
                        product.localizedContent.replace(/[<]br[^>]*[>]/gi, '')
                      "
                    ></div>
                  </div>
                  <div
                    class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                  >
                    <div class="w-1/2 font-bold">
                      {{ currency }}
                      {{
                        (product.cartId === diamondVoucherId
                          ? diamondVoucher * product.price
                          : product.price)
                          | formatNumber('0,0', {
                            thousandsSeparator: ' '
                          })
                      }}
                    </div>
                    <div class="w-1/2 text-right">
                      <ButtonSmall
                        :type="
                          productInCart(product.cartId) ? 'primary' : 'inverted'
                        "
                        :is-disabled="!isOrderable(product)"
                        :is-loading="isLoading"
                        class="w-92"
                        @click="selectProduct(product.cartId)"
                      >
                        {{
                          productInCart(product.cartId)
                            ? $t('weboffice.Reject')
                            : $t('weboffice.Select')
                        }}
                      </ButtonSmall>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full hidden flex mb-16 lg:mb-0 lg:w-1/3 lg:pl-8">
                <div
                  class="flex flex-col rounded border border-grey-light w-full"
                >
                  <div
                    class="p-16 font-bold leading-16 bg-grey-light bg-opacity-20"
                  >
                    {{ $t('weboffice.VipCycle') }}
                  </div>
                  <div
                    class="flex p-16 text-sm leading-14 justify-center items-center h-full"
                  >
                    <ButtonSmall
                      type="inverted"
                      @click="
                        $router.push(
                          localePath('/weboffice/vip-cycle/position')
                        )
                      "
                    >
                      {{ $t('weboffice.OpenVIPCycle') }}</ButtonSmall
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!stepDenied || loyaltyProducts.length > 0"
        v-show="activeTab === 2"
        class="p-16 border border-grey-light rounded-b"
      >
        <div
          v-if="hasVIPMonth"
          v-show="!stepDenied"
          class="w-full px-16 py-8 rounded bg-warning bg-opacity-50 mb-24"
        >
          <i class="fa fa-check mr-5" aria-hidden="true"></i>
          {{ $t('weboffice.HaveVIPProduct') }}
        </div>
        <div
          v-else
          v-show="!stepDenied"
          class="w-full px-16 py-8 rounded bg-danger-opaque mb-24"
        >
          <i class="fa fa-times mr-5" aria-hidden="true"></i>
          {{ $t('weboffice.NotHaveVIPProduct') }}
        </div>
        <div
          v-if="!stepDenied"
          class="flex flex-col lg:flex-row flex-wrap border-b border-grey-light pb-16"
        >
          <!-- VIP STEP PRODUCTS -->
          <div
            v-for="(product, key) in VIPStepProducts"
            :key="key"
            :class="
              key === 0 || key === 3
                ? 'lg:pr-8'
                : key === 2
                ? 'lg:pl-8'
                : 'lg:px-8'
            "
            class="w-full mb-16 lg:w-1/3"
          >
            <div
              :class="
                inVIPCart(product) ? 'border-primary' : 'border-grey-light'
              "
              class="flex flex-col rounded border"
            >
              <div
                :class="[
                  inVIPCart(product) ? 'bg-primary text-white' : '',
                  !inVIPCart(product) && product.isOrderable
                    ? 'bg-warning bg-opacity-50'
                    : ''
                ]"
                class="p-16 font-bold leading-16"
                v-html="getLocalizedVIP(product.localizedTitle)"
              ></div>
              <div
                class="p-16 text-sm leading-14 h-82"
                v-html="getLocalizedVIP(product.localizedContent)"
              />
              <div
                class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
              >
                <div class="w-1/2 font-bold">
                  {{ currency }}
                  {{
                    product.price
                      | formatNumber('0,0', {
                        thousandsSeparator: ' '
                      })
                  }}
                </div>
                <div class="w-1/2 text-right">
                  <ButtonSmall
                    :type="inVIPCart(product) ? 'primary' : 'inverted'"
                    :is-loading="isLoading"
                    :is-disabled="!product.isOrderable"
                    class="w-92"
                    @click="selectVIPProduct(product)"
                  >
                    {{
                      inVIPCart(product)
                        ? $t('weboffice.Reject')
                        : $t('weboffice.Select')
                    }}
                  </ButtonSmall>
                </div>
              </div>
              <div
                v-if="!hasVIPMonth && product.isOrderable && key !== 0"
                class="flex flex-row px-16 py-8 rounded-b bg-danger-opaque text-danger w-full"
              >
                {{ $t('weboffice.VIPProductCountdown') }}
                <CountDown :end-date="VIPDeadline" class="ml-5" />
              </div>
            </div>
          </div>
        </div>
        <!-- LOYALTY PRODUCTS -->
        <div v-if="isLoyaltyAllowed" v-show="loyaltyProducts.length > 0">
          <h3 class="mt-24 text-2x font-bold">
            {{ $t('weboffice.LoyaltyProducts') }}
          </h3>
          <div class="mt-12 flex flex-col lg:flex-row flex-wrap">
            <div
              v-for="(product, key) in loyaltyProducts"
              :key="key"
              :class="key === 0 ? 'lg:pr-8' : key === 2 ? 'lg:pl-8' : 'lg:px-8'"
              class="w-full mb-16 lg:mb-0 lg:w-1/3"
            >
              <div
                :class="
                  productInCart(product.cartId)
                    ? 'border-primary'
                    : 'border-grey-light'
                "
                class="flex flex-col rounded border"
              >
                <div
                  :class="[
                    productInCart(product.cartId)
                      ? 'bg-primary text-white'
                      : 'bg-grey-light bg-opacity-20'
                  ]"
                  class="p-16 font-bold leading-16"
                  v-html="product.localizedTitle"
                ></div>
                <div
                  class="p-16 text-sm leading-14"
                  v-html="product.localizedContent"
                />
                <div
                  class="flex flex-row p-16 border-t border-grey-light items-center bg-grey-light bg-opacity-20"
                >
                  <div class="w-1/2 font-bold">
                    {{ currency }}
                    {{
                      product.price
                        | formatNumber('0,0', {
                          thousandsSeparator: ' '
                        })
                    }}
                  </div>
                  <div class="w-1/2 text-right">
                    <ButtonSmall
                      :type="
                        productInCart(product.cartId) ? 'primary' : 'inverted'
                      "
                      :is-disabled="!isOrderable(product)"
                      :is-loading="isLoading"
                      class="w-92"
                      @click="selectProduct(product.cartId)"
                    >
                      {{
                        productInCart(product.cartId)
                          ? $t('weboffice.Reject')
                          : $t('weboffice.Select')
                      }}
                    </ButtonSmall>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PAY -->
      <div
        id="payment-details"
        class="flex items-center text-lg leading-24 font-bold mb-16 mt-40"
      >
        {{ $t('weboffice.Pay') }}
      </div>
      <CartCard
        id="billing"
        :type="'success'"
        :title="$t('weboffice.BillingData')"
        :help="$t('weboffice.BillingDataError')"
        :active="true"
        :show-chevron="false"
      >
        <div class="px-16 pt-18 pb-20 mb-4">
          <InputCheckbox v-model="billingData.saveBillingData" class="mt-12">
            <div class="text-sm leading-14 pt-2">
              {{ $t('weboffice.SaveData') }}
            </div>
          </InputCheckbox>
          <div class="mt-24 pt-24 border-t border-grey-light">
            <InputText
              v-model="billingData.name"
              :error="billingData.error.name"
              :class="'w-full sm:w-271'"
              :label="$t('weboffice.BillingName')"
            />
            <div class="flex flex-col xl:flex-row">
              <div
                class="flex flex-col sm:flex-row justify-between md:justify-start"
              >
                <InputDropdownCountry
                  v-model="billingData.country"
                  :error="billingData.error.country"
                  :label="$t('weboffice.Country')"
                  :placeholder="$t('general.PleaseSelect')"
                  class="mt-24 sm:flex-grow sm:mr-16 md:flex-initial md:w-320"
                ></InputDropdownCountry>
                <InputText
                  v-model="billingData.postalCode"
                  :error="billingData.error.postalCode"
                  :class="'w-128 mt-24 md:w-auto lg:w-128'"
                  :label="$t('weboffice.ZipCode')"
                />
              </div>
              <InputText
                v-model="billingData.city"
                :error="billingData.error.city"
                :class="'w-full mt-24 sm:w-320 xl:flex-grow xl:ml-16'"
                :label="$t('weboffice.City')"
              />
            </div>
            <InputText
              v-model="billingData.address"
              :error="billingData.error.address"
              :class="'w-full mt-24'"
              :label="$t('weboffice.Address')"
            />
            <div class="mt-24">
              <label class="text-black text-xs font-bold leading-12">
                {{ $t('weboffice.TaxNumber') }}
                <span class="text-grey-dark font-normal"
                  >({{ $t('weboffice.Optional') }})</span
                >
              </label>
              <InputText
                v-model="billingData.tax"
                :error="billingData.error.tax"
                :class="'w-216'"
                :label="''"
              />
            </div>
          </div>
        </div>
      </CartCard>
      <div class="flex flex-col mt-16">
        <div
          class="px-16 pt-16 pb-12 text-black font-bold bg-grey-light rounded-t border border-grey-light"
        >
          <div class="text-sm leading-14">
            {{ $t('weboffice.TotalPrice') }}
          </div>
          <div class="text-3x leading-20 mt-4">
            {{ currency }}
            {{
              getTotalPrice
                | formatNumber('0,0', {
                  thousandsSeparator: ' '
                })
            }}
          </div>
        </div>
        <div
          v-show="!isTicketInCart"
          class="bg-white px-16 pb-16 border-grey-light text-black border-r border-l"
        >
          <div class="flex w-full items-center justify-center">
            <div class="arrow-down border-t-grey-light"></div>
          </div>
          <label class="block text-black text-xs font-bold leading-12 mt-16">{{
            $t('general.PayWithTC')
          }}</label>
          <InputTextMask
            v-model="travelCard"
            :mask="currency + ' 99999'"
            :class="'w-full'"
            :is-dark="false"
            :is-disabled="getTotalPrice - getNotPayableTC <= 0"
            @input="changeAddedTravelCard"
          />

          <div class="text-xs mt-4 leading-12 text-grey-dark">
            {{ $t('general.CurrentTC') }}: {{ currency }}
            {{
              (getFees !== false ? Math.floor(getFees.tc.credit) : 0)
                | formatNumber('0,0', {
                  thousandsSeparator: ' '
                })
            }}
          </div>
        </div>
        <div class="bg-primary-gradient px-16 pb-20 text-white">
          <div class="flex w-full items-center justify-center">
            <div class="arrow-down border-t-white"></div>
          </div>
          <div class="text-sm leading-14 font-bold mt-16">
            {{ $t('general.PayWithTC') }}
          </div>
          <div class="text-3x leading-20 font-bold mt-4">
            {{ currency }}
            {{
              getAddedTravelCard
                | formatNumber('0,0', {
                  thousandsSeparator: ' '
                })
            }}
          </div>
          <div class="h-1 bg-white bg-opacity-30 my-12"></div>
          <div class="flex flex-row">
            <div class="flex flex-col flex-grow">
              <div class="text-sm leading-14 font-bold">
                {{ $t('general.PayWithCreditCard') }}
              </div>
              <div class="text-3x leading-20 font-bold mt-4">
                {{ currency }}
                {{
                  (getTotalPrice - getAddedTravelCard)
                    | formatNumber('0,0', {
                      thousandsSeparator: ' '
                    })
                }}
              </div>
              <div class="text-xs leading-12 text-white text-opacity-75 mt-2">
                (+ {{ currency }}
                {{
                  handlingFee
                    | formatNumber('0.00', {
                      thousandsSeparator: ' ',
                      decimalSeparator: ','
                    })
                }}
                {{ $t('general.TransactionFee') }})
              </div>
            </div>
            <div class="flex items-center">
              <div class="flex">
                <i class="text-lg fas fa-credit-card"></i>
              </div>
            </div>
          </div>
        </div>
        <div
          :class="
            getTotalPrice > 0 && !payInProgress
              ? 'bg-danger text-white'
              : 'bg-grey-light text-grey'
          "
          class="text-3x leading-20 py-14 text-center font-bold rounded-b cursor-pointer"
          @click="pay"
        >
          <div class="relative">
            <div :class="{ 'opacity-0': payInProgress }" class="static">
              {{ $t('general.Pay') }}
            </div>
            <div
              class="absolute inset-0 opacity-0"
              :class="{ 'opacity-100': payInProgress }"
            >
              <i class="fas fa-spinner-third fa-spin"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <InformativeModal
      v-show="billingDataErrorModalActive"
      :accept-button="$t('general.Ok')"
      @accept="billingDataErrorModalActive = false"
    >
      <div slot="body">
        <div class="text-lg font-bold leading-24 mb-16 text-black">
          {{ $t('weboffice.BillingDataError') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="connexVoucherPopup"
      :accept-button="$t('general.Ok')"
      @accept="connexVoucherPopup = false"
    >
      <div slot="body">
        <div class="mb-16 text-black">
          {{ $t('weboffice.connexVoucherPopup') }}
        </div>
      </div>
    </InformativeModal>
    <InformativeModal
      v-show="connexVipAmountPopup"
      :accept-button="$t('general.Ok')"
      @accept="connexVipAmountPopup = false"
    >
      <div slot="body">
        <div class="mb-16 text-black">
          {{ $t('weboffice.connexVipAmountPopup') }}
        </div>
      </div>
    </InformativeModal>
    <DecisionModal
      v-show="adfModalActive"
      with-class="w-320 md:w-650"
      :accept-button="$t('weboffice.Save')"
      :cancel-button="$t('general.Cancel')"
      :accept-button-disabled="!adfAccepted"
      @close="adfModalActive = false"
      @cancel="adfModalActive = false"
      @accept="acceptAdf"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.ADFPopupTitle') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="mt-8">
            {{ $t('weboffice.DearUser') }}
          </div>
          <div class="mt-4">
            {{ $t('weboffice.ADFPopupDesc1') }}
          </div>
          <div class="mt-4">
            {{ $t('weboffice.ADFPopupDesc2') }}
          </div>
          <article
            ref="adfContent"
            itemscope
            itemtype="http://schema.org/Article"
            class="content mt-8 overflow-y-auto h-216"
          >
            <div class="mt-8 mb-24" v-html="adfContent"></div>
          </article>
          <InputCheckbox v-model="adfAccepted" class="mt-12">
            <div class="text-sm leading-14 pt-2">
              {{ $t('weboffice.UnderstoodAccept') }}
            </div>
          </InputCheckbox>
        </div>
      </div>
    </DecisionModal>
    <DecisionModal
      v-show="loyaltyTermsModalActive"
      with-class="w-320 md:w-650"
      :accept-button="$t('general.Ok')"
      :cancel-button="$t('general.Cancel')"
      @close="loyaltyTermsModalActive = false"
      @cancel="loyaltyTermsModalActive = false"
      @accept="acceptLoyaltyTermsAdf"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.NeedDistributionRole') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="mt-8">
            {{ $t('weboffice.NeedDistributionRoleLoyaltyCycleDesc') }}
          </div>
        </div>
      </div>
    </DecisionModal>
    <DecisionModal
      v-show="vipTermsModalActive"
      with-class="w-320 md:w-650"
      :accept-button="$t('general.Ok')"
      :cancel-button="$t('general.Cancel')"
      @close="vipTermsModalActive = false"
      @cancel="vipTermsModalActive = false"
      @accept=";(enableVipModal = false), (vipTermsModalActive = false)"
    >
      <div slot="body" class="text-black">
        <div class="flex">
          <div class="flex flex-grow text-lg leading-24">
            {{ $t('weboffice.NeedDistributionRole') }}
          </div>
        </div>
        <div class="flex flex-col text-sm leading-20 mt-12 mb-12">
          <div class="mt-8">
            {{ $t('weboffice.NeedDistributionRoleVIPCycleDesc') }}
          </div>
        </div>
      </div>
    </DecisionModal>
    <NMIModal
      v-show="nmiPopupActive"
      :popup="nmiPopup"
      @close="
        nmiPopupActive = false
        nmiPopup = false
      "
    />
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingLayerWeboffice from '@/components/micro/LoadingLayerWeboffice'
import WebofficeBreadcrumb from '@/components/weboffice/WebofficeBreadcrumb'
import ButtonSmall from '@/components/micro/ButtonSmall'
import CartCard from '@/components/cart/CartCard'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputText from '@/components/micro/InputText'
import InputDropdownCountry from '@/components/micro/InputDropdownCountry'
import InformativeModal from '@/components/modal/InformativeModal'
import DecisionModal from '@/components/modal/DecisionModal'
import InputTextMask from '@/components/micro/InputTextMask'
import NMIModal from '@/components/modal/NMIModal'
import InputQuantity from '@/components/micro/InputQuantity'
import CountDown from '@/components/micro/CountDown'
import { getHandlingFee } from '@/includes/utils'
export default {
  name: 'MembershipUpgradePage',
  middleware: 'auth_needed',
  components: {
    InputTextMask,
    InputDropdownCountry,
    InputText,
    InputCheckbox,
    CartCard,
    CountDown,
    ButtonSmall,
    InputQuantity,
    WebofficeBreadcrumb,
    LoadingLayerWeboffice,
    InformativeModal,
    DecisionModal,
    NMIModal
  },
  data() {
    return {
      links: [
        { name: this.$t('weboffice.Weboffice'), link: '/weboffice/' },
        {
          name: this.$t('weboffice.PurchaseFirefliesProducts'),
          link: '/weboffice/membership-upgrade'
        },
        { name: this.$t('weboffice.PurchaseFirefliesProducts') }
      ],
      nmiPopupActive: false,
      nmiPopup: false,
      membershipUpgrade: false,
      loyaltyProducts: [],
      packageProducts: [],
      otherProducts: [],
      cisProducts: [],
      selectedProduct: [],
      countrySelect: [],
      travelCard: '0',
      billingData: {
        saveBillingData: false,
        name: '',
        country: '',
        postalCode: '',
        city: '',
        address: '',
        tax: '',
        error: {
          name: '',
          country: '',
          postalCode: '',
          city: '',
          address: '',
          tax: ''
        }
      },
      diamondVoucher: 1,
      countrySelectCodes: [],
      countrySelectIds: [],
      currency: 'EUR',
      actualCart: null,
      diamondVoucherId: 6,
      products: [],
      payInProgress: false,
      isLoading: false,
      mainProducts: [],
      billingDataErrorModalActive: false,
      defaultProductIds: [8, 9, 43, 44],
      loyaltyProductIds: [34, 35, 36],
      adfModalActive: false,
      adfContent: '',
      adfAccepted: true,
      loyaltyTermsAccepted: true,
      loyaltyTermsModalActive: false,
      vipProductInCart: false,
      productTiltList: [31, 32, 33, 14],
      VIPCart: [],
      lastNonVIPProduct: [],
      vipPosition: [],
      VIPDenied: false,
      enableVipModal: false,
      vipTermsModalActive: false,
      pvquantity: 1,
      activeTab: 1,
      hasVIPMonth: false,
      VIPDeadline: false,
      stepDenied: true,
      isConnexInCart: false,
      isArrivaInCart: false,
      isTicketInCart: false,
      connexVoucherPopup: false,
      connexVipAmountPopup: false,
      connexProducts: [],
      arrivaProducts: [],
      ticketProducts: [],
      VIPProducts: [
        {
          name: 'vip_3',
          localizedTitle: this.$t('weboffice.VIPProduct3Title'),
          localizedContent: this.$t('weboffice.VIPProduct3Content'),
          price: 3300,
          cartId: 4,
          quantity: 3
        },
        {
          name: 'vip_2',
          localizedTitle: this.$t('weboffice.VIPProduct2Title'),
          localizedContent: this.$t('weboffice.VIPProduct2Content'),
          price: 2200,
          cartId: 4,
          quantity: 2
        },
        {
          name: 'vip_1',
          localizedTitle: this.$t('weboffice.VIPProduct1Title'),
          localizedContent: this.$t('weboffice.VIPProduct1Content'),
          price: 1100,
          cartId: 4,
          quantity: 1
        }
      ],
      VIPStepProducts: [],
      PremiumProducts: [
        {
          name: 'premium_0',
          localizedTitle: this.$t('weboffice.ProductPremiumVoucher'),
          localizedContent: this.$t('weboffice.ProductPremiumVoucherContent'),
          price: 240,
          cartId: 0,
          isOrderable: false
        },
        {
          name: 'premium_1',
          localizedTitle: this.$t('weboffice.ProductPremiumBestPriceOption'),
          localizedContent: this.$t(
            'weboffice.ProductPremiumBestPriceOptionContent'
          ),
          price: 500,
          cartId: 0,
          isOrderable: false
        },
        {
          name: 'premium_2',
          localizedTitle: this.$t('weboffice.ProductDiscountPass'),
          localizedContent: this.$t('weboffice.ProductDiscountPassContent'),
          price: 900,
          cartId: 0,
          isOrderable: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['getFees', 'getAllowedGeo', 'isLoyaltyAllowed']),
    getTotalPrice() {
      let total = 0
      if (
        this.actualCart !== null &&
        this.actualCart.cart !== undefined &&
        this.actualCart.cart.length > 0 &&
        this.VIPCart.quantity === undefined &&
        !this.isConnexInCart
      ) {
        this.actualCart.cart.forEach((cartItem) => {
          const product = this.products.find((o) => o.cartId === cartItem.id)
          if (product !== undefined) {
            total += cartItem.quantity * cartItem.price
          }
        })
      }

      if (
        this.VIPCart.quantity !== undefined &&
        !this.isConnexInCart &&
        !this.isArrivaInCart &&
        !this.isTicketInCart
      ) {
        total = this.VIPCart.price
      }

      if (this.isConnexInCart) {
        total = this.connexProducts[0].price
      }

      if (this.isArrivaInCart) {
        total = this.arrivaProducts[0].price
      }

      if (this.isTicketInCart) {
        total = this.ticketProducts[0].price * this.ticketProducts[0].quantity
      }

      return total
    },
    getAddedTravelCard() {
      if (this.isTicketInCart) {
        return 0
      }
      if (this.getFees && this.getFees.tc !== undefined) {
        const tc = parseInt(
          (this.travelCard + '').replace(this.currency, '').trim()
        )
        if (isNaN(tc)) {
          return 0
        } else if (tc > this.getTotalPrice - this.getNotPayableTC) {
          return this.getTotalPrice - this.getNotPayableTC
        } else if (tc > Math.floor(this.getFees.tc.credit)) {
          return Math.floor(this.getFees.tc.credit)
        } else {
          return Math.floor(tc)
        }
      } else {
        return 0
      }
    },
    getNotPayableTC() {
      let sum = 0
      if (this.actualCart !== null && this.actualCart.cart !== undefined) {
        this.actualCart.cart.forEach((cartItem) => {
          const product = this.products.find((o) => o.cartId === cartItem.id)
          if (!product || product.travelCardBuy === false) {
            sum += parseInt(cartItem.price)
          }
        })
      }
      return sum
    }
  },
  mounted() {
    this.activeTab = 1
    if (!this.getFees.hasDistributorRight) {
      this.enableVipModal = true
    }
    this.getDetails()
    this.setUserBillingData()
  },
  methods: {
    getHandlingFee,
    updateHandling() {
      this.handlingFee = getHandlingFee(
        this.getTotalPrice - this.getAddedTravelCard,
        'mlm'
      )
    },
    quantityChange(cartId) {
      if (this.isTicketInCart) {
        this.isTicketInCart = false
        this.isTicketInCart = true
      } else if (this.productInCart(cartId)) {
        this.selectProduct(cartId)
      }

      this.updateHandling()
    },
    /** CHANGE ADDED TRAVEL CARD */
    changeAddedTravelCard() {
      let tc = this.travelCard.replace(this.currency, '').trim()
      if (tc !== '') {
        if (this.getFees.tc.credit > 0) {
          tc = parseInt(tc)
          if (isNaN(tc)) {
            this.travelCard = '0'
          } else if (tc > this.getTotalPrice - this.getNotPayableTC) {
            this.travelCard = this.getTotalPrice - this.getNotPayableTC + ''
          } else if (tc >= Math.floor(this.getFees.tc.credit)) {
            this.travelCard = Math.floor(this.getFees.tc.credit) + ''
          }
        } else {
          this.travelCard = '0'
        }
      }

      this.updateHandling()
    },
    /** PRODUCT IN CART */
    productInCart(cartId) {
      if (
        this.actualCart !== null &&
        this.actualCart.cart !== undefined &&
        this.actualCart.cart.length > 0
      ) {
        for (let i = 0; i < this.actualCart.cart.length; i++) {
          if (this.actualCart.cart[i].id === cartId) {
            return true
          }
        }
      }
      return false
    },
    /** IS ORDERABLE */
    isOrderable(product) {
      if (product.orderable !== undefined) {
        if (product.orderable === 'false') {
          return false
        } else {
          return product.orderable
        }
      }
      if (product.isOrderable !== undefined) {
        return product.isOrderable
      }
      return false
    },
    /** VALIDATE BILLING DATA */
    validateBilling() {
      let valid = true
      for (const keyError in this.billingData.error) {
        this.billingData.error[keyError] = ''
      }
      if (this.billingData.name === '') {
        this.billingData.error.name = this.$t('weboffice.BillingNameRequired')
        valid = false
      } else if (!/^[\x20-\x7E]+$/.test(this.billingData.name)) {
        this.billingData.error.name = this.$t(
          'weboffice.BillingNamePatternError'
        )

        valid = false
      }

      if (this.billingData.country === '') {
        this.billingData.error.country = this.$t('weboffice.CountryRequired')
        valid = false
      }
      if (this.billingData.postalCode === '') {
        this.billingData.error.postalCode = this.$t('weboffice.ZipCodeRequired')
        valid = false
      }
      if (this.billingData.city === '') {
        this.billingData.error.city = this.$t('weboffice.CityRequired')
        valid = false
      } else if (!/^[\x20-\x7E]+$/.test(this.billingData.city)) {
        this.billingData.error.city = this.$t('weboffice.CityPatternError')

        valid = false
      }
      if (this.billingData.address === '') {
        this.billingData.error.address = this.$t('weboffice.AddressRequired')
        valid = false
      } else if (!/^[\x20-\x7E]+$/.test(this.billingData.address)) {
        this.billingData.error.address = this.$t(
          'weboffice.AddressPatternError'
        )

        valid = false
      }
      if (this.billingData.phone === '') {
        this.billingData.error.phone = this.$t('weboffice.PhoneRequired')
        valid = false
      }
      return valid
    },
    getLocalizedVIP(text) {
      const localized = {
        loyal_vip_step1_title: this.$t('weboffice.VIPStep1Title'),
        loyal_vip_step1: this.$t('weboffice.VIPStep1Content'),
        loyal_vip_step2_title: this.$t('weboffice.VIPStep2Title'),
        loyal_vip_step2: this.$t('weboffice.VIPStep2Content'),
        loyal_vip_step3_title: this.$t('weboffice.VIPStep3Title'),
        loyal_vip_step3: this.$t('weboffice.VIPStep3Content'),
        loyal_vip_step4_title: this.$t('weboffice.VIPStep4Title'),
        loyal_vip_step4: this.$t('weboffice.VIPStep4Content'),
        loyal_vip_step5_title: this.$t('weboffice.VIPStep5Title'),
        loyal_vip_step5: this.$t('weboffice.VIPStep5Content')
      }

      return localized[text] !== undefined ? localized[text] : text
    },
    /** GET DETAILS */
    async getDetails() {
      /** VIP check **/
      try {
        this.vipPosition = await this.$store.dispatch(
          'user/getVIPCyclePosition',
          {
            availableOnly: true
          }
        )
      } catch (e) {
        console.log(e)
      }

      this.VIPDenied = false
      if (this.vipPosition.ownPositions !== undefined) {
        this.vipPosition.ownPositions.forEach((ownPosition) => {
          if (ownPosition.isEmpty === false) {
            this.VIPDenied = true
          }
        })
      }

      try {
        this.membershipUpgrade = await this.$store.dispatch(
          'user/getMembershipUpgrade',
          {
            lang: this.$i18n.locale
          }
        )
      } catch (e) {
        console.log(e)
      }

      if (this.membershipUpgrade) {
        if (
          this.membershipUpgrade.buyableProducts !== undefined &&
          this.membershipUpgrade.buyableProducts.length > 0
        ) {
          this.membershipUpgrade.buyableProducts.forEach((product) => {
            if (!this.productTiltList.includes(product.cartId)) {
              if ([31, 32, 33].includes(product.cartId)) {
                this.packageProducts.push(product)
                this.products.push(product)
              } else if ([14].includes(product.cartId)) {
                this.otherProducts.push(product)
                this.products.push(product)
              } else if (this.defaultProductIds.includes(product.cartId)) {
                if (this.membershipUpgrade.vipProducts !== undefined) {
                  this.mainProducts.push(product)
                } else {
                  this.otherProducts.push(product)
                }
                this.products.push(product)
                // Premium termékek
              } else if (product.cartId === 1 && product.type === 31) {
                this.PremiumProducts[2] = product
                this.PremiumProducts[2].localizedContent = this.$t(
                  'weboffice.ProductDiscountPassContent'
                )
                this.PremiumProducts[2].localizedTitle = this.$t(
                  'weboffice.ProductDiscountPass'
                )
                this.products.push(product)
              } else if (product.cartId === 7 && product.type === 1) {
                this.PremiumProducts[0] = product
                this.PremiumProducts[0].quantity = 1
                this.PremiumProducts[0].localizedContent = this.$t(
                  'weboffice.ProductPremiumVoucherContent'
                )
                this.PremiumProducts[0].localizedTitle = this.$t(
                  'weboffice.ProductPremiumVoucher'
                )
                this.products.push(product)
              } else if (product.cartId === 42 && product.type === 3) {
                this.PremiumProducts[1] = product
                this.PremiumProducts[1].localizedContent = this.$t(
                  'weboffice.ProductPremiumBestPriceOptionContent'
                )
                this.PremiumProducts[1].localizedTitle = this.$t(
                  'weboffice.ProductPremiumBestPriceOption'
                )
                this.products.push(product)
              } else if (product.cartId === 1 && product.type === 34) {
                product.isConnex = true
                product.localizedContent = this.$t(
                  'weboffice.ConnexProductContent'
                )
                product.localizedTitle = this.$t('weboffice.ConnexProductTitle')
                this.connexProducts.push(product)
              } else if (product.cartId === 45 && product.type === 35) {
                product.isArriva = true
                product.localizedContent = this.$t(
                  'weboffice.ArriviaProductContent'
                )
                product.localizedTitle = this.$t(
                  'weboffice.ArriviaProductTitle'
                )
                this.arrivaProducts.push(product)
              } else if (
                product.cartId === 46 &&
                product.type === 36 &&
                product.availableTicketNumber > 0
              ) {
                product.isTicket = true
                product.localizedContent = this.$t('weboffice.TicketContent')
                product.localizedTitle = this.$t('weboffice.TicketTitle')
                product.quantity = 1
                this.ticketProducts.push(product)
              }
            }
          })
          if (this.membershipUpgrade.isCisAccount) {
            this.membershipUpgrade.buyableProducts.forEach((product) => {
              if (!this.productTiltList.includes(product.cartId)) {
                if ([20, 21, 12, 13].includes(product.cartId)) {
                  this.cisProducts.push(product)
                  this.products.push(product)
                }
              }
            })
          }
        }
        if (
          this.membershipUpgrade.loyaltyProds !== undefined &&
          this.membershipUpgrade.loyaltyProds.length > 0
        ) {
          if (Array.isArray(this.membershipUpgrade.loyaltyProds)) {
            this.membershipUpgrade.loyaltyProds.forEach((product) => {
              if (!this.productTiltList.includes(product.cartId)) {
                if (this.loyaltyProductIds.includes(product.cartId)) {
                  this.loyaltyProducts.push(product)
                  this.products.push(product)
                  if (
                    this.loyaltyTermsAccepted &&
                    product.orderable === 'terms'
                  ) {
                    this.loyaltyTermsAccepted = false
                  }
                }
              }
            })
          }
          this.loyaltyProducts.reverse()
        }
        if (
          this.membershipUpgrade.vipProducts !== undefined &&
          this.membershipUpgrade.vipProducts.length > 0
        ) {
          /*
          let mediumVipProduct = this.membershipUpgrade.vipProducts.find(
            (o) => o.productId === 107
          )
          if (
            mediumVipProduct &&
            !this.membershipUpgrade.disableMedium &&
            this.getAllowedGeo
          ) {
            mediumVipProduct = {
              isVIPProduct: true,
              cartId: mediumVipProduct.itemId,
              currency: 'EUR',
              isOrderable: true,
              localizedTitle: this.$t('weboffice.VIPProductMediumTitle'),
              localizedContent: this.$t('weboffice.VIPProductMediumDesc'),
              price: mediumVipProduct.price,
              type: mediumVipProduct.type,
              travelCardBuy: mediumVipProduct.travelCardBuy
            }
            this.products.push(mediumVipProduct)
            this.mainProducts.unshift(mediumVipProduct)

          }
          */
        }

        if (
          this.membershipUpgrade.vips_step_products !== undefined &&
          this.membershipUpgrade.vips_step_products.products.length > 0
        ) {
          if (
            Array.isArray(this.membershipUpgrade.vips_step_products.products)
          ) {
            this.stepDenied = true
            this.membershipUpgrade.vips_step_products.products.forEach(
              (product) => {
                product.quantity = 1
                this.products.push(product)
                this.VIPStepProducts.push(product)
                if (product.isOrderable) {
                  this.stepDenied = false
                }
              }
            )
            this.hasVIPMonth = this.membershipUpgrade.vips_step_products.userBoughtVipStepProductAtMonth
            this.VIPDeadline = this.membershipUpgrade.vips_step_products.deadline
          }
        }
      }

      this.updateHandling()
      await this.updateCart()
    },
    /** SET USER BILLING DATA */
    async setUserBillingData() {
      let res
      try {
        res = await this.$store.dispatch('user/getPersonalData')
      } catch (e) {
        console.log(e)
      }
      if (res) {
        this.billingData.name =
          res.BILLING_NAME === null ? '' : res.BILLING_NAME
        this.billingData.country = res.BILLING_COUNTRY || ''
        this.billingData.postalCode = res.BILLING_ZIPCODE || ''
        this.billingData.city = res.BILLING_CITY || ''
        this.billingData.address = res.BILLING_STREET || ''
        this.billingData.tax = ''
        if (res.ADF_ACCEPTED === undefined || res.ADF_ACCEPTED === null) {
          this.getAdfContent()
          this.adfAccepted = false
        }
      }
    },
    async selectConnexProduct() {
      if (this.connexProducts[0].isOrderable) {
        const available = await this.$store.dispatch('user/connexAvailable')
        if (available.resp.status === 'ok') {
          this.isConnexInCart = !this.isConnexInCart
          if (this.isConnexInCart) {
            this.$scrollTo('#payment-details')
            this.isLoading = true
            if (this.lastNonVIPProduct.cartId !== undefined) {
              try {
                await this.$store.dispatch('user/removeToFFCart', {
                  id: this.lastNonVIPProduct.cartId,
                  type: this.lastNonVIPProduct.type
                })
                this.lastNonVIPProduct = []
              } catch (e) {
                this.isLoading = false
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

            this.VIPCart = []
            this.lastNonVIPProduct = []
            this.isTicketInCart = false
            await this.updateCart()
            this.isLoading = false
          }
        } else {
          this.$store.dispatch('general/showSnackbar', {
            message: this.$t('weboffice.NoMoreConnex')
          })
        }
      } else if (this.connexProducts[0].vipAmount < 1000) {
        this.connexVipAmountPopup = true
      } else if (this.connexProducts[0].liveConnexVoucher >= 2) {
        this.connexVoucherPopup = true
      } else {
        console.log('Nem rendelhető')
      }
    },
    async selectArrivaProduct() {
      if (this.arrivaProducts[0].isOrderable) {
        this.isTicketInCart = false
        this.isArrivaInCart = !this.isArrivaInCart
        if (this.isArrivaInCart) {
          this.$scrollTo('#payment-details')
          this.isLoading = true
          if (this.lastNonVIPProduct.cartId !== undefined) {
            try {
              await this.$store.dispatch('user/removeToFFCart', {
                id: this.lastNonVIPProduct.cartId,
                type: this.lastNonVIPProduct.type
              })
              this.lastNonVIPProduct = []
            } catch (e) {
              this.isLoading = false
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

          this.VIPCart = []
          this.lastNonVIPProduct = []
          await this.updateCart()
          this.isLoading = false
        }
      } else {
        console.log('Nem rendelhető')
      }
    },

    async selectTicketProduct() {
      if (this.ticketProducts[0].isOrderable) {
        this.isArrivaInCart = false
        this.isTicketInCart = !this.isTicketInCart
        if (this.isTicketInCart) {
          this.$scrollTo('#payment-details')
          this.isLoading = true
          if (this.lastNonVIPProduct.cartId !== undefined) {
            try {
              await this.$store.dispatch('user/removeToFFCart', {
                id: this.lastNonVIPProduct.cartId,
                type: this.lastNonVIPProduct.type
              })
              this.lastNonVIPProduct = []
            } catch (e) {
              this.isLoading = false
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

          this.VIPCart = []
          this.lastNonVIPProduct = []
          await this.updateCart()
          this.isLoading = false
        }
      } else {
        console.log('Nem rendelhető')
      }
    },
    /** SELECT PRODUCT */
    async selectProduct(productId) {
      this.isConnexInCart = false
      if (this.defaultProductIds.includes(productId) && !this.adfAccepted) {
        this.adfModalActive = true
      } else if (
        this.loyaltyProductIds.includes(productId) &&
        !this.loyaltyTermsAccepted
      ) {
        this.loyaltyTermsModalActive = true
      } else {
        const product = this.products.find(
          (o) => o.cartId === productId && o.type !== 34
        )
        if (product !== undefined) {
          if (!this.productInCart(product.cartId)) {
            this.$scrollTo('#payment-details')
          }
          let res
          if (this.lastNonVIPProduct.cartId !== undefined) {
            try {
              res = await this.$store.dispatch('user/removeToFFCart', {
                id: this.lastNonVIPProduct.cartId,
                type: this.lastNonVIPProduct.type
              })
              this.lastNonVIPProduct = []
            } catch (e) {
              this.isLoading = false
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

          this.lastNonVIPProduct = []
          this.isLoading = true

          if (!this.productInCart(productId)) {
            try {
              res = await this.$store.dispatch('user/addToFFCart', {
                cartId: product.cartId,
                type: product.type,
                quantity: product.quantity !== undefined ? product.quantity : 1
              })
              this.VIPCart = []
              this.lastNonVIPProduct = product
            } catch (e) {
              this.isLoading = false
              let body = await e.response
              if (body && e.response !== undefined) {
                body = await e.response.json()
                if (body.messages !== undefined) {
                  if (
                    body.messages ===
                    'only_one_small_or_big_step_product_per_months'
                  ) {
                    this.$store.dispatch('general/showSnackbar', {
                      message: this.$t(
                        'weboffice.VipOnlyOneProductPerMonthsError'
                      )
                    })
                  } else {
                    this.$store.dispatch('general/showSnackbar', {
                      message: body.messages
                    })
                  }
                }
              }
            }
          }
          if (res) {
            await this.updateCart()
            this.isLoading = false
          }
        }
        this.changeAddedTravelCard()
      }
    },
    /** CHECK VIP CART **/
    inVIPCart(product) {
      if (
        this.VIPCart.type !== 32 &&
        product.type !== 32 &&
        this.VIPCart.quantity !== undefined
      ) {
        if (this.VIPCart.quantity === product.quantity) {
          return true
        }
      } else if (
        product.type === 32 &&
        this.VIPCart.type === 32 &&
        this.VIPCart.cartId !== undefined
      ) {
        if (this.VIPCart.cartId === product.cartId) {
          return true
        }
      }
      return false
    },
    /** SELECT STATIC VIP PRODUCT */
    async selectVIPProduct(product) {
      this.isConnexInCart = false
      this.isTicketInCart = false
      this.isLoading = true
      if (this.enableVipModal) {
        this.vipTermsModalActive = true
        this.enableVipModal = false
      } else if (this.inVIPCart(product)) {
        this.VIPCart = []
      } else {
        this.$scrollTo('#payment-details')
        if (this.lastNonVIPProduct.cartId !== undefined) {
          try {
            await this.$store.dispatch('user/removeToFFCart', {
              id: this.lastNonVIPProduct.cartId,
              type: this.lastNonVIPProduct.type
            })
            this.lastNonVIPProduct = []
            await this.updateCart()
          } catch (e) {
            this.isLoading = false
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
        this.VIPCart = product
      }
      this.isLoading = false
    },
    /** PAY VIP **/
    async payVIP() {
      if (this.getTotalPrice > 0) {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billing')
        } else {
          this.payInProgress = true
          let res
          if (this.VIPCart.type === undefined) {
            try {
              res = await this.$store.dispatch('user/payVipCyclePosition', {
                uploadQuantity: this.VIPCart.quantity,
                uploadPositions: [],
                upgradePositions: false,
                itemId: this.VIPCart.cartId,
                billingCountry: this.billingData.country,
                billingCity: this.billingData.city,
                billingStreet: this.billingData.address,
                tax: this.billingData.tax,
                billingName: this.billingData.name,
                billingZip: this.billingData.postalCode,
                tc: this.travelCard.replace(this.currency, '').trim(),
                save_billing: this.billingData.saveBillingData,
                lang: this.$i18n.locale
              })
            } catch (e) {
              this.payInProgress = false
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
          } else {
            try {
              res = await this.$store.dispatch('user/payVIPStep', {
                itemId: this.VIPCart.cartId,
                type: this.VIPCart.type,
                billingCountry: this.billingData.country,
                billingCity: this.billingData.city,
                billingStreet: this.billingData.address,
                tax: this.billingData.tax,
                billingName: this.billingData.name,
                billingZip: this.billingData.postalCode,
                tc: this.travelCard.replace(this.currency, '').trim(),
                save_billing: this.billingData.saveBillingData,
                lang: this.$i18n.locale
              })
            } catch (e) {
              this.payInProgress = false
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

          if (res) {
            if (res.status === 'SAVE_BILLING_DATA_ERROR') {
              this.billingDataErrorModalActive = true
            } else {
              this.$store.commit('user/setWebOfficeMenu', false)
              if (res.status === 'SUCCESS') {
                await this.$router.push(
                  this.localePath('/weboffice/payment/success')
                )
              } else if (res.status === 'ERROR') {
                this.$store.dispatch('general/showSnackbar', {
                  message: res.error
                })
              } else if (res.status === 'FORWARD') {
                if (res.paymentType === 'NMI') {
                  this.nmiPopup = res.popupHTML
                  this.nmiPopupActive = true
                } else if (res.forwardURL !== undefined) {
                  window.location.href = res.forwardURL
                }
              }
            }

            this.payInProgress = false
          }
        }
      }
    },

    /** PAX CONNEX **/
    async payConnex() {
      if (this.getTotalPrice > 0) {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billing')
        } else {
          this.payInProgress = true
          let res
          try {
            res = await this.$store.dispatch('user/payConnexFFCart', {
              billingCountry: this.billingData.country,
              billingCity: this.billingData.city,
              billingStreet: this.billingData.address,
              tax: this.billingData.tax,
              billingName: this.billingData.name,
              billingZip: this.billingData.postalCode,
              tc: this.travelCard.replace(this.currency, '').trim(),
              save_billing: this.billingData.saveBillingData,
              lang: this.$i18n.locale
            })
          } catch (e) {
            this.payInProgress = false
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
          if (res) {
            if (res.status === 'SAVE_BILLING_DATA_ERROR') {
              this.billingDataErrorModalActive = true
            } else {
              this.$store.commit('user/setWebOfficeMenu', false)
              if (res.status === 'SUCCESS') {
                await this.$router.push(
                  this.localePath('/weboffice/payment/success')
                )
              } else if (res.status === 'FORWARD') {
                if (res.paymentType === 'NMI') {
                  this.nmiPopup = res.popupHTML
                  this.nmiPopupActive = true
                } else if (res.forwardURL !== undefined) {
                  window.location.href = res.forwardURL
                }
              } else if (res.status === 'RECURRING') {
                this.recurringPopupActive = true
                this.recurringPopup = res.popup
              }
            }

            this.payInProgress = false
          }
        }
      }
    },

    /** PAX ARRIVA **/
    async payArriva() {
      if (this.getTotalPrice > 0) {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billing')
        } else {
          this.payInProgress = true
          let res
          try {
            res = await this.$store.dispatch('user/payArrivaFFCart', {
              billingCountry: this.billingData.country,
              billingCity: this.billingData.city,
              billingStreet: this.billingData.address,
              tax: this.billingData.tax,
              billingName: this.billingData.name,
              billingZip: this.billingData.postalCode,
              tc: this.travelCard.replace(this.currency, '').trim(),
              save_billing: this.billingData.saveBillingData,
              lang: this.$i18n.locale
            })
          } catch (e) {
            this.payInProgress = false
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
          if (res) {
            if (res.status === 'SAVE_BILLING_DATA_ERROR') {
              this.billingDataErrorModalActive = true
            } else {
              this.$store.commit('user/setWebOfficeMenu', false)
              if (res.status === 'SUCCESS') {
                await this.$router.push(
                  this.localePath('/weboffice/payment/success')
                )
              } else if (res.status === 'FORWARD') {
                if (res.paymentType === 'NMI') {
                  this.nmiPopup = res.popupHTML
                  this.nmiPopupActive = true
                } else if (res.forwardURL !== undefined) {
                  window.location.href = res.forwardURL
                }
              } else if (res.status === 'RECURRING') {
                this.recurringPopupActive = true
                this.recurringPopup = res.popup
              }
            }

            this.payInProgress = false
          }
        }
      }
    },

    /** PAX TICKET **/
    async payTicket() {
      if (this.getTotalPrice > 0) {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billing')
        } else {
          this.payInProgress = true
          let res
          try {
            res = await this.$store.dispatch('user/payTicketFFCart', {
              billingCountry: this.billingData.country,
              billingCity: this.billingData.city,
              billingStreet: this.billingData.address,
              tax: this.billingData.tax,
              billingName: this.billingData.name,
              billingZip: this.billingData.postalCode,
              tc: 0,
              save_billing: this.billingData.saveBillingData,
              lang: this.$i18n.locale,
              quantity: this.ticketProducts[0].quantity
            })
          } catch (e) {
            this.payInProgress = false
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
          if (res) {
            if (res.status === 'SAVE_BILLING_DATA_ERROR') {
              this.billingDataErrorModalActive = true
            } else {
              this.$store.commit('user/setWebOfficeMenu', false)
              if (res.status === 'SUCCESS') {
                await this.$router.push(
                  this.localePath('/weboffice/payment/success')
                )
              } else if (res.status === 'FORWARD') {
                if (res.paymentType === 'NMI') {
                  this.nmiPopup = res.popupHTML
                  this.nmiPopupActive = true
                } else if (res.forwardURL !== undefined) {
                  window.location.href = res.forwardURL
                }
              } else if (res.status === 'RECURRING') {
                this.recurringPopupActive = true
                this.recurringPopup = res.popup
              }
            }

            this.payInProgress = false
          }
        }
      }
    },

    /** PAY */
    async pay() {
      if (this.VIPCart.quantity !== undefined) {
        this.payVIP()
      } else if (this.isConnexInCart) {
        this.payConnex()
      } else if (this.isArrivaInCart) {
        this.payArriva()
      } else if (this.isTicketInCart) {
        this.payTicket()
      } else if (this.getTotalPrice > 0) {
        const validBillingData = this.validateBilling()
        if (validBillingData === false) {
          this.$scrollTo('#billing')
        } else {
          this.payInProgress = true
          let res
          try {
            res = await this.$store.dispatch('user/payFFCart', {
              billingCountry: this.billingData.country,
              billingCity: this.billingData.city,
              billingStreet: this.billingData.address,
              tax: this.billingData.tax,
              billingName: this.billingData.name,
              billingZip: this.billingData.postalCode,
              tc: this.travelCard.replace(this.currency, '').trim(),
              save_billing: this.billingData.saveBillingData,
              lang: this.$i18n.locale
            })
          } catch (e) {
            this.payInProgress = false
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
          if (res) {
            if (res.status === 'SAVE_BILLING_DATA_ERROR') {
              this.billingDataErrorModalActive = true
            } else {
              this.$store.commit('user/setWebOfficeMenu', false)
              if (res.status === 'SUCCESS') {
                await this.$router.push(
                  this.localePath('/weboffice/payment/success')
                )
              } else if (res.status === 'FORWARD') {
                if (res.paymentType === 'NMI') {
                  this.nmiPopup = res.popupHTML
                  this.nmiPopupActive = true
                } else if (res.forwardURL !== undefined) {
                  window.location.href = res.forwardURL
                }
              } else if (res.status === 'RECURRING') {
                this.recurringPopupActive = true
                this.recurringPopup = res.popup
              }
            }

            this.payInProgress = false
          }
        }
      }
    },
    /** UPDATE CART */
    async updateCart() {
      try {
        this.actualCart = await this.$store.dispatch('user/getFFCart')
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
      if (
        this.actualCart &&
        this.actualCart.cart !== undefined &&
        this.actualCart.cart.length > 0
      ) {
        for (let i = 0; i < this.actualCart.cart.length; i++) {
          if (this.actualCart.cart[i].id === this.diamondVoucherId) {
            this.diamondVoucher = this.actualCart.cart[i].quantity
          }
        }
      }
      this.changeAddedTravelCard()
    },
    async getAdfContent() {
      let res
      try {
        res = await this.$store.dispatch('news/getConditionPage', {
          lang: this.$i18n.locale,
          type: 'general-terms-and-conditions-for-distributors'
        })
      } catch (e) {
        console.log(e)
      }
      if (res.body) {
        this.adfContent = res.body
      }
    },
    async acceptAdf() {
      let res
      try {
        res = await this.$store.dispatch('user/acceptADF')
      } catch (e) {
        console.log(e)
      }
      if (res && res.status === 'ok') {
        this.adfModalActive = false
        this.adfAccepted = true
      }
    },
    acceptLoyaltyTermsAdf() {
      this.loyaltyTermsAccepted = true
      this.loyaltyTermsModalActive = false
    }
  },
  head() {
    return {
      title:
        this.$t('meta.WebofficeMembershipUpgradeTitle') +
        this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.$t('meta.WebofficeMembershipUpgradeTitle') +
            this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.$t('meta.WebofficeMembershipUpgradeTitle') +
            this.$t('meta.TitleSuffix')
        }
      ]
    }
  }
}
</script>
<style scoped>
.min-height-description {
  height: 72px;
}
.arrow-down {
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 20px solid;
}
.border-t-grey-light {
  border-top-color: #e8eaec;
}
.border-t-white {
  border-top-color: #fefefe;
}
</style>
