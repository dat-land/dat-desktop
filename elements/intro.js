var html = require('choo/html')
var css = require('sheetify')
var microcomponent = require('microcomponent')

var button = require('./button')

module.exports = IntroScreen

const intro = css`
  :host {
    height: 100vh;
    background-color: var(--color-neutral);
    color: var(--color-white);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    -webkit-app-region: drag;
  }
`
const content = css`
  :host {
    flex: 1;
    width: 100vw;
    padding: 3rem 2rem;
  }
`

const footer = css`
  :host {
    width: 100vw;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
  }
`

const dots = css`
  :host {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .dot {
      width: .5rem;
      height: .5rem;
      margin: .25rem;
      border-radius: 50%;
      background-color: var(--color-black);
    }
    .active {
      background-color: var(--color-blue);
    }
  }
`

function IntroScreen () {
  var component = microcomponent('intro')
  component.on('render', render)
  component.on('update', update)
  return component

  function next () {
    component.render(Object.assign({}, component._state, { screen: component._state.screen + 1 }))
  }

  function render (state) {
    const onexit = this._state.onexit = state.onexit
    const screen = this._state.screen = state.screen || 0

    switch (component._state.screen) {
      case 0:
        return html`
          <main class="${intro}">
            <img src="./assets/logo-dat-desktop.svg" alt="Dat Desktop Logo" class="db mb4">
            ${button.green('Get Started', { onclick: next })}
          </main>
        `
      case 1:
        return html`
          <main class="${intro}">
            <img src="./assets/intro-2.svg" alt="" class="absolute">
            <div class="${content}">
              <p class="mw5 f4">
                Hey there! This is a Dat.
              </p>
            </div>
            <div class="${footer}">
              ${button('Skip Intro', { onclick: onexit })}
              <div class="${dots}"">
                <div class="dot active"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
              ${button.green('Next', { onclick: next })}
            </div>
          </main>
        `
      case 2:
        return html`
          <main class="${intro}">
            <img src="./assets/intro-3.svg" alt="" class="absolute">
            <div class="${content}">
              <p class="mw5 f4">
                Think of it as a folder – with some magic.
              </p>
            </div>
            <div class="${footer}">
              ${button('Skip Intro', { onclick: onexit })}
              <div class="${dots}"">
                <div class="dot"></div>
                <div class="dot active"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
              ${button.green('Next', { onclick: next })}
            </div>
          </main>
        `
      case 3:
        return html`
          <main class="${intro}">
            <img src="./assets/intro-4.svg" alt="" class="absolute">
            <div class="${content}">
              <p class="mw5 f4">
                You can turn any folder on your computer into a Dat.
              </p>
            </div>
            <div class="${footer}">
              ${button('Skip Intro', { onclick: onexit })}
              <div class="${dots}"">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot active"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
              ${button.green('Next', { onclick: next })}
            </div>
          </main>
        `
      case 4:
        return html`
          <main class="${intro}">
            <img src="./assets/intro-5.svg" alt="" class="absolute">
            <div class="${content}">
              <p class="mw5 f4">
                Dats can be easily shared.
                Just copy the unique dat link and securely share it.
              </p>
            </div>
            <div class="${footer}">
              ${button('Skip Intro', { onclick: onexit })}
              <div class="${dots}"">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot active"></div>
                <div class="dot"></div>
              </div>
              ${button.green('Next', { onclick: next })}
            </div>
          </main>
        `
      case 5:
        return html`
          <main class="${intro}">
            <img src="./assets/intro-6.svg" alt="" class="absolute">
            <div class="${content}">
              <p class="mw5 f4">
                You can also import existing Dats.
                Check out datproject.org to explore open datasets.
              </p>
            </div>
            <div class="${footer}">
              <div class="${dots}"">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot active"></div>
              </div>
              ${button.green('Done', { onclick: onexit })}
            </div>
          </main>
        `
    }
    throw new Error(`Unknown screen: ${component._state.screen}`)
  }

  function update (state) {
    return state.onexit !== this._state.onexit
      || state.screen !== this._state.screen
  }
}
