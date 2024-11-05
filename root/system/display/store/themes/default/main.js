function statusHandler(code) {
    console.log(code);
} 


const head = document.head;
const css_style_link = document.createElement('link');

css_style_link.rel = 'stylesheet';
css_style_link.href = '/bellasdm/theme-data?file=style.css';
head.appendChild(css_style_link);

const svg_data = [];
let nike_pose_num = 1;


async function loadsvg() {
    // Wait for the DOM to be fully loaded
    document.addEventListener("DOMContentLoaded", async function() {
        const left = document.getElementsByClassName('left')[0]; // Access the first element
        for (let i = 0; i < 4;i++) {
            const response = await fetch(`/bellasdm/theme-data?file=image/nike-pose${i}.svg`);
            const message = await response.text();
            svg_data[i] = message;
        }
        const svg = document.createElement('div');
        svg.setAttribute('onclick','change_nike_pose_idk()');
        svg.setAttribute('id','splash_logo');
        
        
        svg.innerHTML = svg_data[3];
        left.appendChild(svg);
    });
}

loadsvg();


function change_nike_pose_idk() {
    const svg = document.getElementById('splash_logo');
    if (nike_pose_num == 3) {
        nike_pose_num = 0;
    }
    else {
        nike_pose_num++;
    }
    svg.innerHTML = svg_data[nike_pose_num];

}
document.addEventListener("DOMContentLoaded", function() {
    const time_label = document.getElementById('timep');

    function loadtime() {
        setInterval(() => {
            const now = new Date();
            const hours = now.getHours();   // Lấy giờ (0 - 23)
            const minutes = now.getMinutes(); // Lấy phút (0 - 59)
            
            // Đảm bảo luôn hiển thị 2 chữ số
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            time_label.innerHTML = formattedTime;

        }, 1000); // Cập nhật mỗi giây (1000 ms)
    }

    loadtime();
});
