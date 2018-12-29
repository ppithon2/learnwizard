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
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './shared-styles.js';

class PastData extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles iron-flex iron-flex-alignment">
        :host {
          display: block;

          padding: 10px;
        }

        app-drawer {
            --app-drawer-content-container: {
              background-color:white;
              text-align: left;
            }
        }

      </style>

      <iron-ajax id="ajaxcsv" handle-as="text" on-response="_onResponsecsv"></iron-ajax>

      <app-drawer-layout force-narrow >
             <!-- Drawer content -->
             <app-drawer id="drawer"  slot="drawer"  align="end">

              <app-toolbar>Past data</app-toolbar>

              <paper-button on-tap="tap_data0">Exemple</paper-button><br>
              <paper-button on-tap="tap_data1">Exemple</paper-button><br>
              <paper-button on-tap="tap_data2">Exemple</paper-button><br>


            </app-drawer>

        <div class="card">

          <paper-textarea id="textarea" label="Past data here" value="{{_sourcetxt}}" rows="10"></paper-textarea>

        </div>

      </app-drawer-layout>

    `;
  }

  static get properties() {
   return {
     _sourcetxt: {
       type: String

     },
     source: {
       type: Object,
       value: {},
       notify:true
     },
     toggleSettings: {
       type: Boolean,
       observer: 'toggleSettingsChanged'
     },
     pagevisible: {
       type: Boolean,
       observer : '_pagevisiblechange'
     }

   }
  }

  tap_data0() {
    this.$.ajaxcsv.url="../csv/data0.csv";
    this.$.ajaxcsv.generateRequest();

  }

  tap_data1() {
    this.$.ajaxcsv.url="../csv/data1.csv";
    this.$.ajaxcsv.generateRequest();
  }

  tap_data2() {
    this.$.ajaxcsv.url="../csv/data2.csv";
    this.$.ajaxcsv.generateRequest();
  }

  _onResponsecsv(event, request) {
    this.$.textarea.value = request.response;
  }

  convertTxtToOBJ(sourcetxt) {

    return Papa.parse(sourcetxt).data;
  }

  _pagevisiblechange(b) {
    if (!b)
      this.set('source', this.convertTxtToOBJ(this._sourcetxt));

  }

  toggleSettingsChanged() {
    if (!this.pagevisible)
       return;

     this.$.drawer.open();
  }


}


window.customElements.define('past-data', PastData);
