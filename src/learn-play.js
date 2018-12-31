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
import '@polymer/iron-list/iron-list.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import './flickr-image.js';
import './shared-styles.js';
import './learn-voice.js';


class LearnPlay extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles iron-flex iron-flex-alignment">
        :host {
          display: block;

          padding: 10px;
        }



        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-drawer {
            --app-drawer-content-container: {
              background-color:white;
              text-align: left;
            }
        }
      </style>

  <iron-scroll-threshold id="scrollTheshold" lower-threshold="100"  on-lower-threshold="_findMore" scroll-target="[[scrollTarget]]">
  </iron-scroll-threshold>

      <app-drawer-layout force-narrow >
             <!-- Drawer content -->
             <app-drawer id="drawer"  slot="drawer"  align="end">

               <app-toolbar>Options</app-toolbar>

               <paper-button on-tap="tapHiddenQuestion">hidden question</paper-button>
               <paper-button on-tap="tapHiddenAnswer">hidden answer</paper-button>

               <learn-voice id="voice"> </learn-voice><br>

               <paper-icon-button icon="av:play-circle-filled" on-tap="play"></paper-icon-button>
               <paper-icon-button icon="av:stop" on-tap="stop"></paper-icon-button>

             </app-drawer>


        <iron-list id="idlist" items="{{_list}}" as="row" scroll-target="[[scrollTarget]]">
          <template>
            <div> <!-- div wrapper pour iron-list sinon problem margin -->
            
              <div class="card horizontal layout" style="background-color:[[getColorCard(row,itemplay,index)]]">

                <flickr-image id="flickr" text="[[getFlickrText(row)]]" imageshistory="{{imageshistory}}"></flickr-image>

                <div class="vertical layout" style="margin-left:15px">

                    <span hidden$="[[hiddenQuestion]]" class="question"><b>[[getQuestion(row)]]</b></span>
                    <paper-icon-button icon="icons:record-voice-over" on-tap="speakQuestion"></paper-icon-button>

                    <br><br>

                    <span class="answer" on-click="tapResponse">[[getAnswer(row,hiddenResponse)]]</span>
                    <paper-icon-button icon="icons:record-voice-over" on-tap="speakAnswser"></paper-icon-button>

                </div>

              </div>
            </div>
          </template>
        </iron-list>


        </app-drawer-layout>


    `;
  }

  static get properties() {
   return {

     source: {
       type: Array,
       observer: 'sourcechange'
     },
     _list: {
       type: Array,
       value: []
     },
     imageshistory: {
       type: Object

     },
     toggleSettings: {
       type: Boolean,
       observer: 'toggleSettingsChanged'
     },
     pagevisible: {
       type: Boolean

     },
     scrollTarget: HTMLElement

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

  getAnswer(row, hiddenResponse) {
     var length = row[1].length;

     if (hiddenResponse)
        return row[1].replace(/[^0-9]/g, ".");
     else
        return row[1];
  }

  tapResponse(event) {
      event.target.innerText = event.model.row[1];
  }

  tapHiddenQuestion(e) {
     this.hiddenQuestion = !this.hiddenQuestion;
  }

  tapHiddenAnswer(e) {
     this.hiddenResponse = !this.hiddenResponse;
  }

  play(e) {

    this.stop();
    this.interval = setInterval(function(){ this.set('itemplay', this.itemplay+1); }.bind(this), 4000);

  }


  stop(e) {
    this.itemplay = -1;
    if (this.interval!=null)
        clearInterval(this.interval);
  }

  getColorCard(row,itemplay,index) {
    if (itemplay!=null && index==itemplay) {
      this.$.voice.speak(row[0]);
      this.$.voice.speak(row[1]);
      return "#bbdefb";
    } else {
      return "white";
    }
  }

  getFlickrText(row) {
    console.log("row : " + row[1]);
    return row[1];
  }


  sourcechange() {

    if (this._list.length>0) {
      this.splice("_list", 0, this._list.length);
      this._findMore();
    }


  }

 toggleSettingsChanged() {
   if (!this.pagevisible)
      return;

    this.$.drawer.open();

 }

_findMore() {

  var start = this._list.length;
  var end = start + 10;

  for (var i=start;i<end;i++) {

        if (i>=this.source.length)
          break;

        this.push("_list", JSON.parse(JSON.stringify(this.source[i])));
  }

  this.$.scrollTheshold.clearTriggers();

  this.$.idlist.notifyResize();

  console.log("find more...");

}


}

window.customElements.define('learn-play', LearnPlay);
