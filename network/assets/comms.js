/* global document */
const EndPoint =
(function() {
  /** @class EndPoint @virtual
   *  @description Virtual base communications class. Inherit this into a specific implementation. The
   *  base class implements the underlying comms. Derived classes must override the 'receive' method.
   *
   *  The signaling transport layer *must* be encapsulated in this class such that replacing one transport
   *  (eg REST Polling) with another (eg WebSockets) should not require any changes to the derived classes.
   *  @prop {String} _name - the unique directory name for this end point. It's address.
   *  @prop {Object} _endPoints @static - Directory of local EndPoint objects indexed by _name
   */
  class EndPoint {
    constructor(ep_name) {
      this._name = ep_name;
      EndPoint._endPoints[ep_name] = this;

      var self = this;
      window.setInterval(() => {
        self.makeRequest('GET', 'https://localhost:8000/poll/' + self._name, (responseText) => {
          const data = JSON.parse(responseText);

          console.log(data);
          if (data.messages.length) {
            data.messages.forEach(message => {
              console.log(message);
              self.receive(message.from, message.method, message.data);
            })
          }
        })
      }, 1000);
    }
    /** @method log
     *  @description simple wrapper around console.log that prefixes the name ofthe EndPoint that's generating the message
     */
     log(...args) {
       console.log('NAME: '+this._name,...args);
     }
    /** @method get
     *  @description Every end point has to have a name which must be unique. This method
     *  returns the LOCAL instance of and EndPoint with the specified name. Note that this
     *  can only return local endpoints and has no knowledge of other operational clients.
     *  @param {String} name - the name of the EndPoint to return
     *  @return {EndPoint}
     */
    static get(ep_name) {
      return EndPoint._endPoints[ep_name];
    }

    makeRequest(method, url, callback, payload) {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', (e) => {
        console.log(e.target.responseText);
        callback(e.target.responseText);
      });

      xhr.open(method, url);
      xhr.send(payload);
    }

    /** @method send
     *  @description Send a message to the named target EndPoint (which is usually on a remote client)
     *  @param {String} targetName - the unique name of the end point
     *  @param {String} operation - the method name or operation we want the remote EndPoint to execute
     *  @param {Object} [data] - optional parameter data to send with this message
     */
    send(targetName, operation, data) {
      // Target is the name - and it can't be the name of this end point.
      this.log("SEND TO -> "+targetName+" REQUEST "+operation+" WITH "+JSON.stringify(data||null));
      this.makeRequest('POST', 'https://localhost:8000/send/' + this._name + '/' + targetName + '/' + operation, () => {
        console.log('made post request');
      }, JSON.stringify(data || ''));
    }
    /** @method receive
     *  @description This method will return a message from a remote end point. This method *MUST* be overridden in the
     *  derived class. The child class method will take the following parameters:
     */
    receive(/* fromName, operation, data */) {
      console.error("Virtual base class method 'receive' called - this should always be overridden in a derived class");
    }
  }
  EndPoint._endPoints = {};

  return EndPoint;
})();
