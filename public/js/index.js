'use strict';

$(function () {
  var hosts = [];

  var addDropdownItem = function addDropdownItem(hostName, hostId) {
    $('<li></li>').addClass('dropdown-item').attr('id', hostId).text(hostName).appendTo('.dropdown-menu');
  };

  // =======================================
  // Reloads entire host list as per variable  
  // =======================================
  var updateHosts = function updateHosts() {
    for (var i = 0; i < hosts.length; i++) {
      addDropdownItem(hosts[i].name, hosts[i].id);
    }
  };

  // =======================================
  // AJAX request to '/get-hosts' and updates
  // hosts variable and append to DOM 
  // =======================================
  var getHosts = function getHosts() {
    $.get('/get-hosts').done(function (results) {
      hosts = results;
      updateHosts();
    }).fail(function (err) {
      return alert(err);
    });
  };

  // =======================================
  // Creates a random new host
  // =======================================
  $("#add-random-host").click(function () {
    var newHost = Mock.getRandomHost();

    hosts.push();

    $('<li></li>').addClass('dropdown-item').attr('id', newHost.id).text(newHost.name).appendTo('.dropdown-menu');
  });

  // =======================================
  // Event listener transferred from index.html
  // =======================================
  $('#toggle-error-mode').on('click', function () {
    return Mock.toggleMode();
  });

  // =======================================
  // Prevent default when clicking on open
  // dropdown menu 
  // =======================================
  $('.dropdown-menu').on('click', function (e) {
    return e.stopPropagation();
  });

  // =======================================
  // Turn on mockjax, request hosts, and 
  // append to DOM on page load
  // =======================================
  Mock.setup(200);
  getHosts();
});
