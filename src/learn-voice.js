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
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import './shared-styles.js';

class LearnVoice extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">

      </style>

      <vaadin-combo-box label="Voice" items="[[listvoices]]" value="{{voiceSelect}}"></vaadin-combo-box>

    `;
  }

  static get properties() {
   return {

     listvoices: {
       type: Array


     }
   }
  }

  ready() {
    super.ready();

    this.listvoices = this.getVoices();

    // Chrome loads voices asynchronously.
    window.speechSynthesis.onvoiceschanged = function(e) {
          this.listvoices = this.getVoices();
    }.bind(this);

  }

  // Fetch the list of voices and populate the voice options.
  // https://codepen.io/matt-west/pen/wGzuJ
  getVoices() {
    // Fetch the available voices.
  	var voices = speechSynthesis.getVoices();

    var list= [];
    // Loop through each of the voices.
  	voices.forEach(function(voice, i) {
        list.push(voice.name);
  	});

    return list;
  }

  speak(text) {
    // Create a new instance of SpeechSynthesisUtterance.
  	var msg = new SpeechSynthesisUtterance();

    // Set the text.
  	msg.text = text;

    // Set the attributes.
  	//msg.volume = parseFloat(volumeInput.value);
  	//msg.rate = parseFloat(rateInput.value);
  	//msg.pitch = parseFloat(pitchInput.value);

    // If a voice has been selected, find the voice and set the
    // utterance instance's voice attribute.
  	if (this.voiceSelect!=null) {
  		msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == this.voiceSelect; }.bind(this))[0];
  	}

    // Queue this utterance.
  	window.speechSynthesis.speak(msg);
  }

}

window.customElements.define('learn-voice', LearnVoice);
