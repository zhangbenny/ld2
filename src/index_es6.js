$(function() {
  // =======================================
  // Our model 
  // =======================================
  let hosts = []

  // =======================================
  // Templates and adds each host as a 
  // dropdown item to dropdown menu
  // =======================================
  let rawTemplate = $('#li-template').html()
  let compiledTemplate = _.template(rawTemplate)

  const addDropdownItem = (name, id) => {
    let host = {name, id}
    $('.dropdown-menu').append(compiledTemplate(host))
  }

  // =======================================
  // Reloads entire host list as per variable  
  // =======================================
  const updateHosts = () => {
    for (var i = 0; i < hosts.length; i++) {
      addDropdownItem(hosts[i].name, hosts[i].id)
    }
  }
  
  // =======================================
  // AJAX request to '/get-hosts' and updates
  // hosts variable and append to DOM 
  // =======================================
  const getHosts = () => {
    $.get('/get-hosts')
      .done(results => {
        hosts = results
        updateHosts()
      })
      .fail(err => alert(err))
  }

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
