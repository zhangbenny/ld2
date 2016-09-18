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

  const addDropdownItem = (host) => {
    if (host.highlightedName) {
      $('#host-list').append(compiledTemplate(Object.assign({}, host, {highlightedName: host.highlightedName})))
    } else {
      $('#host-list').append(compiledTemplate(Object.assign({}, host, {highlightedName: host.name})))
    }
  }

  // =======================================
  // Reloads entire host list view
  // =======================================
  const updateList = (list) => {
    let separator = $('<li></li>').attr('role', 'separator')
                                  .addClass('divider')

    $('#host-list').empty()

    addDropdownItem({name: 'select all', id: 'select-all-checkbox'})
    $('.form-check-label').attr('id', 'select-all-button')
    $('#host-list').append(separator)

    for (var i = 0; i < list.length; i++) {
      addDropdownItem(list[i])
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
    let search = $('#search-bar').val()
    let filteredList = hosts.filter(host => host.name.toLowerCase().includes(search.toLowerCase()))
    let highlightedFilteredList = _.map(filteredList, host => {
      let original = host.name
      let i = original.toLowerCase().indexOf(search.toLowerCase())
      let highlightedName = original.substring(0, i) + '<span class="highlighted">' + original.substr(i, search.length) + '</span>' + original.substring(i + search.length, original.length)
      return Object.assign({}, host, {highlightedName})
    })

    updateList(highlightedFilteredList)
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
  // Click handler for toggle list button 
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
    addDropdownItem(newHost)
  })
  
  // =======================================
  // Click handler transferred from index.html
  // =======================================
  $('#toggle-error-mode').click(() => Mock.toggleMode() )

  // =======================================
  // Event handler triggered when losing
  // focus from search-bar
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
  // Click handler for select/deselect all 
  // =======================================
  $('#select-all-checkbox').change(() => { 
    alert('registering')
    if (this.checked) {
      $('.host-checkbox').attr('checked', true)
    } else {
      $('.host-checkbox').attr('checked', false)
    }
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
