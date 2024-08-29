<template>
  <main class="max-w-xl mx-auto m-32">
    <h2 class="font-bold">Small Button</h2>
    <div class="my-10">
      <ButtonSmall type="primary">
        Button Primary
      </ButtonSmall>
      <ButtonSmall type="primary" :is-loading="true">
        Button Primary
      </ButtonSmall>
      <ButtonSmall type="primary" :is-disabled="true">
        Button Primary
      </ButtonSmall>
    </div>
    <div class="my-10">
      <ButtonSmall type="warning">
        Button Warning
      </ButtonSmall>
      <ButtonSmall type="warning" :is-loading="true">
        Button Warning
      </ButtonSmall>
      <ButtonSmall type="warning" :is-disabled="true">
        Button Warning
      </ButtonSmall>
    </div>
    <div class="my-10">
      <ButtonSmall type="danger">
        Button Danger
      </ButtonSmall>
      <ButtonSmall type="danger" :is-loading="true">
        Button Danger
      </ButtonSmall>
      <ButtonSmall type="danger" :is-disabled="true">
        Button Danger
      </ButtonSmall>
    </div>
    <div class="my-10">
      <ButtonSmall type="inverted">
        Button Inverted
      </ButtonSmall>
      <ButtonSmall type="inverted" :is-loading="true">
        Button Inverted
      </ButtonSmall>
      <ButtonSmall type="inverted" :is-disabled="true">
        Button Inverted
      </ButtonSmall>
    </div>

    <h2 class="font-bold mt-32">Medium Button</h2>
    <div class="my-10">
      <ButtonMedium>
        Button Primary
      </ButtonMedium>
      <ButtonMedium type="primary" :is-loading="true">
        Button Primary
      </ButtonMedium>
      <ButtonMedium :is-disabled="true">
        Button Primary
      </ButtonMedium>
    </div>
    <div class="my-10">
      <ButtonMedium type="warning">
        Button Warning
      </ButtonMedium>
      <ButtonMedium type="warning" :is-loading="true">
        Button Warning
      </ButtonMedium>
      <ButtonMedium type="warning" :is-disabled="true">
        Button Warning
      </ButtonMedium>
    </div>
    <div class="my-10">
      <ButtonMedium type="danger">
        Button Danger
      </ButtonMedium>
      <ButtonMedium type="danger" :is-loading="true">
        Button Danger
      </ButtonMedium>
      <ButtonMedium type="danger" :is-disabled="true">
        Button Danger
      </ButtonMedium>
    </div>
    <div class="my-10">
      <ButtonMedium type="inverted">
        Button Inverted
      </ButtonMedium>
      <ButtonMedium type="inverted" :is-loading="true">
        Button Inverted
      </ButtonMedium>
      <ButtonMedium type="inverted" :is-disabled="true">
        Button Inverted
      </ButtonMedium>
    </div>

    <h2 class="font-bold mt-32">Button Group</h2>
    <div class="my-10">
      <ButtonGroup :buttons="buttons1" />
    </div>
    <div class="my-10">
      <ButtonGroup :buttons="buttons2" />
    </div>
    <div class="my-10">
      <ButtonGroup :buttons="buttons3" />
    </div>
    <div class="my-10">
      <ButtonGroup :buttons="buttons4" />
    </div>

    <h2 class="font-bold mt-32">Checkbox</h2>
    <div class="my-10">
      <InputCheckbox v-model="checkbox1">
        Text option 1
      </InputCheckbox>
    </div>
    <div class="my-10">
      <InputCheckbox v-model="checkbox2">
        Text option 2
      </InputCheckbox>
    </div>
    <div class="my-10">
      <InputCheckbox v-model="checkbox3" :has-error="true">
        Text option 3
      </InputCheckbox>
    </div>
    <div class="my-10">
      <InputCheckbox v-model="checkbox4" :is-disabled="true">
        Text option 4
      </InputCheckbox>
    </div>
    <div class="my-10">
      <InputCheckbox v-model="checkbox5" :is-disabled="true">
        Text option 5
      </InputCheckbox>
    </div>

    <h2 class="font-bold mt-32">Radio</h2>
    <div class="my-10">
      <InputRadio v-model="radio1" :label="'Text option 1'" :selected="'1'" />
    </div>
    <div class="my-10">
      <InputRadio v-model="radio1" :label="'Text option 2'" :selected="'2'" />
    </div>
    <div class="my-10">
      <InputRadio
        v-model="radio1"
        :label="'Text option 3'"
        :has-error="true"
        :selected="'3'"
      />
    </div>
    <div class="my-10">
      <InputRadio
        v-model="radio2"
        :label="'Text option 1'"
        :selected="'1'"
        :is-disabled="true"
        :name="'disabled'"
      />
    </div>
    <div class="my-10">
      <InputRadio
        v-model="radio2"
        :label="'Text option 2'"
        :selected="'2'"
        :is-disabled="true"
        :name="'disabled'"
      />
    </div>

    <h2 class="font-bold mt-32">Toggle</h2>
    <div class="my-10">
      <InputToggle v-model="toggle1" :label="'Text option 1'" />
    </div>
    <div class="my-10">
      <InputToggle v-model="toggle2" :label="'Text option 2'" />
    </div>
    <div class="my-10">
      <InputToggle
        v-model="toggle3"
        :label="'Text option 3'"
        :has-error="true"
      />
    </div>
    <div class="my-10">
      <InputToggle
        v-model="toggle4"
        :label="'Text option 4'"
        :is-disabled="true"
      />
    </div>
    <div class="my-10">
      <InputToggle
        v-model="toggle5"
        :label="'Text option 5'"
        :is-disabled="true"
      />
    </div>

    <h2 class="font-bold mt-32 mb-12">Input Text</h2>
    <div class="my-16">
      <InputText
        v-model="text1"
        :label="'Text input 1'"
        :placeholder="'Type here'"
        :helper="'Helper text 1'"
      />
    </div>
    <div class="my-16">
      <InputText
        v-model="text2"
        :label="'Text input 2'"
        :placeholder="'Type here'"
        :helper="'Helper text 2'"
      />
    </div>
    <div class="my-16">
      <InputText
        v-model="text3"
        :label="'Text input 3'"
        :placeholder="'Type here'"
        :helper="'Helper text 3'"
        :error="'Error text'"
      />
    </div>
    <div class="my-16">
      <InputText
        v-model="text4"
        :label="'Text input 4'"
        :placeholder="'Type here'"
        :helper="'Helper text 4'"
        :is-disabled="true"
      />
    </div>
    <div class="my-16">
      <InputText
        v-model="text5"
        :label="'Text input 5'"
        :placeholder="'Type here'"
        :helper="'Helper text 5'"
        :is-disabled="true"
      />
    </div>

    <h2 class="font-bold mt-32 mb-12">Input Dropdown</h2>
    <div class="my-16">
      <InputDropdown
        v-model="dropdown1index"
        :values="dropdownValues"
        :label="'Dropdown 1'"
        :placeholder="'Select option'"
        :helper="'Helper text 1'"
      />
    </div>
    <div class="my-16">
      <InputDropdown
        v-model="dropdown2index"
        :values="dropdownValues"
        :label="'Dropdown 2'"
        :placeholder="'Select option'"
        :helper="'Helper text 2'"
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
      />
    </div>
    <div class="mt-16">
      <InputDropdown
        v-model="dropdown5index"
        :values="dropdownValues"
        :label="'Dropdown 5'"
        :placeholder="'Select option'"
        :helper="'Helper text 5'"
        :is-disabled="true"
      />
    </div>
    <div class="my-16 mb-256">
      <InputDropdown
        v-model="dropdown6index"
        :values="dropdownValuesMore"
        :label="'Dropdown 6'"
        :placeholder="'Select option'"
        :helper="'Helper text 6'"
      />
    </div>
    <div class="mb-1"></div>
  </main>
