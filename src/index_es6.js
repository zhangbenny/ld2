$(function() {
  // =======================================
  // Our model 
  // =======================================
  let hosts = []
  let currentHostOrder = 'ASCENDING'

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
      .fail(err => alert(err))
  }

  // =======================================
  // FUNCTION THAT SENDS ALL THE CHECKED BOX VALUES 
  // =======================================
  const sendSelectedHosts = () => {
    let allHosts = $('#host-list').children
    console.log(allHosts)
  }

  // =======================================
  // Create a delete endpoint with /delete-host 
  // =======================================
  // I will make it from selected hosts and a delete button

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
  // Creates a random new host
  // =======================================
  $("#add-random-host").click(() => {
    let newHost = Mock.getRandomHost()
    addDropdownItem(newHost.name, newHost.id)
  })
  
  // =======================================
  // Event listener transferred from index.html
  // =======================================
  $('#toggle-error-mode').click(() => Mock.toggleMode() )

  // =======================================
  // Prevent default when clicking on open
  // dropdown menu 
  // =======================================
  $('.dropdown-menu').click(e => e.stopPropagation() )

  // =======================================
  // Turn on mockjax, request hosts, and 
  // append to DOM on page load
  // =======================================
  Mock.setup(200)
  getHosts()

})
