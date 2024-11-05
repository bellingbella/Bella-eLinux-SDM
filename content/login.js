getenv();
async function getenv() {
    const response = await fetch('/bellasdm/get-env');
    const data = await response.json();

    const selector = document.getElementById('env');
    const object = data.list;
    for (let i = 0;i < object.length;i++) {
        const option = document.createElement('option');
        option.setAttribute('value',object[i]);
        option.setAttribute('base','option-child');
        option.setAttribute('class','optenv');
        option.innerHTML = object[i];
        if (object[i] == data.env) option.setAttribute('selected','true');

        selector.appendChild(option);
    }
}

async function login() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const env = document.getElementById('env');

    const setEnv = await fetch(`/bellasdm/select-env?env=${document.getElementById('env').value}`);
    
    const response = await fetch('/bellasdm/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username.value, 
            password: password.value, // Sửa từ username.password thành password.value
            env: env.value
        })
    });

    const content = await response.json(); // Lấy nội dung phản hồi
    statusHandler(content.content); // Gọi hàm xử lý nội dung
    
}