</template>

<script>
import ButtonSmall from '@/components/micro/ButtonSmall'
import ButtonMedium from '@/components/micro/ButtonMedium'
import ButtonGroup from '@/components/micro/ButtonGroup'
import InputCheckbox from '@/components/micro/InputCheckbox'
import InputRadio from '@/components/micro/InputRadio'
import InputToggle from '@/components/micro/InputToggle'
import InputText from '@/components/micro/InputText'
import InputDropdown from '@/components/micro/InputDropdown'

export default {
  name: 'MicrocomponentExamplesPage',
  components: {
    ButtonSmall,
    ButtonMedium,
    ButtonGroup,
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
      dropdown6index: false,
      dropdownValues: ['Option 1', 'Option 2', 'Option 3'],
      dropdownValuesMore: [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Option 5',
        'Option 6',
        'Option 7',
        'Option 8',
        'Option 9',
        'Option 10'
      ],
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
      checkbox5: true,
      buttons1: [
        {
          text: 'Button 1',
          action: () => {
            console.log('button 1 pressed')
          },
          active: false
        },
        {
          text: 'Button 2',
          action: () => {
            console.log('button 2 pressed')
          },
          active: false
        }
      ],
      buttons2: [
        {
          text: 'Button 1',
          action: () => {
            console.log('button 1 pressed')
          },
          active: true
        },
        {
          text: 'Button 2',
          action: () => {
            console.log('button 2 pressed')
          },
          active: false
        },
        {
          text: 'Button 3',
          action: () => {
            console.log('button 3 pressed')
          },
          active: false
        }
      ],
      buttons3: [
        {
          text: 'Button 1',
          action: () => {
            console.log('button 1 pressed')
          },
          active: false
        },
        {
          text: 'Button 2',
          action: () => {
            console.log('button 2 pressed')
          },
          active: true
        },
        {
          text: 'Button 3',
          action: () => {
            console.log('button 3 pressed')
          },
          active: false
        }
      ],
      buttons4: [
        {
          text: 'Button 1',
          action: () => {
            console.log('button 1 pressed')
          },
          active: false
        },
        {
          text: 'Button 2',
          action: () => {
            console.log('button 2 pressed')
          },
          active: false
        },
        {
          text: 'Button 3',
          action: () => {
            console.log('button 3 pressed')
          },
          active: true
        }
      ]
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
