module.exports = {
  variants: {
    padding: ['responsive', 'odd', 'even', 'last', 'first'],
    backgroundColor: [
      'responsive',
      'hover',
      'focus',
      'active',
      'disabled',
      'even'
    ],
    opacity: ['hover', 'focus', 'active', 'disabled'],
    backgroundOpacity: ['active', 'even'],
    textColor: [
      'responsive',
      'hover',
      'focus',
      'active',
      'visited',
      'disabled'
    ],
    borderColor: [
      'responsive',
      'hover',
      'focus',
      'active',
      'visited',
      'disabled'
    ],
    borderWidth: ['responsive', 'last', 'first'],
    borderRadius: ['responsive', 'last', 'first']
  },
  theme: {
    screens: {
      sm: '520px',
      md: '772px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1920px'
    },
    fontFamily: {
      body: ['Nunito', 'nunito', 'sans-serif']
    },
    fontSize: {
      '3xs': '8px',
      '2xs': '10px',
      xs: '12px',
      sm: '14px',
      base: '16px',
      '2x': '18px',
      '3x': '20px',
      lg: '24px',
      xl: '32px',
      '2xl': '40px',
      '3xl': '56px',
      '4xl': '64px'
    },
    colors: {
      black: {
        default: '#393E46',
        'light-opaque': 'rgba(57, 62, 70, .15)',
        opaque: 'rgba(57, 62, 70, .5)'
      },
      white: {
        default: '#FFFFFF',
        'lightest-opaque': 'rgba(255, 255, 255, .1)',
        'lighter-opaque': 'rgba(255, 255, 255, .25)',
        opaque: 'rgba(255, 255, 255, .5)'
      },
      grey: {
        lighter: '#F7F7F7',
        light: '#E8EAEC',
        default: '#CBCBCB',
        dark: '#6A727F',
        opaque: 'rgba(232, 234, 236, .5)',
        'lighter-opaque': 'rgba(232,234,236, .2)'
      },
      primary: {
        lighter: '#43E4EE',
        light: '#0ACDD6',
        default: '#00ADB5',
        dark: '#008C92',
        opaque: 'rgba(0, 173, 181, 0.1)'
      },
      warning: {
        light: '#FFDB6A',
        default: '#FFC100',
        dark: '#FF9E00',
        opaque: '#FFECB2'
      },
      danger: {
        light: '#FF8282',
        default: '#FC3C3C',
        dark: '#CF1313',
        opaque: 'rgba(252, 60, 60, 0.1)'
      },
      pink: {
        light: '#FFFDF9',
        default: '#FFF4E0',
        dark: '#FFE4B2'
      },
      gold: {
        default: '#DCAB6C'
      },
      premium: {
        default: '#D1A91B'
      },
      landingPrimary: {
        default: '#00939C'
      },
      landingGrey: {
        default: '#525252'
      },
      landingYellow: {
        default: '#f4b50d'
      },
      landingSecondary: {
        default: '#28758d'
      },
      landingTertiary: {
        default: '#17527f'
      },
      landingButtonBackground: {
        default: '#9A9A9A80'
      }
    },
    spacing: {
      '0': '0',
      '1': '1px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '5': '5px',
      '6': '6px',
      '7': '7px',
      '8': '8px',
      '9': '9px',
      '10': '10px',
      '11': '11px',
      '12': '12px',
      '13': '13px',
      '14': '14px',
      '15': '15px',
      '16': '16px',
      '18': '18px',
      '20': '20px',
      '21': '21px',
      '24': '24px',
      '30': '30px',
      '32': '32px',
      '34': '34px',
      '40': '40px',
      '42': '42px',
      '48': '48px',
      '52': '52px',
      '56': '56px',
      '60': '60px',
      '64': '64px',
      '70': '70px',
      '72': '72px',
      '82': '82px',
      '84': '84px',
      '88': '88px',
      '92': '92px',
      '100': '100px',
      '128': '128px',
      '177': '177px',
      '216': '216px',
      '240': '240px',
      '256': '256px',
      '271': '271px',
      '288': '288px',
      '304': '304px',
      '320': '320px',
      '504': '504px',
      '650': '650px'
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      default: '4px',
      full: '9999px'
    },
    lineHeight: {
      '8': '8px',
      '10': '10px',
      '12': '12px',
      '14': '14px',
      '16': '16px',
      '18': '18px',
      '20': '20px',
      '22': '22px',
      '24': '24px',
      '26': '26px',
      '32': '32px',
      '36': '36px',
      '40': '40px',
      '56': '56px',
      '70': '70px'
    },
    opacity: {
      '0': '0',
      '10': '.1',
      '20': '.2',
      '25': '.25',
      '30': '.3',
      '40': '.4',
      '50': '.5',
      '60': '.6',
      '70': '.7',
      '75': '.75',
      '80': '.8',
      '90': '.9',
      '100': '1'
    },
    textOpacity: {
      '0': '0',
      '10': '.1',
      '20': '.2',
      '25': '.25',
      '30': '.3',
      '40': '.4',
      '50': '.5',
      '60': '.6',
      '70': '.7',
      '75': '.75',
      '80': '.8',
      '90': '.9',
      '100': '1'
    },
    backgroundOpacity: {
      '0': '0',
      '10': '.1',
      '20': '.2',
      '25': '.25',
      '30': '.3',
      '40': '.4',
      '50': '.5',
      '60': '.6',
      '70': '.7',
      '75': '.75',
      '80': '.8',
      '90': '.9',
      '100': '1'
    },
    extend: {
      boxShadow: {
        drop: '0px 5px 10px rgba(0, 0, 0, 0.15)',
        list: '0px 8px 10px rgba(0, 0, 0, 0.15)'
      },
      minWidth: {
        xl: '1280px',
        'grid-xs': '228px',
        'grid-sm': '236px',
        'grid-md': '288px'
      },
      maxWidth: {
        'almost-full': '85%',
        'grid-sm': '236px',
        'grid-md': '288px'
      },
      transitionProperty: {
        height: 'height'
      },
      width: {
        'grid-sm': '236px',
        'grid-md': '288px',
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
        '1/8': '12.5%'
      },
      cursor: {
        help: 'help'
      }
    }
  },
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js',
      'includes/*.js'
    ],
    options: {
      whitelist: ['vue-map'],
      whitelistPatterns: [/fa.*/]
    }
  }
}
