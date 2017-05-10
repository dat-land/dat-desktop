var microcomponent = require('microcomponent')
var nanomorph = require('nanomorph')
var html = require('choo/html')
var css = require('sheetify')
var icon = require('./icon')

var editableField = css`
  :host {
    height: 1.25rem;
    position: relative;
    input {
      width: 100%;
      position: absolute;
      right: 0;
    }
    button {
      position: absolute;
      right: 0;
    }
    .indicator {
      position: absolute;
      display: none;
      right: 0;
    }
    &:hover, &:focus {
      .indicator {
        display: block;
      }
    }
  }
`

module.exports = TitleField

// Creates an input field with an explicit save button.
// There's 2 modes: active and inactive.
// Only dats that you can write to can have an active input field.
// Inactive becomes active by clicking on the input field.
// Active becomes inactive by:
// - clicking anywhere outside the field
// - pressing escape
// - pressing enter (saving)
// - clicking the save button (saving)
function TitleField () {
  var state = resetState()
  var emit = null

  var component = microcomponent('table-row')
  component.on('render', render)
  component.on('render:active', renderActive)
  component.on('render:inactive', renderInactive)
  component.on('update', update)
  component.on('unload', unload)
  return component

  function unload () {
    emit = null
    state = resetState()
  }

  function update (dat, newState, newEmit) {
    return dat.writable !== state.writable ||
      dat.key.toString('hex') !== state.key ||
      state.title !== dat.metadata.title || '#' + state.key
  }

  function resetState () {
    return {
      isEditing: false,
      editTarget: null,
      editValue: '',
      title: null,
      key: null
    }
  }

  function render (dat, newState, newEmit) {
    if (newEmit) emit = newEmit
    if (dat) {
      state.writable = dat.writable
      state.key = dat.key.toString('hex')
      state.title = dat.metadata.title || ''
      state.placeholderTitle = '#' + state.key
    }

    if (state.isEditing && state.writable) return component.emit('render:active')
    else return component.emit('render:inactive')
  }

  function renderInactive () {
    state.editValue = ''

    return html`
      <div class="${editableField}">
        <h2 class="f6 normal truncate" onclick=${onclick}>
          ${state.title || state.placeholderTitle}
          ${icon('edit-dat', { class: 'w1 h1 absolute top-0 bottom-0 right-0 color-neutral-30 indicator' })}
        </h2>
      </div>
    `

    function onclick (e) {
      e.stopPropagation()
      e.preventDefault()
      state.isEditing = true
      state.editValue = state.title
      component.emit('render')
    }
  }

  function renderActive () {
    setTimeout(function () {
      var input = self._element.querySelector('input')
      input.focus()
      input.select()
    }, 0)

    var self = this
    return html`
      <div class="${editableField}">
        <input class="f6 normal"
          value=${state.editValue} onkeyup=${handleKeypress} />
        ${renderButton()}
      </div>
    `

    function handleKeypress (e) {
      var oldValue = state.editValue
      var newValue = e.target.value
      state.editValue = newValue
      e.stopPropagation()

      if (e.code === 'Escape') {
        e.preventDefault()
        deactivate()
      } else if (e.code === 'Enter') {
        e.preventDefault()
        handleSave()
      } else if (oldValue !== newValue) {
        nanomorph(self._element.querySelector('button'), renderButton())
      }
    }

    function renderButton () {
      if (state.editValue === state.title) {
        return html`
          <button class="f6 white ttu bg-light-gray" onload=${attachListener}>
            Save
          </button>
        `
      } else {
        return html`
          <button class="f6 white ttu bg-color-green" onload=${attachListener} onclick=${handleSave}>
            Save
          </button>
        `
      }
    }

    function handleSave (e) {
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      emit('dats:update-title', { key: state.key, title: state.editValue })
      deactivate()
    }

    function deactivate () {
      document.body.removeEventListener('click', clickedOutside)
      state.isEditing = false
      component.emit('render')
    }

    function attachListener () {
      document.body.addEventListener('click', clickedOutside)
    }

    function clickedOutside (e) {
      var source = e.target
      while (source.parentNode) {
        if (source === self._element) return
        source = source.parentNode
      }
      deactivate()
    }
  }
}
