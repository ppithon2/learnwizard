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
import '@polymer/iron-ajax/iron-ajax.js';
import './shared-styles.js';


class FlickrImage extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles iron-flex iron-flex-alignment">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <iron-ajax id="ajaxflickr" handle-as="json" last-response="{{data}}"></iron-ajax>

      <iron-image id="ironimage" on-click="_tapimage" src="[[getImage(data)]]" preload fade style="background-color: white"></iron-image>

    `;
  }

  static get properties() {
   return {

     text: {
       type: String,
       observer: '_search'

     },

     data: {
       type: Object

     },

     numimage: {
       type: Number,
       value: 0

     }

   }
  }


  _search(text) {

    var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=a8d37e137abece523bd5c1a1989a84e0&format=json&nojsoncallback=1&text=" + text;

    this.$.ajaxflickr.url=url;
    this.$.ajaxflickr.generateRequest();

  }

  getImage(dataimages) {
    this.numimage = 0;
    return this.getNewImageHttp();

  }

  _tapimage(e) {
    this.numimage = this.numimage + 1;
    var http =  this.getNewImageHttp();
    this.$.ironimage.src = http;
  }

  getNewImageHttp() {

    var firstphoto = this.data.photos.photo[this.numimage];
    var url = "http://farm"+ firstphoto.farm +".staticflickr.com/"+ firstphoto.server+"/"+firstphoto.id+"_"+ firstphoto.secret +".jpg";

    return url;
  }




}

window.customElements.define('flickr-image', FlickrImage);
