'use strict';

$(function () {
  // =======================================
  // Our model 
  // =======================================
  var hosts = [];
  var currentHostOrder = 'ASCENDING';

  // =======================================
  // Adds individual hosts as a 
  // dropdown item to dropdown menu
  // =======================================
  var rawTemplate = $('#li-template').html();
  var compiledTemplate = _.template(rawTemplate);

  var addDropdownItem = function addDropdownItem(name, id) {
    var host = { name: name, id: id };
    $('.dropdown-menu').append(compiledTemplate(host));
  };

  // =======================================
  // Reloads entire host list view
  // =======================================
  var updateList = function updateList(list) {
    $('#host-list').empty();
    for (var i = 0; i < list.length; i++) {
      addDropdownItem(list[i].name, list[i].id);
    }
  };

  // =======================================
  // AJAX request to '/get-hosts' and updates
  // hosts variable and append to DOM 
  // =======================================
  var getHosts = function getHosts() {
    $.get('/get-hosts').done(function (results) {
      hosts = _.sortByNat(results, function (x) {
        return x.name.toLowerCase();
      });
      updateList(hosts);
    }).fail(function (err) {
      return alert(err);
    });
  };

  // =======================================
  // FUNCTION THAT SENDS ALL THE CHECKED BOX VALUES 
  // =======================================
  var sendSelectedHosts = function sendSelectedHosts() {
    var allHosts = $('#host-list').children;
    console.log(allHosts);
  };

  // =======================================
  // Create a delete endpoint with /delete-host 
  // =======================================
  // I will make it from selected hosts and a delete button

  // =======================================
  // Event listener for toggle list button 
  // =======================================
  var toggleHostOrder = function toggleHostOrder() {
    if (currentHostOrder === 'ASCENDING') {
      updateList(hosts.reverse());
      currentHostOrder = 'DESCENDING';
    } else {
      updateList(hosts);
      currentHostOrder = 'ASCENDING';
    }
  };

  $('#toggle-host-order').click(function () {
    return toggleHostOrder();
  });

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
