function getData(){
        const xhttp = new XMLHttpRequest();
        xhttp.onload = () => {
            let response = JSON.parse(xhttp.responseText);
            let access_token = response.access_token;
            localStorage.setItem("token", access_token);
            if (xhttp.status == 200) {
                window.location.href = "./users.html";
            } else {
                showError(user, "Tài khoản đăng nhập không chính xác");
                showError(password, "Mật khẩu không chính xác");
            }
        }
        xhttp.open("POST", "http://wlp.howizbiz.com/api/web-authenticate");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("username=" + user.value + "&password=" + password.value);
    }
userData()
function userData() {
    // getSelect();

    let url = "http://wlp.howizbiz.com/api/phanloaihoc?paginate=true&page=1&perpage=10&search="

    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        var response = JSON.parse(xhttp.responseText);
        var data = response.list
        // console.log(data)
        renderTable(data);
    }
    xhttp.open("GET", url);
    // xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
    xhttp.send();
}

function renderTable(data) {
    let table = document.getElementById("table");
    let text = "";
    // console.log(data)
    for (let i = 0; i < data.length; i++) {
        text += `
			<tr id="${data[i].id}">
			    <td>${data[i].ten_khoa_hoc}</td>
				<td>${data[i].ten}</td>
				<td>${data[i].rank_vn}</td>
				<td>
				<button><i class='bx bx-repeat'></i></button>
				<button onclick="getTableRowData(this)" data-bs-toggle="modal" data-bs-target="#modalEdit"><i class='bx bxs-edit' ></i></button>
				<button onclick="deleteUser(this)"><i class='bx bx-trash' ></i></button>
				</td>
			</tr>
		`;
    }
    table.innerHTML = text;
}

