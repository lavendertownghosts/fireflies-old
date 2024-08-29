const DefaultSection = {
  name: 'default-section',
  props: {
    /** @type ResultSection */
    section: { type: Object, required: true },
    currentIndex: {
      type: [Number, String],
      required: false,
      default: Infinity
    },
    renderSuggestion: { type: Function, required: false },
    normalizeItemFunction: { type: Function, required: true }
  },
  data() {
    return {
      _currentIndex: this.currentIndex
    }
  },
  computed: {
    list() {
      // eslint-disable-next-line prefer-const
      let { limit, data } = this.section
      if (data.length < limit) {
        limit = data.length
      }
      return data.slice(0, limit)
    }
  },
  methods: {
    getItemIndex(i) {
      return this.section.start_index + i
    },
    getItemByIndex(i) {
      return this.section.data[i]
    },
    onMouseEnter(event) {
      const idx = parseInt(
        event.currentTarget.getAttribute('data-suggestion-index')
      )
      this._currentIndex = idx
      this.$emit('updateCurrentIndex', idx)
    },
    onMouseLeave() {
      this.$emit('updateCurrentIndex', null)
    }
  },
  // eslint-disable-next-line no-unused-vars
  render(h) {
    const slots = {
      beforeSection: this.$scopedSlots[`before-section-${this.section.name}`],
      afterSectionDefault: this.$scopedSlots[`after-section`],
      afterSectionNamed: this.$scopedSlots[`after-section-${this.section.name}`]
    }

    const beforeClassName = `autosuggest__results-before autosuggest__results-before--${this.section.name}`
    const before =
      (slots.beforeSection &&
        slots.beforeSection({
          section: this.section,
          className: beforeClassName
        })) ||
      []

    return h(
      'ul',
      {
        attrs: {
          role: 'listbox',
          'aria-labelledby': 'autosuggest',
          ...this.section.ulAttributes
        },
        class: this.section.ulClass
      },
      [
        (before[0] && before[0]) ||
          (this.section.label && (
            <li class={beforeClassName}>{this.section.label}</li>
          )) ||
          '',
        this.list.map((val, key) => {
          const item = this.normalizeItemFunction(
            this.section.name,
            this.section.type,
            this.section.label,
            this.section.liClass,
            val
          )
          const itemIndex = this.getItemIndex(key)
          const isHighlighted =
            this._currentIndex === itemIndex ||
            parseInt(this.currentIndex) === itemIndex

          return h(
            'li',
            {
              attrs: {
                role: 'option',
                'data-suggestion-index': itemIndex,
                'data-section-name': item.name,
                id: 'autosuggest__results-item--' + itemIndex,
                ...item.liAttributes
              },
              key: itemIndex,
              class: {
                'autosuggest__results-item--highlighted bg-primary-opaque': isHighlighted,
                'autosuggest__results-item border-b border-grey-light last:border-b-0 cursor-pointer': true,
                ...item.liClass
              },
              on: {
                mouseenter: this.onMouseEnter,
                mouseleave: this.onMouseLeave
              }
            },
            [
              this.renderSuggestion
                ? this.renderSuggestion(item)
                : this.$scopedSlots.default &&
                  this.$scopedSlots.default({
                    _key: key,
                    suggestion: item
                  })
            ]
          )
        }),
        slots.afterSectionDefault &&
          slots.afterSectionDefault({
            section: this.section,
            className: `autosuggest__results-after autosuggest__results-after--${this.section.name}`
          }),
        slots.afterSectionNamed &&
          slots.afterSectionNamed({
            section: this.section,
            className: `autosuggest__results_after autosuggest__results-after--${this.section.name}`
          })
      ]
    )
  }
}

export default DefaultSection
