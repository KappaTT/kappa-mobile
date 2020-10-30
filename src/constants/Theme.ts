import moment from 'moment';

export default {
  COLORS: {
    DEFAULT: '#172B4D',
    PRIMARY: moment().isSameOrBefore(moment('11/03/2020'), 'day') ? '#6665DD' : '#EB3349',
    PRIMARY_BLUE: '#5E72E4',
    PRIMARY_RED: '#EB3349',
    PRIMARY_GREEN: '#23CD97',
    SECONDARY: '#F7FAFC',
    LABEL: '#FE2472',
    INFO: '#11CDEF',
    ERROR: '#F5365C',
    SUCCESS: '#2DCE89',
    WARNING: '#FB6340',
    /*not yet changed */
    MUTED: '#ADB5BD',
    INPUT: '#DCDCDC',
    INPUT_SUCCESS: '#7BDEB2',
    INPUT_SUCCESS_LIGHT: '#D6FFED',
    INPUT_ERROR: '#FCB3A4',
    INPUT_ERROR_LIGHT: '#FFEDEB',
    ACTIVE: '#5E72E4', //same as primary
    BUTTON_COLOR: '#9C26B0', //wtf
    PLACEHOLDER: '#9FA5AA',
    SWITCH_ON: '#5E72E4',
    SWITCH_OFF: '#D4D9DD',
    GRADIENT_START: '#6B24AA',
    GRADIENT_END: '#AC2688',
    PRICE_COLOR: '#EAD5FB',
    BORDER_COLOR: '#E7E7E7',
    BLOCK: '#E7E7E7',
    ICON: '#172B4D',
    LOGIN_INPUT_ICON: '#8898AA',
    HEADER: '#525F7F',
    BORDER: '#CAD1D7',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    ROYALTY: '#613CE8',
    MAIN_GRAY: '#F3F5F9',
    ALT_ROYAL: '#7738EB',
    GRAY: '#9D9D9D',
    DARK_GRAY: '#4B4B4B',
    LIGHT_GRAY: '#E1E4E8',
    LIGHT_BORDER: '#E3E8EC',
    SUPER_LIGHT_GRAY: '#F6F6F6',
    SUPER_LIGHT_BLUE_GRAY: '#F5F6F9',
    GRAY_BLUE: '#30363D',
    CHERRY_GRADIENT_END: '#EB3349',
    RED_GRADIENT_END: '#F5317F',
    YELLOW_GRADIENT_END: '#FF8359'
  },
  GRADIENT: {
    CHERRY: ['#F45C43', '#EB3349'],
    RED: ['#FF7C6E', '#F5317F'],
    YELLOW: ['#FFDF40', '#FF8359'],
    GRAY: ['#B6B6B6', '#494949'],
    BLUE: ['#59C2FF', '#1270E3'],
    LIGHT_BLUE: ['#17BDEA', '#6078EA']
  }
};
