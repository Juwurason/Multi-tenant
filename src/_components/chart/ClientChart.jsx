import React, { Component, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

const ClientChart = () => {
    const [series] = useState([60, 10, 30]);

    const [options] = useState({
        chart: {
            fontFamily: 'Lexend, sans-serif',
            type: 'donut',
        },
        colors: ['#5A6ACF', '#8593ED', '#FF81C5'],
        labels: ['Excellent', 'Poor', 'Fair'],
        legend: {
            show: false,
            position: 'bottom',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    background: 'transparent',
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        responsive: [
            {
                breakpoint: 2600,
                options: {
                    chart: {
                        width: 270,
                    },
                },
            },
            {
                breakpoint: 640,
                options: {
                    chart: {
                        width: 90,
                    },
                },
            },
        ],
    });


    return (
        <div class="mb-2">
            <div id="chartThree" class="mx-auto d-flex justify-content-center">
                <ReactApexChart options={options} series={series} type="donut" />
            </div>
        </div>
        // <div class="col-sm-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark col-xl-5">
        //     <div class="mb-3 d-flex justify-content-between gap-4 flex-sm-row flex-column">
        //         <div>
        //             <h5 class="text-xl font-semibold text-black dark:text-white">Visitors Analytics</h5>
        //         </div>
        //         <div>
        //             <div class="position-relative d-inline-block">
        //                 <select name="" id="" class="form-select bg-transparent py-1 pl-3 pr-8 text-sm font-medium">
        //                     <option value="">Monthly</option>
        //                     <option value="">Yearly</option>
        //                 </select>
        //             </div>
        //         </div>
        //     </div>



        //     <div class="-mx-8 d-flex flex-wrap items-center justify-content-center gap-y-3">
        //         <div class="col-12 col-sm-6 px-8">
        //             <div class="d-flex w-100 align-items-center">
        //                 <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
        //                 <p class="d-flex w-100 justify-content-between text-sm font-medium text-black dark:text-white">
        //                     <span>Desktop</span>
        //                     <span>65%</span>
        //                 </p>
        //             </div>
        //         </div>
        //         <div class="col-12 col-sm-6 px-8">
        //             <div class="d-flex w-100 align-items-center">
        //                 <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
        //                 <p class="d-flex w-100 justify-content-between text-sm font-medium text-black dark:text-white">
        //                     <span>Tablet</span>
        //                     <span>34%</span>
        //                 </p>
        //             </div>
        //         </div>
        //         <div class="col-12 col-sm-6 px-8">
        //             <div class="d-flex w-100 align-items-center">
        //                 <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
        //                 <p class="d-flex w-100 justify-content-between text-sm font-medium text-black dark:text-white">
        //                     <span>Mobile</span>
        //                     <span>45%</span>
        //                 </p>
        //             </div>
        //         </div>
        //         <div class="col-12 col-sm-6 px-8">
        //             <div class="d-flex w-100 align-items-center">
        //                 <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
        //                 <p class="d-flex w-100 justify-content-between text-sm font-medium text-black dark:text-white">
        //                     <span>Unknown</span>
        //                     <span>12%</span>
        //                 </p>
        //             </div>
        //         </div>
        //     </div>
        // </div>

    )
}


export default ClientChart
