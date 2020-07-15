$(window).on('load', function () {

    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        $.ajax({
            type: 'GET',
            url: 'https://mnd.dataportal.kr/api/policyProgressCount',
            dataType: 'JSON'
        }).then((jsonData) => {
            const data = google.visualization.arrayToDataTable([
                ['진행단계', '%'],
                ['평가안됨', jsonData.progress_0],
                ['지체', jsonData.progress_25],
                ['진행중', jsonData.progress_50],
                ['변경', jsonData.progress_75],
                ['완료', jsonData.progress_100],
                ['파기', jsonData.progress_125]
            ]);

            const options = {
                title: '공약 이행 현황',
                is3D: true
            };

            const chart = new google.visualization.PieChart(document.getElementById('piechart3d'));

            chart.draw(data, options);

            $('#progress-count').append(`
                <td>${jsonData.progress_0}</td><td>${jsonData.progress_25}</td><td>${jsonData.progress_50}</td><td>${jsonData.progress_75}</td><td>${jsonData.progress_100}</td><td>${jsonData.progress_125}</td><td>${jsonData.progress_total}</td>
            `);

            const percent_0 = (jsonData.progress_0 / jsonData.progress_total * 100).toFixed(1);
            const percent_25 = (jsonData.progress_25 / jsonData.progress_total * 100).toFixed(1);
            const percent_50 = (jsonData.progress_50 / jsonData.progress_total * 100).toFixed(1);
            const percent_75 = (jsonData.progress_75 / jsonData.progress_total * 100).toFixed(1);
            const percent_100 = (jsonData.progress_100 / jsonData.progress_total * 100).toFixed(1);
            const percent_125 = (jsonData.progress_125 / jsonData.progress_total * 100).toFixed(1);
            const percent_total = (jsonData.progress_total / jsonData.progress_total * 100).toFixed(0);
            $('#progress-percent').append(`
                <td>${percent_0}%</td><td>${percent_25}%</td><td>${percent_50}%</td><td>${percent_75}%</td><td>${percent_100}%</td><td>${percent_125}%</td><td>${percent_total}%</td>
            `);
        });
    }
});