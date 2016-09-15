'use strict';

$(function () {
  var hosts = [];

  // =======================================
  // Templates and adds each host as a 
  // dropdown item to dropdown menu
  // =======================================
  var rawTemplate = $('#li-template').html();
  var compiledTemplate = _.template(rawTemplate);

  var addDropdownItem = function addDropdownItem(name, id) {
    var host = { name: name, id: id };
    $('.dropdown-menu').append(compiledTemplate(host));
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

    addDropdownItem(newHost.name, newHost.id);
  });

  // =======================================
  // Event listener transferred from index.html
  // =======================================
  $('#toggle-error-mode').click(function () {
    return Mock.toggleMode();
  });

  // =======================================
  // Prevent default when clicking on open
  // dropdown menu 
  // =======================================
  $('.dropdown-menu').click(function (e) {
    return e.stopPropagation();
  });

  // =======================================
  // Turn on mockjax, request hosts, and 
  // append to DOM on page load
  // =======================================
  Mock.setup(200);
  getHosts();
});
