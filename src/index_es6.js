$(function() {
  let hosts = [];

  const addDropdownItem = (hostName, hostId) => {
    $('<li></li>').addClass('dropdown-item')
                  .attr('id', hostId)
                  .text(hostName)
                  .appendTo('.dropdown-menu')
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
  $("#add-random-host").click(function() {
    let newHost = Mock.getRandomHost()
    
    hosts.push()

    $('<li></li>').addClass('dropdown-item')
                  .attr('id', newHost.id)
                  .text(newHost.name)
                  .appendTo('.dropdown-menu')
  });
  
  // =======================================
  // Event listener transferred from index.html
  // =======================================
  $('#toggle-error-mode').on('click', () => Mock.toggleMode() )

  // =======================================
  // Prevent default when clicking on open
  // dropdown menu 
  // =======================================
  $('.dropdown-menu').on('click', e => e.stopPropagation() )

  // =======================================
  // Turn on mockjax, request hosts, and 
  // append to DOM on page load
  // =======================================
  Mock.setup(200)
  getHosts()

});
