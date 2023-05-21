import React, { Component, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
    datasets: [
        {
            label: 'User Experience',
            data: [60, 30, 10],
            backgroundColor: [
                '#5A6ACF',
                '#8593ED',
                '#FF81C5',

            ],
            borderWidth: 2,

        },
    ],

};



const ClientChart = () => {


    return (
        <div className="d-flex justify-content-center w-100">
            <div style={{ width: "200px", height: "200px" }}>
                <Doughnut data={data} />
            </div>

        </div>
    )
}


export default ClientChart
