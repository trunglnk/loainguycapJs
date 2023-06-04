let roleAPI = "http://wlp.howizbiz.com/api/roles"
let user = document.getElementById("username");
let password = document.getElementById("password");
let token = "";

let ul = document.getElementById("pagination");
let itemsPerPage = 5;
let currentPage = 1;
let search = '';
const endpoint = "http://wlp.howizbiz.com/api/";
const routers = {
    listusers: "users",
    adduser: "users"
};

function changeItemsPerPage(value) {
    itemsPerPage = value;
    userData(currentPage, itemsPerPage);
}

function loadData() {
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

// let tokenId = localStorage.getItem(token);
// let token = localStorage.getItem("token");

userData(currentPage, itemsPerPage);

function userData(currentPage, itemsPerPage) {
    // getSelect();

    let url = endpoint + routers.listusers;
    url +=
        "?paginate=true&page=" +
        currentPage +
        "&perpage=" +
        itemsPerPage +
        "&with=roles,createdBy,provinces&search=" +
        search;

    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        var response = JSON.parse(xhttp.responseText);
        var data = response.list
        let pagination = response.pagination;
        renderTable(data);
        fn_page(currentPage, Math.ceil(pagination.total / itemsPerPage));
    }
    xhttp.open("GET", url);
    // xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
    xhttp.send();
}

// báo lỗi truy cập
function showError(input, message) {
    let parent = input.parentElement;
    let span = document.createElement("span");
    let children = parent.appendChild(span);
    children.classList.add("error");
    children.innerText = message;
}

function renderTable(data) {
    let table = document.getElementById("table");
    let text = "";
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        let dateTimeParts = data[i].created_at.split(" ");
        let datePart = dateTimeParts[0];


        let roles = ""; // Chuỗi roles
        for (let j = 0; j < data[i].roles.length; j++) {
            // Tạo thẻ span cho mỗi role và áp dụng CSS
            roles += `<span class="role mx-1 px-2 py-1">${data[i].roles[j].name}</span>`;
        }

        // if(data[i].inactive === true){
        //     let checked = document.querySelector(".checked")
        //     checked.setAttribute("checked","");
        // }
        // <td>${data[i].inactive}
        //     <label className="switch">
        //         <input className="checked" type="checkbox">
        //             <span className="slider round"></span>
        //     </label>
        // </td>
        text += `
			<tr id="${data[i].id}">
				<td>${data[i].name}</td>
				<td>${data[i].username}</td>
				<td>${data[i].mobile}</td>
				<td>${roles}</td>
				<td>${data[i].email}</td>
				<td>${datePart}</td>
				<td>
				<button><i class='bx bx-repeat'></i></button>
				<button onclick="getTableRowData(this)" data-bs-toggle="modal" data-bs-target="#modalEdit"><i class='bx bxs-edit' ></i></button>
				<button onclick="deleteUser('${data[i].id}')"><i class='bx bx-trash' ></i></button>
				</td>
			</tr>
		`;
    }
    table.innerHTML = text;
    // console.log(data)
}

//RendList ROLE
getSelect();
let selecttion;

function getSelect() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        selecttion = JSON.parse(xhttp.responseText);
        var cboQuyen = document.getElementById("cboQuyen")
        var filterRole = document.getElementById("filter-role")
        for (var i = 0; i < selecttion.length; i++) {
            cboQuyen.innerHTML += `<option value='${selecttion[i].id}'>${selecttion[i].name}</option>`;
            filterRole.innerHTML += `<option value='${selecttion[i].id}'>${selecttion[i].name}</option>`;
        }
        // console.log(selecttion);
    }
    xhttp.open("GET", "http://wlp.howizbiz.com/api/roles");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
    xhttp.send()

}

