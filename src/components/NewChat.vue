<template>
  <div class="chats">
    <md-layout md-align="center" md-gutter="16">
      <md-layout md-flex="66" sm-flex="90">
          <md-input-container>
              <label>{{ $t('chats.recipient') }}</label>
              <md-textarea v-model="targetAddress"></md-textarea>
          </md-input-container>
          <md-input-container>
              <label>{{ $t('chats.message') }}</label>
              <md-textarea v-model="message"></md-textarea>
          </md-input-container>
          <md-layout md-align="center" md-gutter="16">
          <md-button class="md-raised md-primary" v-on:click="send">{{ $t('chats.send_button') }}</md-button>

          </md-layout>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
export default {
  name: 'chats',
  methods: {
    send () {
      if (this.$store.state.balance < 0.1) {
        alert(this.$t('chats.no_money'))
        return
      }
      if (this.message) {
        this.encodeMessageForAddress(this.message, this.targetAddress)
      }
    }
  },
  computed: {
  },
  watch: {
  },
  data () {
    return {
      targetAddress: '',
      message: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
