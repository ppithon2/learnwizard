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


class MyView1 extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <iron-ajax id="ajaxcsv" handle-as="text" on-response="_onResponsecsv"></iron-ajax>

      <div class="card">
        <div class="circle">1</div>
        <h1>Data</h1>

        <paper-textarea id="textarea" label="Past data here" value="{{sourcetxt}}"></paper-textarea>

        <paper-button on-tap="tap_data1">Exemple</paper-button>

      </div>
    `;
  }

  static get properties() {
   return {
     sourcetxt: {
       type: String,
       observer: 'sourcetxtchange'
     },
     source: {
       type: Object,
       value: {},
       notify:true
     }
   }
  }

  tap_data1() {
    this.$.ajaxcsv.url="src/data1.csv";
    this.$.ajaxcsv.generateRequest();
  }

  _onResponsecsv(event, request) {
    this.$.textarea.value = request.response;
  }

  sourcetxtchange(sourcetxt) {

    this.set('source', this.convertTxtToOBJ(sourcetxt));

  }

  convertTxtToOBJ(sourcetxt) {
    var obj={};
    var rows=[];

    var lines = sourcetxt.split('\n');
    lines.forEach(function(value, index) {
        var tab_value = value.split(',');
        var row={};
        row["question"]=tab_value[0];
        var answers=[];
        var answer={};
        answer["value"] = tab_value[1];
        answers.push(answer);
        row["answers"]=answers;

        rows.push(row);
    }.bind(this));
    obj["rows"] = rows;
    return obj;
  }

}

window.customElements.define('my-view1', MyView1);
