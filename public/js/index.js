'use strict';

$(function () {
  var _this = this;

  // =======================================
  // Our model 
  // =======================================
  var hosts = [];
  var currentHostOrder = 'ASCENDING';
  var currentErrorMode = 200;

  // =======================================
  // Remove from one item from hosts
  // =======================================
  var removeHostOnBrowser = function removeHostOnBrowser(unwantedHost) {
    hosts = hosts.filter(function (host) {
      return host.name !== unwantedHost;
    });
  };

  // =======================================
  // Adds individual hosts as a 
  // dropdown item to dropdown menu
  // =======================================
  var rawTemplate = $('#li-template').html();
  var compiledTemplate = _.template(rawTemplate);

  var addDropdownItem = function addDropdownItem(host) {
    $('#host-list').append(compiledTemplate(host));
  };

  // =======================================
  // Reloads entire host list view
  // =======================================
  var updateList = function updateList(list) {
    var separator = $('<li></li>').attr('role', 'separator').addClass('divider');

    $('#host-list').empty();

    addDropdownItem({ name: 'select all', id: 'select-all-checkbox' });
    $('.form-check-label').attr('id', 'select-all-button');
    $('#host-list').append(separator);

    for (var i = 0; i < list.length; i++) {
      addDropdownItem(list[i]);
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
      return alert('HTTP Status Code: ' + err.status);
    });
  };

  // =======================================
  // Filters and renders the host list
  // does not modify the hosts variable
  // =======================================
  var filterAndRender = function filterAndRender() {
    var filteredList = hosts.filter(function (host) {
      return host.name.toLowerCase().includes($('#search-bar').val().toLowerCase());
    });
    updateList(filteredList);
  };

  // =======================================
  // FUNCTION THAT SENDS ALL THE CHECKED BOX VALUES 
  // =======================================
  var sendSelectedHosts = function sendSelectedHosts() {
    var selectedHosts = $('.host-checkbox').filter(function (i, el) {
      return el.checked;
    }).map(function (i, el) {
      return el.value;
    }).get();
    console.log(selectedHosts);
  };

  // =======================================
  // Delete a host and send AJAX call to
  // '/delete-host' with the array for info
  // in the request body (if there were an 
  // actual backend function to handle it)
  // =======================================
  var deleteHosts = function deleteHosts(unwantedList) {
    _.forEach(unwantedList, function (unwantedHost) {
      $.ajax({
        url: '/delete-host',
        type: 'delete',
        data: JSON.stringify({ deleteThisGuy: unwantedHost }),
        dataType: 'json'
      }).done(removeHostOnBrowser(unwantedHost)).fail(function (err) {
        return alert('HTTP Error Code: ' + err.status);
      });
    });

    filterAndRender();
  };

  // =======================================
  // Click handler for toggle list button 
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
  // Click handler to create a random new host
  // =======================================
  $("#add-random-host").click(function () {
    var newHost = Mock.getRandomHost();
    hosts.push(newHost);
    addDropdownItem(newHost);
  });

  // =======================================
  // Click handler transferred from index.html
  // =======================================
  $('#toggle-error-mode').click(function () {
    return Mock.toggleMode();
  });

  // =======================================
  // Event handler triggered when losing
  // focus from search-bar
  // =======================================
  $("#search-bar").change(function () {
    return filterAndRender();
  });

  // =======================================
  // Prevent default when clicking on open
  // dropdown menu 
  // =======================================
  $('.dropdown-menu').click(function (e) {
    return e.stopPropagation();
  });

  // =======================================
  // Click handler to delete selected hosts
  // =======================================
  $('#delete-hosts').click(function () {
    var selectedHosts = $('.host-checkbox').filter(function (i, el) {
      return el.checked;
    }).map(function (i, el) {
      return el.value;
    }).get();
    deleteHosts(selectedHosts);
  });

  // =======================================
  // Click handler for select/deselect all 
  // =======================================
  $('#select-all-checkbox').change(function () {
    alert('registering');
    if (_this.checked) {
      $('.host-checkbox').attr('checked', true);
    } else {
      $('.host-checkbox').attr('checked', false);
    }
  });

  // =======================================
  // Event handler for when the dropdown
  // closes 
  // =======================================
  $('ul.navbar-nav').on('hide.bs.dropdown', sendSelectedHosts);

  // =======================================
  // TESTERTESTERTESTER DOES WHAT YOU WANT! 
  // =======================================

  $('#TESTERTESTERTESTER').click(function () {});

  // =======================================
  // Turn on mockjax, request hosts, and 
  // append to DOM on page load
  // =======================================
  Mock.setup(200);
  getHosts();
});