//ADD NEW
function addUser() {

    let name = document.getElementById("nameUser").value;
    let username = document.getElementById("usernameUser").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("mobile").value;
    let password = document.getElementById("pwd").value;
    let confirmPassword = document.getElementById("confirm-pwd").value;
    let roleIds = Array.from(document.getElementById("cboQuyen").selectedOptions).map(option => option.value);

    // Kiểm tra mật khẩu và mật khẩu xác nhận
    if (password !== confirmPassword) {
        showError(document.getElementById("confirm-pwd"), "Mật khẩu xác nhận không khớp");
        return;
    }

    // Tạo đối tượng người dùng mới
    let newUser = {
        name: name,
        username: username,
        email: email,
        mobile: phone,
        password: password,
        password_confirmation: confirmPassword,
        role_ids: roleIds
    };

    // Gửi yêu cầu Ajax để thêm người dùng mới
    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        if (xhttp.status == 200) {
            userData(currentPage, itemsPerPage);
            alert("Thêm mới User thành công!")
        } else {
            // Nếu có lỗi, hiển thị thông báo lỗi
            let response = JSON.parse(xhttp.responseText);
            showError(document.getElementById("username"), response.message);

        }
    };
    xhttp.open("POST", "http://wlp.howizbiz.com/api/users");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
    xhttp.send(JSON.stringify(newUser));
    // console.log(JSON.stringify(newUser))

}

//EDIT USER
function getTableRowData() {
    var table = document.getElementsByTagName("table")[0];
    var tbody = table.getElementsByTagName("tbody")[0];

    tbody.onclick = function (e) {
        e = e || window.event;
        var data = [];
        var target = e.srcElement || e.target;

        while (target && target.nodeName !== "TR") {
            target = target.parentNode;
        }

        if (target) {
            var cells = target.getElementsByTagName("td");

            for (var i = 0; i < cells.length - 1; i++) {
                data.push(cells[i].innerHTML);
            }
        }

        renderEditForm(data);
        document.getElementById("update-btn").onclick = function () {
            updateUser(data[0]);
            console.log(data[0])
        };
    };
}

// renderEditForm(data)
function renderEditForm(data) {
    let table = document.getElementById("form-edit");
    let text = "";

    let inputIds = ["edit-name", "edit-username", "edit-mobile", "edit-cboQuyen", "edit-email"];
    let labels = ["Tên hiển thị", "Tên đăng nhập", "Điện thoại", "Quyền", "Email"];
    console.log(data[0])
    for (let i = 0; i < inputIds.length; i++) {
        text += `
            <div class="mb-3">
                <label for="${inputIds[i]}">${labels[i]}</label>
                <input type="text" class="form-control" id="${inputIds[i]}" name="${inputIds[i]}" value="${data[i]}" ${i === 1 ? 'disabled' : ''}>
            </div>
        `;
    }

    table.innerHTML = text;
}

//UPDATE
function updateUser(userId) {
    let name = document.getElementById("edit-name").value;
    let username = document.getElementById("edit-username").value;
    let email = document.getElementById("edit-email").value;
    let phone = document.getElementById("edit-mobile").value;
    // let roleIds = Array.from(document.getElementById("edit-cboQuyen").selectedOptions).map(option => option.value);

    let updatedUser = {
        name: name,
        username: username,
        email: email,
        mobile: phone,
        // role_ids: roleIds
    };

    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        if (xhttp.status == 200) {
            userData(currentPage, itemsPerPage);
            alert("Cập nhật thông tin người dùng thành công!");
        } else {
            let response = JSON.parse(xhttp.responseText);
            alert("Lỗi cập nhật người dùng: " + response.message);
        }
    };
    xhttp.open("PUT", `http://wlp.howizbiz.com/api/users/${userId}`);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
    xhttp.send(JSON.stringify(updatedUser));
}

//DELETE
function deleteUser(userId) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        if (xhttp.status == 200) {
            userData(currentPage, itemsPerPage);
            alert('Xóa Thành Công')
        } else {
            let response = JSON.parse(xhttp.responseText);
            alert('Lỗi xóa rồi')
        }
    };
    xhttp.open("DELETE", `http://wlp.howizbiz.com/api/users/${userId}`);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
    xhttp.send();
}

//PAGINATE
function changeItemsPerPage(value) {
    itemsPerPage = value;
    userData(currentPage, itemsPerPage);
}

function fn_page(currentPage, pageNumber) {
    ul.innerHTML = "";
    if (currentPage == 1) {
        ul.innerHTML += `<li class="page-item"><button class="page-link inactive"> < </button></li>`
    } else {
        ul.innerHTML += `<li class="page-item"><button class="page-link" onclick="fn_previous();"> < </button></li>`;
    }

    for (let i = 0; i < pageNumber; i++) {
        ul.innerHTML += `
			<li class="page-item"><button class="page-link" onclick="mainPage(this);" value="${i + 1}">${i + 1}</button></li>
		`;
    }
    if (currentPage >= pageNumber) {
        ul.innerHTML += `<li class="page-item"><button class="page-link inactive"> > </button></li>`
    } else {
        ul.innerHTML += `<li class="page-item"><button class="page-link" onclick="fn_next();"> > </button></li>`
    }
}

