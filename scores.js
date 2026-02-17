var gSecret;

var honeypot;
var allDates = []; // Store all dates for filtering

function clear_table(table_name) {
  let table = document.getElementById(table_name);
  for (var i=table.rows.length-1;i>=1;--i) {
    table.deleteRow(i);
  }
  return table;
}

function filter_by_year() {
  const selectedYear = document.getElementById('year_select').value;
  display_dates(allDates.filter(d => {
    const date = new Date(d.date);
    return date.getFullYear().toString() === selectedYear;
  }));
}

function display_dates(dates) {
  let table = clear_table('date_table');
  for (let i=0; i < dates.length;++i) {
    var row = table.insertRow(table.rows.length);
    let cell = row.insertCell(0);
    var localDate = new Date(dates[i].date);
    var btn = document.createElement('input');
    btn.type = "button";
    btn.value = localDate.toDateString() + " " + localDate.toTimeString().split(" ")[0];
    btn.onclick = (function(id) {
      return function() {
        const headers = new Headers();
        headers.append("id", id);
        headers.append("secret", gSecret);
        headers.append("scope","captain");
        fetch("https://honeypot.edgecompute.app/get_scores", {
          headers: headers
        })
        .then(response => {
          return response.json();
        })
        .then(scores => {
          insert_scores(scores);
        });
      };
    })(dates[i].id);
    cell.appendChild(btn);
  }
}

function insert_scores(scores) {
  document.getElementById("list_scores").style.display = 'none';
  document.getElementById("show_scores").style.display = 'block';
  let table = clear_table('result_table');
  for (let i=0; i < scores.scores.length;++i) {
    // scores.scores[i]. name, gross, net
    var row = table.insertRow(table.rows.length);
    let namecell = row.insertCell(0);
    namecell.innerHTML = scores.scores[i].name;
    let grosscell = row.insertCell(1);
    grosscell.innerHTML = scores.scores[i].gross;          
    let netcell = row.insertCell(2);
    netcell.innerHTML = scores.scores[i].net;          

  }
}

function get_list_of_honeypots() {
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope","captain");
  
  fetch("https://honeypot.edgecompute.app/list_scores", {
    headers: headers
  })
  .then(response => {
    return response.json();
  })
  .then(dates => {
    document.getElementById("list_scores").style.display = 'block';
    document.getElementById("show_scores").style.display = 'none';
    
    // Store all dates and reverse (most recent first)
    allDates = dates;
    allDates.reverse();
    
    // Get unique years from dates
    const years = [...new Set(allDates.map(d => new Date(d.date).getFullYear()))];
    years.sort((a, b) => b - a); // Sort descending (latest first)
    
    // Populate year dropdown
    const yearSelect = document.getElementById('year_select');
    yearSelect.innerHTML = '';
    for (let year of years) {
      let option = new Option(year, year);
      yearSelect.add(option);
    }
    
    // Default to current year if available, otherwise latest year
    const currentYear = new Date().getFullYear();
    if (years.includes(currentYear)) {
      yearSelect.value = currentYear;
    } else if (years.length > 0) {
      yearSelect.value = years[0];
    }
    
    // Filter and display dates for selected year
    filter_by_year();
  });
}

function cache_query_param() {
  const searchParams = new URLSearchParams(window.location.search);
  gSecret = searchParams.get('secret');
  const headers = new Headers();
  headers.append("secret",gSecret);
  headers.append("scope", "captain");
  fetch("https://honeypot.edgecompute.app/verify", {
    headers: headers
  })
  .then(response => {
    if (response.status == 200) {
      get_list_of_honeypots();      
    }
  });
}

cache_query_param();
