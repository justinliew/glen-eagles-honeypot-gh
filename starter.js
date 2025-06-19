var gSecret;

var honeypot;

function submit_honeypot() {
  for (let i=0;i<honeypot.players.length;++i) {
    if (honeypot.players[i].gross_score == null) {
      const dialog = document.getElementById("submit_failed");
      dialog.showModal();
      return;
    }
  }
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope","starter");

  fetch("https://honeypot.edgecompute.app/submit_honeypot", {
    headers: headers
  })
    .then(response => {
    return response.json();
  })
    .then(response => {
      console.log(response);
      document.getElementById("no_honeypot").style.display = 'none';      
      document.getElementById("has_honeypot").style.display = 'none';
      document.getElementById("show_results").style.display = 'block';

      let table = clear_table('result_table');
      for (let i=0; i < response.length;++i) {
        let j = 0;
        while (response[i].winners[j] != null) {
          var row = table.insertRow(table.rows.length);
          let namecell = row.insertCell(0);
          namecell.innerHTML = response[i].winners[j].name;
          let catcell = row.insertCell(1);
          catcell.innerHTML = response[i].desc;          
          let resultcell = row.insertCell(2);
          resultcell.innerHTML = "$" + response[i].winners[j].amt.toFixed(2);
          j++;
        }

        if (response[i].close5 != 0) {
          var row = table.insertRow(table.rows.length);
          let namecell = row.insertCell(0);
          namecell.innerHTML = "Closest on 5";
          let catcell = row.insertCell(1);
          catcell.innerHTML = response[i].desc;          
          let resultcell = row.insertCell(2);
          resultcell.innerHTML = "$" + response[i].close5;          
        }
        if (response[i].close8 != 0) {
          var row = table.insertRow(table.rows.length);
          let namecell = row.insertCell(0);
          namecell.innerHTML = "Closest on 8";
          let catcell = row.insertCell(1);
          catcell.innerHTML = response[i].desc;          
          let resultcell = row.insertCell(2);
          resultcell.innerHTML = "$" + response[i].close8;          
        }
        if (response[i].long != 0) {
          var row = table.insertRow(table.rows.length);
          let namecell = row.insertCell(0);
          namecell.innerHTML = "Longest Putt";
          let catcell = row.insertCell(1);
          catcell.innerHTML = response[i].desc;          
          let resultcell = row.insertCell(2);
          resultcell.innerHTML = "$" + response[i].long;          
        }
      }
    
  });
}

function submit_honeypot_confirm() {
  const dialog = document.getElementById("submit_confirm");
  const cancelButton = document.getElementById("submit_confirm_cancel"); 
  const submitButton = document.getElementById("submit_confirm_submit");
  
  document.getElementById("submit_label").innerHTML = "Submit honeypot results for " + honeypot.players.length + " players?"
  
  dialog.showModal();
  submitButton.addEventListener("click", function l() {
    submitButton.removeEventListener("click", l);
    dialog.close("chosen");
    submit_honeypot();
  });

  // Form cancel button closes the dialog box
  cancelButton.addEventListener("click", () => {
    dialog.close("notchosen");
  });    
}

function new_honeypot() {
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope","starter");

  fetch("https://honeypot.edgecompute.app/new_honeypot", {
    headers: headers
  })
    .then(response => {
      return response.text();
  })
    .then(response => {
      init_player_list();
  });
}

function delete_honeypot() {
  
  const dialog = document.getElementById("delete_confirm");
  const cancelButton = document.getElementById("delete_confirm_cancel"); 
  const submitButton = document.getElementById("delete_confirm_submit");
  
  dialog.showModal();
  submitButton.addEventListener("click", function l() {
    submitButton.removeEventListener("click", l);
    dialog.close("chosen");
    const headers = new Headers();
    headers.append("secret",gSecret);
    headers.append("scope","starter");

    fetch("https://honeypot.edgecompute.app/delete_honeypot", {
      headers: headers
    })
      .then(response => {
        return response.text();
    })
      .then(response => {
        init_player_list();
    });
  });

  // Form cancel button closes the dialog box
  cancelButton.addEventListener("click", () => {
    dialog.close("notchosen");
  });  
}

function add_all_players() {
  const dialog = document.getElementById("add_all_confirm");
  const cancelButton = document.getElementById("add_all_confirm_cancel"); 
  const submitButton = document.getElementById("add_all_confirm_submit");
  dialog.showModal();
  submitButton.addEventListener("click", function l() {
    submitButton.removeEventListener("click", l);
    dialog.close("chosen");
    const headers = new Headers();
    headers.append("secret",gSecret);
    headers.append("scope","starter");
    fetch("https://honeypot.edgecompute.app/add_all_players", {
      headers: headers
    })
    .then(response => {
      init_player_list();
    });
  });
  // Form cancel button closes the dialog box
  cancelButton.addEventListener("click", () => {
    dialog.close("notchosen");
  });  
}

