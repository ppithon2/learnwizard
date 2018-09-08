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
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import './shared-styles.js';
import './learn-voice.js';


class MyView2 extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles iron-flex iron-flex-alignment">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
          <div class="circle">2</div>
          <h1>Learn</h1>

          <paper-button on-tap="tapHiddenQuestion">hidden question</paper-button>
          <paper-button on-tap="tapHiddenAnswer">hidden answer</paper-button>

          <learn-voice id="voice"> </learn-voice>

          <paper-icon-button icon="av:play-circle-filled" on-tap="play"></paper-icon-button>
          <paper-icon-button icon="av:stop" on-tap="stop"></paper-icon-button>

      </div>



        <template is="dom-repeat" items="[[sourcepart]]" as="row">


          <div class="card horizontal layout" style="background-color:[[getColorCard(row,itemplay,index)]]">


            <iron-image src="[[getImage(row)]]" preload fade style="background-color: white"></iron-image>

            <div class="vertical layout" style="margin-left:15px">

                <span hidden$="[[hiddenQuestion]]" class="question"><b>[[getQuestion(row)]]</b></span>
                <paper-icon-button icon="icons:record-voice-over" on-tap="speakQuestion"></paper-icon-button>

                <br><br>

                <span hidden$="[[hiddenResponse]]" class="answer">[[getAnswer(row)]]</span>
                <paper-icon-button icon="icons:record-voice-over" on-tap="speakAnswser"></paper-icon-button>

            </div>

          </div>

        </template>

        <div class="card horizontal layout" >
            <paper-button on-tap="next">Next</paper-button>
        </div>


    `;
  }

  static get properties() {
   return {

     source: {
       type: Array,
       observer: 'sourcechange'
     },
     sourcepart: {
       type: Array,
       value: []
     }

   }
  }

  speakQuestion(e) {
    this.$.voice.speak(e.model.row[0]);
  }

  speakAnswser(e) {
    this.$.voice.speak(e.model.row[1]);
  }

  getQuestion(row) {
    return row[0];
  }

  getAnswer(row) {
    return row[1];
  }

  tapHiddenQuestion(e) {
     this.hiddenQuestion = !this.hiddenQuestion;
  }

  tapHiddenAnswer(e) {
     this.hiddenResponse = !this.hiddenResponse;
  }

  play(e) {

    this.stop();
    this.interval = setInterval(function(){ this.set('itemplay', this.itemplay+1); }.bind(this), 2000);

  }


  stop(e) {
    this.itemplay = -1;
    if (this.interval!=null)
        clearInterval(this.interval);
  }

  getColorCard(row,itemplay,index) {
    if (itemplay!=null && index==itemplay)
      return "green";
    else {
      return "white";
    }
  }

  getImage(row) {
      return "https://loremflickr.com/320/240/"+ row[1];
  }

  sourcechange() {
      this.next();
  }

  next() {

    if (this.top==null)
      this.top=0;

    var start = this.top;
    var end = this.top + 10;

    for (var i=start;i<end;i++) {

          this.push("sourcepart", JSON.parse(JSON.stringify(this.source[i])));
    }
    this.top=end;


  }




}

window.customElements.define('my-view2', MyView2);