function mainPage(e) {
    currentPage = e.value;
    userData(currentPage, itemsPerPage);
}

function fn_previous() {
    currentPage = currentPage - 1;
    userData(currentPage, itemsPerPage);
}

function fn_next() {
    currentPage = currentPage + 1;
    userData(currentPage, itemsPerPage);
}

//FILTER
//FILTER NUMBER
let table = document.querySelector("#table")

function clearTable() {
    let tr = table.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
        tr[i].innerHTML = "";
    }
}

let search_input = document.querySelector("#search-input")
search_input.addEventListener("keyup", fn_searchName);

function fn_searchName() {
    // .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let input = search_input.value;
    let url = endpoint + routers.listusers;
    url += '?paginate=true&page=' + currentPage + '&perpage=' + itemsPerPage + '&with=roles,createdBy,provinces&search=' + input;
    // console.log(url);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        let respone = JSON.parse(xhttp.responseText);
        let data = respone.list;
        if (input != "") {
            clearTable();
            renderTable(data);
        } else {
            userData(currentPage, itemsPerPage);
        }
    }
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", " Bearer " + localStorage.getItem("token"));
    xhttp.send();
}

//FILTER ROLE
let filterrole = document.querySelector("#filter-role")
filterrole.addEventListener("change", fn_searchRole);

function fn_searchRole() {
    let input = filterrole.value;
    let url = endpoint + routers.listusers;
    console.log(input)
    url += '?paginate=true&page=' + currentPage + '&perpage=' + itemsPerPage + '&with=roles,createdBy,provinces&search=&role_id=' + input;

    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        let respone = JSON.parse(xhttp.responseText);
        let data = respone.list;
        if (input != "") {
            clearTable();
            renderTable(data);
        } else {
            userData(currentPage, itemsPerPage);
        }
    }
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", " Bearer " + localStorage.getItem("token"));
    xhttp.send();
}

//FILTER DATE
let startDate = document.querySelector("#startDate");
startDate.addEventListener("change", fn_createDate);

function fn_createDate(e) {
    currentPage = 1;
    let date = e.target.value;
    let day = date.split("-").reverse().join("%2F");
    let endDateValue = document.querySelector("#endDate").value;
    let endDateDay = endDateValue.split("-").reverse().join("%2F");
    let url = endpoint + routers.listusers;
    url +=
        "?paginate=true&page=" +
        currentPage +
        "&perpage=" +
        itemsPerPage +
        "&with=roles,createdBy,provinces&search=&date_start=" +
        `${day}` +
        "&date_end=" +
        `${endDateDay}`;
    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        let response = JSON.parse(xhttp.responseText);
        let data = response.list;
        let list = response.pagination.total;
        if (xhttp.status == 200) {
            clearTable();
            renderTable(data);
            fn_page(currentPage, Math.ceil(list / itemsPerPage));
        } else {
            userData(currentPage, itemsPerPage);
        }
    };
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader(
        "Authorization",
        " Bearer " + localStorage.getItem("token")
    );
    xhttp.send();
}

let endDate = document.querySelector("#endDate");
endDate.addEventListener("change", fn_createDateEnd);

function fn_createDateEnd(e) {
    currentPage = 1;
    let date = e.target.value;
    let day = date.split("-").reverse().join("%2F");
    let startDateValue = document.querySelector("#startDate").value;
    let startDateDay = startDateValue.split("-").reverse().join("%2F");
    let url = endpoint + routers.listusers;
    url +=
        "?paginate=true&page=" +
        currentPage +
        "&perpage=" +
        itemsPerPage +
        "&with=roles,createdBy,provinces&search=&date_start=" +
        `${startDateDay}` +
        "&date_end=" +
        `${day}`;

    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        let response = JSON.parse(xhttp.responseText);
        let data = response.list;
        let list = response.pagination.total;
        if (xhttp.status == 200) {
            clearTable();
            renderTable(data);
            fn_page(currentPage, Math.ceil(list / itemsPerPage));
        } else {
            userData(currentPage, itemsPerPage);
        }
    };
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader(
        "Authorization",
        " Bearer " + localStorage.getItem("token")
    );
    xhttp.send();
}
