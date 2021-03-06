// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import VueResource from 'vue-resource'
import VueClipboards from 'vue-clipboards'
import Vuex from 'vuex'
import VueMaterial from 'vue-material'
import VueHazeServerApi from './lib/adamantServerApi'
import createPersistedState from 'vuex-persistedstate'

import 'vue-material/dist/vue-material.css'

Vue.use(Vuex)
Vue.use(VueMaterial)
Vue.use(VueResource)
Vue.use(VueClipboards)
Vue.use(VueI18n)
Vue.use(VueHazeServerApi)

Vue.config.productionTip = false

var messages = require('./i18n').default

var i18n = new VueI18n({
  locale: 'en', // set locale
  messages // set locale messages
})

Vue.material.registerTheme({
  default: {
    primary: {
      color: 'light-green',
      hue: 700
    },
    accent: 'red'
  },
  teal: {
    primary: 'blue',
    accent: 'pink'
  },
  purple: {
    primary: 'purple',
    accent: 'orange'
  }
})

const store = new Vuex.Store({
  state: {
    address: '',
    passPhrase: '',
    connectionString: '',
    balance: 0,
    is_new_account: false,
    ajaxIsOngoing: false,
    firstChatLoad: true,
    lastErrorMsg: '',
    transactions: {},
    showPanel: false,
    showBottom: true,
    partnerName: '',
    partnerDisplayName: '',
    partners: {},
    chats: {},
    lastChatHeight: 0,
    currentChat: false
  },
  mutations: {
    save_passphrase (state, payload) {
      state.passPhrase = payload.passPhrase
    },
    ajax_start (state) {
      state.ajaxIsOngoing = true
    },
    ajax_end (state) {
      state.ajaxIsOngoing = false
    },
    ajax_end_with_error (state) {
      state.ajaxIsOngoing = false
      state.lastErrorMsg = 'CONNECT PROBLEM'
    },
    send_error (state, payload) {
      state.lastErrorMsg = payload.msg
    },
    logout (state) {
      state.passPhrase = ''
      state.address = ''
      state.balance = 0
      state.is_new_account = false
      state.showPanel = false
      state.showBottom = true
      state.transactions = {}
      state.chats = {}
      state.currentChat = false
      state.firstChatLoad = true
      state.lastChatHeight = 0
      state.partnerDisplayName = ''
      window.publicKey = false
      window.privateKey = false
      window.secretKey = false
//      state.partners = {}
    },
    login (state, payload) {
      state.address = payload.address
      if (payload.passPhrase) {
        state.passPhrase = payload.passPhrase
      }
      state.balance = payload.balance
      if (payload.is_new_account) {
        state.is_new_account = payload.is_new_account
      }
    },
    change_partner_name (state, payload) {
      if (state.partnerName) {
        state.partners[state.partnerName] = payload
        state.partnerDisplayName = payload
      }
    },
    transaction_info (state, payload) {
      Vue.set(state.transactions, payload.id, payload)
    },
    connect (state, payload) {
      state.connectionString = payload.string
    },
    select_chat (state, payload) {
      state.currentChat = state.chats[payload]
      Vue.set(state.currentChat, messages, state.chats[payload].messages)
      state.partnerName = payload
      state.partnerDisplayName = ''
      if (state.partners[payload]) {
        state.partnerDisplayName = state.partners[payload]
      }
      state.showPanel = true
      state.showBottom = false
    },
    leave_chat (state, payload) {
      state.showPanel = false
      state.partnerName = ''
      state.partnerDisplaName = ''
      state.showBottom = true
    },
    have_loaded_chats (state) {
      state.firstChatLoad = false
    },
    create_chat (state, payload) {
      var partner = payload
      var currentDialogs = state.chats[partner]
      if (!currentDialogs) {
        currentDialogs = {
          partner: partner,
          messages: {},
          last_message: {}
        }
      }
      Vue.set(state.chats, partner, currentDialogs)
    },
    add_chat_message (state, payload) {
      state.firstChatLoad = false
      var me = state.address
      var partner = ''
      var direction = 'from'
      if (payload.recipientId === me) {
        direction = 'to'
        partner = payload.senderId
      } else {
        partner = payload.recipientId
      }
      var currentDialogs = state.chats[partner]
      if (!currentDialogs) {
        currentDialogs = {
          partner: partner,
          messages: {},
          last_message: {}
        }
      }
      if (currentDialogs.last_message.timestamp < payload.timestamp || !currentDialogs.last_message.timestamp) {
        currentDialogs.last_message = {
          message: payload.message,
          timestamp: payload.timestamp
        }
      }
      payload.confirm_class = 'unconfirmed'
      if (payload.height) {
        payload.confirm_class = 'confirmed'
      }
      if (payload.height && payload.height > state.lastChatHeight) {
        state.lastChatHeight = payload.height
      }
      Vue.set(state.chats, partner, currentDialogs)
      payload.direction = direction
      Vue.set(state.chats[partner].messages, payload.id, payload)
    }
  },
  plugins: [createPersistedState()]
})

/* eslint-disable no-new */
window.ep = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  i18n: i18n
})