function add_player() {
  const dialog = document.getElementById("add_dialog");
  const cancelButton = document.getElementById("add_dialog_cancel"); 
  const submitButton = document.getElementById("add_dialog_submit");
  
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope","starter");
  fetch("https://honeypot.edgecompute.app/get_player_list", {
    headers: headers
  })
    .then(response => {
      return response.json();
  })
    .then(response => {
      const select = document.getElementById('player_select');
      select.innerHTML = "";  
      for (let i=0;i<response.players.length;++i) {
        let option = new Option(response.players[i].name,response.players[i].name);
        select.add(option,undefined);
      }

      dialog.showModal();
      submitButton.addEventListener("click", function l() {
        submitButton.removeEventListener("click", l);
        dialog.close("chosen");
        const headers = new Headers();
        headers.append("player", select.value);
        headers.append("secret",gSecret);
        headers.append("scope","starter");

        fetch("https://honeypot.edgecompute.app/add_player", {
          headers: headers
        })
        .then(response => {
          init_player_list();
        });
      });

      // Form cancel button closes the dialog box
      cancelButton.addEventListener("click", () => {
        dialog.close("notchosen");
      });
  });
}

function clear_table(table_name) {
  let table = document.getElementById(table_name);
  for (var i=table.rows.length-1;i>=1;--i) {
    table.deleteRow(i);
  }
  return table;
}

function init_player_list() {
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope","starter");

  // is there an existing honeypot in progresss?
  fetch("https://honeypot.edgecompute.app/get_honeypot", {
    headers: headers
  })
    .then(response => {
    return response.json();
    })
    .then(players => {
    let count = Object.keys(players).length;
    honeypot = players;
    if (count == 0) {
      document.getElementById("no_honeypot").style.display = 'block';
      document.getElementById("has_honeypot").style.display = 'none';
      document.getElementById("show_results").style.display = 'none';
    } else {
      document.getElementById("no_honeypot").style.display = 'none';      
      document.getElementById("has_honeypot").style.display = 'block';
      document.getElementById("show_results").style.display = 'none';
      let table = clear_table('player_table');
      for (let i=0; i < players.players.length;++i) {
        var row = table.insertRow(table.rows.length);
        let namecell = row.insertCell(0);
        namecell.innerHTML = players.players[i].name;

        let delcell = row.insertCell(1);
        var btn = document.createElement('input');
        btn.type = "button";        
        btn.value = "Remove";
        btn.onclick = function(){
        const headers = new Headers();
          headers.append("player", players.players[i].name);
          headers.append("secret", gSecret);
          headers.append("scope","starter");
          fetch("https://honeypot.edgecompute.app/delete_player", {
            headers: headers
          })
          .then(response => {
            init_player_list();
          });
        };
        delcell.appendChild(btn);
        
        let gscorecell = row.insertCell(2);
        var gscoreinput = document.createElement("input");
        gscoreinput.size = 2;
        gscoreinput.onchange = (event) => {
          let score = event.target.value;
          let player = players.players[i].name;
          let headers = new Headers();
          headers.append("score", score);
          headers.append("player", player);
          headers.append("secret", gSecret);
          headers.append("scope","starter");
          fetch("https://honeypot.edgecompute.app/add_score", {
            headers: headers
          })
          .then(response => {
            return response.text();
          })
          .then(response => {
            console.log(response);
            init_player_list();
          });
        };
        let nscorecell = row.insertCell(3);
        var nscoreinput = document.createElement("input");
        nscoreinput.size = 3;
        nscoreinput.setAttribute('readonly', true);
        if (players.players[i].net_score != null) {
          nscoreinput.value = players.players[i].net_score;
        } else {
          nscoreinput.value = 0;
        }
        nscorecell.appendChild(nscoreinput);
        if (players.players[i].gross_score != null) {
          gscoreinput.value = players.players[i].gross_score;
        } else {
          gscoreinput.value = 0;
        }
        gscorecell.appendChild(gscoreinput);
      }
    }
  });  
}

function cache_query_param() {
  const searchParams = new URLSearchParams(window.location.search);
  gSecret = searchParams.get('secret');
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope", "starter");
  fetch("https://honeypot.edgecompute.app/verify", {
    headers: headers
  })
  .then(response => {
    if (response.status == 200) {
      init_player_list();      
    }
  });
}

cache_query_param();
