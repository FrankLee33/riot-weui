/*!
 * Riot Bootstrap (http://cognitom.github.io/riot-bootstrap/)
 * Copyright 2015 Tsutomu Kawamura.
 * Licensed under MIT
 */
;(function(window) {

var riot = (!window || !window.riot) ? require('riot') : window.riot;

riot.tag('btn', '<a href="javascript:;" onclick="{ push }" class="weui_btn { opts.color ? \'weui_btn_\'+opts.color : \'weui_btn_default\' } {weui_btn_disabled: disabled }"> <yield></yield> </a>', function(opts) {
    this.disabled = undefined

    this.culculateProperties = function(e) {
      this.disabled =
        opts.hasOwnProperty('__disabled') ? opts.__disabled === true :
        opts.hasOwnProperty('disabled') ? opts.disabled === '' || opts.disabled === 'disabled':
        false
    }.bind(this);
    this.push = function(e) {
      if (this.disabled) return
      if (opts.href) {
        e.preventUpdate = true
        location.href = opts.href
        return
      }
      if (opts.onpush){
        e.preventUpdate = true
        opts.onpush(e)
        this.updateCaller(opts.onpush)
      }
    }.bind(this);

    this.on('update', this.culculateProperties)
    this.mixin('parentScope')
  
});

/*!
 * Parent Scope mixin
 * A part of Riot Bootstrap
 * http://cognitom.github.io/riot-bootstrap/
 */
riot.mixin('parentScope', {
  // initialize mixin
  init: function() {
    this._ownPropKeys = []
    this._ownOptsKeys = []
    for (var k in this) this._ownPropKeys[k] = true
    for (var k in this.opts) this._ownOptsKeys[k] = true

    this.on('update', function() {
      for (var k in this.parent)
        if (!this._ownPropKeys[k]) this[k] = this.parent[k]
      for (var k in this.parent.opts)
        if (!this._ownOptsKeys[k]) this.opts[k] = this.parent.opts[k]
    })
  },

  // update the tag object who calls me
  updateCaller: function(f) {
    var keys = []
    for (var k in this.parent._ownPropKeys || this.parent) keys.push(k)
    for (var i = 0; i < keys.length; i++)
      if (this.parent[keys[i]] === f) {
        this.parent.update()
        return
      }
    if (this.parent.updateCaller) this.parent.updateCaller(f)
  }
})


})(typeof window != 'undefined' ? window : undefined)