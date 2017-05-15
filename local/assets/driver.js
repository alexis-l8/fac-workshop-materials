/* global document, EndPoint, VideoEndPoint */
(function() {
  document.addEventListener("DOMContentLoaded", function() {
    // Create four end points, one for out sender and one for our receiver.
    console.log("CREATING VIDEO END POINTS");
    new VideoEndPoint('V1');
    new VideoEndPoint('V2');
    new VideoEndPoint('V3');
    new VideoEndPoint('V4');

    /**** Utility DOM functions ****/
    function getCurrentTarget(ev) {
      return ev.currentTarget.parentElement;
    }
    function endPointFromEvent(ev) {
      return EndPoint.get(ev.currentTarget.parentElement.getAttribute('id'));
    }

    /**** Button Handlers ****/
    function endCall(ev) {
      // Get the EndPoint object from it's name
      endPointFromEvent(ev).hangupCall();
    }
    function pauseVideo(ev) {
      // Toggle pause state of the relevant video tag.
      endPointFromEvent(ev).pauseCall();
    }
    function startCall(ev) {
      // Ask the target whether we can call
      var target = getCurrentTarget(ev).querySelector('.target').value;
      console.log("CREATE CALL FROM EndPoint "+target);
      endPointFromEvent(ev).startCall(target);
    }
    // Set up button handlers
    document.querySelectorAll('.startCall').forEach((elem) => {elem.addEventListener('click', startCall);});
    document.querySelectorAll('.endCall').forEach((elem) => {elem.addEventListener('click', endCall);});
    document.querySelectorAll('.pause').forEach((elem) => {elem.addEventListener('click', pauseVideo);});
  });
})();
