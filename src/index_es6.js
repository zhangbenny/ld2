$(function() {

  // =======================================
  // Our model 
  // =======================================
  let hosts = []
  let currentHostOrder = 'ASCENDING'
  let currentErrorMode = 200


  // =======================================
  // Remove from one item from hosts
  // =======================================
  const removeHostOnBrowser = (unwantedHost) => {
    hosts = hosts.filter(host => host.name !== unwantedHost)
  }

  // =======================================
  // Adds individual hosts as a 
  // dropdown item to dropdown menu
  // =======================================
  let rawTemplate = $('#li-template').html()
  let compiledTemplate = _.template(rawTemplate)

  const addDropdownItem = (name, id) => {
    let host = {name, id}
    $('.dropdown-menu').append(compiledTemplate(host))
  }

  // =======================================
  // Reloads entire host list view
  // =======================================
  const updateList = (list) => {
    $('#host-list').empty();
    for (var i = 0; i < list.length; i++) {
      addDropdownItem(list[i].name, list[i].id)
    }
  }
  
  // =======================================
  // AJAX request to '/get-hosts' and updates
  // hosts variable and append to DOM 
  // =======================================
  const getHosts = () => {
    $.get('/get-hosts')
      .done(results => {
        hosts = _.sortByNat(results, x => x.name.toLowerCase())
        updateList(hosts)
      })
      .fail(err => alert('HTTP Status Code: ' + err.status))
  }

  // =======================================
  // Filters and renders the host list
  // does not modify the hosts variable
  // =======================================
  const filterAndRender = () => {
    let filteredList = hosts.filter((host) => host.name.toLowerCase().includes($('#search-bar').val().toLowerCase()))
    updateList(filteredList)
  }

  // =======================================
  // FUNCTION THAT SENDS ALL THE CHECKED BOX VALUES 
  // =======================================
  const sendSelectedHosts = () => {
    let selectedHosts = $('.host-checkbox').filter((i, el) => el.checked)
                                           .map((i, el) => el.value)
                                           .get()
    console.log(selectedHosts)
  }

  // =======================================
  // Delete a host and send AJAX call to
  // '/delete-host' with the array for info
  // in the request body (if there were an 
  // actual backend function to handle it)
  // =======================================
  const deleteHosts = (unwantedList) => {
    _.forEach(unwantedList, unwantedHost => {
      $.ajax({
               url: '/delete-host',
               type: 'delete',
               data: JSON.stringify({deleteThisGuy: unwantedHost}),
               dataType: 'json',
             }).done(removeHostOnBrowser(unwantedHost))
               .fail(err => alert('HTTP Error Code: ' + err.status))
    })

    filterAndRender()
  }

  // =======================================
  // Event listener for toggle list button 
  // =======================================
  const toggleHostOrder = () => {
      if (currentHostOrder === 'ASCENDING') { 
        updateList(hosts.reverse())
        currentHostOrder = 'DESCENDING'
      } else {
        updateList(hosts)
        currentHostOrder = 'ASCENDING'
      }
  }

  $('#toggle-host-order').click(() => toggleHostOrder())

  // =======================================
  // Click handler to create a random new host
  // =======================================
  $("#add-random-host").click(() => {
    let newHost = Mock.getRandomHost()
    hosts.push(newHost)
    addDropdownItem(newHost.name, newHost.id)
  })
  
  // =======================================
  // Click handler transferred from index.html
  // =======================================
  $('#toggle-error-mode').click(() => Mock.toggleMode() )

  // =======================================
  // Event handler for typing into search box 
  // =======================================
  $("#search-bar").change(() => filterAndRender())

  // =======================================
  // Prevent default when clicking on open
  // dropdown menu 
  // =======================================
  $('.dropdown-menu').click(e => e.stopPropagation() )

  // =======================================
  // Click handler to delete selected hosts
  // =======================================
  $('#delete-hosts').click(() => {
    let selectedHosts = $('.host-checkbox').filter((i, el) => el.checked)
                                           .map((i, el) => el.value)
                                           .get()
    deleteHosts(selectedHosts)
  })

  // =======================================
  // Event handler for when the dropdown
  // closes 
  // =======================================
  $('ul.navbar-nav').on('hide.bs.dropdown', sendSelectedHosts)

  // =======================================
  // TESTERTESTERTESTER DOES WHAT YOU WANT! 
  // =======================================
  
  $('#TESTERTESTERTESTER').click(() => {
    
  })

  // =======================================
  // Turn on mockjax, request hosts, and 
  // append to DOM on page load
  // =======================================
  Mock.setup(200)
  getHosts()

})
