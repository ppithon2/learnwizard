/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import './my-icons.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class LearnApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header-layout {
               position: absolute;
               top: 0px;
               right:0px;
               bottom: 0px;
               left: 0px;
               height: 100%;
               background-color: #eee;
               overflow: hidden;
               box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
             }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
      </style>

      <app-localstorage-document key="learnwizard-images-history" data="{{imageshistory}}">

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-header-layout id="appheaderlayout" has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>

              <div main-title="">Happy Learn</div>
              <paper-icon-button icon="content-paste" on-tap="_tapPastData" title="past data"></paper-icon-button>
              <paper-icon-button icon="motorcycle" on-tap="_tapPlay" title="play"></paper-icon-button>
              <paper-icon-button icon="[[_computeIconSettings(page)]]" on-tap="_tapsettings"></paper-icon-button>


            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main" selected-attribute="pagevisible">
            <past-data name="pastdata" source="{{source}}" toggle-settings="{{toggleSettings}}"></past-data>
            <learn-play name="play" source="{{source}}" imageshistory="{{imageshistory}}" toggle-settings="{{toggleSettings}}" scroll-target="[[scrollTarget]]"></learn-play>
            <my-view3 name="view3"></my-view3>
            <my-view404 name="view404"></my-view404>
          </iron-pages>

      </app-header-layout>

    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object,

      imageshistory: {
        type: Object,
        value:{}
      },

      toggleSettings: Boolean,
      scrollTarget: HTMLElement



    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  ready() {
    super.ready();
    this.set('scrollTarget',  this._getScrollTarget());

  }
  _routePageChanged(page) {
     // Show the corresponding page according to the route.
     //
     // If no page was found in the route data, page will be an empty string.
     // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
    if (!page) {
      this.page = 'pastdata';
    } else if (['pastdata', 'play', 'view3'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'view404';
    }


  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'pastdata':
        import('./past-data.js');
        break;
      case 'play':
        import('./learn-play.js');
        break;
      case 'view3':
        import('./my-view3.js');
        break;
      case 'view404':
        import('./my-view404.js');
        break;
    }
  }

  _tapsettings(e) {
   this.set('toggleSettings', !this.toggleSettings);
  }

  _tapPastData(e) {
    this.set('page', 'pastdata');
  }
  _tapPlay(e) {
    this.set('page', 'play');
  }

  _computeIconSettings(page) {
    if (page=="pastdata")
      return "icons:help";
    else if (page=="play")
      return "record-voice-over";
  }

  _getScrollTarget() {
    return this.$.appheaderlayout.$.contentContainer;
  }

}

window.customElements.define('learn-app', LearnApp);
