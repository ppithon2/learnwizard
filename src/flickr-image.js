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


      <iron-ajax id="ajaxflickr" handle-as="json" last-response="{{_data}}"></iron-ajax>

      <iron-image height="250" width="400" id="ironimage" sizing="cover" on-click="_tapimage" src="[[getImage(_data)]]" preload fade style="background-color: white;cursor: pointer; "></iron-image>

    `;
  }

  static get properties() {
   return {

     imageshistory: {
       type: Object


     },

     text: {
       type: String
     },

     _data: {
       type: Object

     },

     _numimage: {
       type: Number,
       value: 0

     },

     _initok: {
       type: Boolean,
       value: false
     }

   }
  }

  static get observers() {
    return [
      // Observer method name, followed by a list of dependencies, in parenthesis
      '_search(text)'
    ]
  }

  _search(text) {

    var type = "tags";

    if (text.indexOf(" ")>-1)
      type = "text";

    var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=a8d37e137abece523bd5c1a1989a84e0&format=json&nojsoncallback=1&" + type + "=" + this.text;
    this.$.ajaxflickr.url=url;
    this.$.ajaxflickr.generateRequest();

  }

  getImage(dataimages) {
    this._numimage = 0;
    return this.getNewImageHttp();

  }

  _tapimage(e) {
    this._numimage = this._numimage + 1;
    var http =  this.getNewImageHttp();
    this.$.ironimage.src = http;
  }

  getNewImageHttp() {

    if (this._numimage==0 && this.imageshistory[this.text]!=null)
      return this.imageshistory[this.text];

    var firstphoto = this._data.photos.photo[this._numimage];
    var url = "http://farm"+ firstphoto.farm +".staticflickr.com/"+ firstphoto.server+"/"+firstphoto.id+"_"+ firstphoto.secret +".jpg";

    this.set('imageshistory.'+this.text, url);

    return url;
  }



}

window.customElements.define('flickr-image', FlickrImage);
