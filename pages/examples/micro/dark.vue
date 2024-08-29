<template>
  <main class="max-w-xl mx-auto p-32 bg-black">
    <h2 class="font-bold mt-32 text-white">Checkbox</h2>
    <div class="my-10">
      <InputCheckbox v-model="checkbox1" :is-dark="true">
        Text option 1
      </InputCheckbox>
    </div>
    <div class="my-10">
      <InputCheckbox v-model="checkbox2" :is-dark="true">
        Text option 2
      </InputCheckbox>
    </div>
    <div class="my-10">
      <InputCheckbox v-model="checkbox3" :has-error="true" :is-dark="true">
        Text option 3
      </InputCheckbox>
    </div>
    <div class="my-10">
      <InputCheckbox v-model="checkbox4" :is-disabled="true" :is-dark="true">
        Text option 4
      </InputCheckbox>
    </div>
    <div class="my-10">
      <InputCheckbox v-model="checkbox5" :is-disabled="true" :is-dark="true">
        Text option 5
      </InputCheckbox>
    </div>

    <h2 class="font-bold mt-32 text-white">Radio</h2>
    <div class="my-10">
      <InputRadio
        v-model="radio1"
        :label="'Text option 1'"
        :selected="'1'"
        :is-dark="true"
      />
    </div>
    <div class="my-10">
      <InputRadio
        v-model="radio1"
        :label="'Text option 2'"
        :selected="'2'"
        :is-dark="true"
      />
    </div>
    <div class="my-10">
      <InputRadio
        v-model="radio1"
        :label="'Text option 3'"
        :has-error="true"
        :selected="'3'"
        :is-dark="true"
      />
    </div>
    <div class="my-10">
      <InputRadio
        v-model="radio2"
        :label="'Text option 1'"
        :selected="'1'"
        :is-disabled="true"
        :name="'disabled'"
        :is-dark="true"
      />
    </div>
    <div class="my-10">
      <InputRadio
        v-model="radio2"
        :label="'Text option 2'"
        :selected="'2'"
        :is-disabled="true"
        :name="'disabled'"
        :is-dark="true"
      />
    </div>

    <h2 class="font-bold mt-32 text-white">Toggle</h2>
    <div class="my-10">
      <InputToggle v-model="toggle1" :label="'Text option 1'" :is-dark="true" />
    </div>
    <div class="my-10">
      <InputToggle v-model="toggle2" :label="'Text option 2'" :is-dark="true" />
    </div>
    <div class="my-10">
      <InputToggle
        v-model="toggle3"
        :label="'Text option 3'"
        :has-error="true"
        :is-dark="true"
      />
    </div>
    <div class="my-10">
      <InputToggle
        v-model="toggle4"
        :label="'Text option 4'"
        :is-disabled="true"
        :is-dark="true"
      />
    </div>
    <div class="my-10">
      <InputToggle
        v-model="toggle5"
        :label="'Text option 5'"
        :is-disabled="true"
        :is-dark="true"
      />
    </div>

    <h2 class="font-bold mt-32 mb-12 text-white">Input Text</h2>
    <div class="my-16">
      <InputText
        v-model="text1"
        :label="'Text input 1'"
        :placeholder="'Type here'"
        :helper="'Helper text 1'"
        :is-dark="true"
      />
    </div>
    <div class="my-16">
      <InputText
        v-model="text2"
        :label="'Text input 2'"
        :placeholder="'Type here'"
        :helper="'Helper text 2'"
        :is-dark="true"
      />
    </div>
    <div class="my-16">
      <InputText
        v-model="text3"
        :label="'Text input 3'"
        :placeholder="'Type here'"
        :helper="'Helper text 3'"
        :error="'Error text'"
        :is-dark="true"
      />
    </div>
    <div class="my-16">
      <InputText
        v-model="text4"
        :label="'Text input 4'"
        :placeholder="'Type here'"
        :helper="'Helper text 4'"
        :is-disabled="true"
        :is-dark="true"
      />
    </div>
    <div class="my-16">
      <InputText
        v-model="text5"
        :label="'Text input 5'"
        :placeholder="'Type here'"
        :helper="'Helper text 5'"
        :is-disabled="true"
        :is-dark="true"
      />
    </div>

    <h2 class="font-bold mt-32 mb-12 text-white">Input Dropdown</h2>
    <div class="my-16">
      <InputDropdown
        v-model="dropdown1index"
        :values="dropdownValues"
        :label="'Dropdown 1'"
        :placeholder="'Select option'"
        :helper="'Helper text 1'"
        :is-dark="true"
      />
    </div>
    <div class="my-16">
      <InputDropdown
        v-model="dropdown2index"
        :values="dropdownValues"
        :label="'Dropdown 2'"
        :placeholder="'Select option'"
        :helper="'Helper text 2'"
        :is-dark="true"
      />
    </div>
    <div class="my-16">
      <InputDropdown
        v-model="dropdown3index"
        :values="dropdownValues"
        :label="'Dropdown 3'"
        :placeholder="'Select option'"
        :helper="'Helper text 3'"
        :error="'Error text'"
        :is-dark="true"
      />
    </div>
    <div class="my-16">
      <InputDropdown
        v-model="dropdown4index"
        :values="dropdownValues"
        :label="'Dropdown 4'"
        :placeholder="'Select option'"
        :helper="'Helper text 4'"
        :is-disabled="true"
        :is-dark="true"
      />
    </div>
    <div class="mt-16 mb-256">
      <InputDropdown
        v-model="dropdown5index"
        :values="dropdownValues"
        :label="'Dropdown 5'"
        :placeholder="'Select option'"
        :helper="'Helper text 5'"
        :is-disabled="true"
        :is-dark="true"
      />
    </div>
  </main>
</template>

<script>
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputRadio from '@/components/micro/InputRadio'
import InputToggle from '@/components/micro/InputToggle'
import InputText from '@/components/micro/InputText'
import InputDropdown from '@/components/micro/InputDropdown'

export default {
  name: 'MicrocomponentExamplesPage',
  components: {
    InputCheckbox,
    InputRadio,
    InputToggle,
    InputText,
    InputDropdown
  },
  data() {
    return {
      dropdown1index: false,
      dropdown2index: 1,
      dropdown3index: false,
      dropdown4index: false,
      dropdown5index: 2,
      dropdownValues: ['Option 1', 'Option 2', 'Option 3'],
      text1: '',
      text2: 'Text',
      text3: '',
      text4: '',
      text5: 'Text',
      toggle1: false,
      toggle2: true,
      toggle3: false,
      toggle4: false,
      toggle5: true,
      radio1: '2',
      radio2: '2',
      checkbox1: false,
      checkbox2: true,
      checkbox3: false,
      checkbox4: false,
      checkbox5: true
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
</style>
