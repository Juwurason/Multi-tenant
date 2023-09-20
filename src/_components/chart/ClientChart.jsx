import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChart } from '../../store/slices/chartData';

ChartJS.register(ArcElement, Tooltip, Legend);

const ClientChart = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const dispatch = useDispatch();
    const result = useSelector((state) => state.chart.data);
    const staffNames = result.map((item) => item.staffName);
    const durations = result.map((item) => item.duration);
    const [selectedPeriod, setSelectedPeriod] = useState('y');

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchChart({ value: selectedPeriod, company: id.companyId }))
    }, [dispatch]);

    const data = {
        labels: staffNames,
        datasets: [
            {
                label: 'Staff Duration',
                data: durations,
                backgroundColor: [
                    '#5A6ACF',
                    '#8593ED',
                    '#FF81C5',
                    // '#405189',
                    // '#5374A5',
                    // '#ffbc34',
                    // Add more colors if needed
                ],
                borderWidth: 2,
            },
        ],
    };

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };

    return (
        <div>
            <div className='d-flex flex-column justify-content-start'>
                <span className='fw-semibold'>{selectedPeriod === 'y' ? "Yearly" : selectedPeriod === 'm' ? "Monthly" : selectedPeriod === 'w' ? "Weekly" : ""} Staff Duration Chart</span>
                {/* <span style={{ fontSize: "10px" }}>From 1-6 Dec, 2021</span> */}
            </div>
            <div className="d-flex justify-content-center">
                <div style={{ width: '200px', height: '200px' }} className='flex justify-content-center'>
                    {isLoading ? (
                        <div className="lds-spinner m-5"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    ) : (
                        <Doughnut data={data} options={{ plugins: { legend: { display: false } } }} />
                    )}
                </div>
            </div>
            <div className="d-flex justify-content-evenly mt-3">
                <button
                    className={`btn  ${selectedPeriod === 'y' ? 'bg-warning px-2 py-1 text-white rounded' : 'text-secondary fw-bold'}`}
                    onClick={() => handlePeriodChange('y')}
                >
                    Yearly
                </button>
                <button
                    className={`btn  ${selectedPeriod === 'm' ? 'bg-warning px-2 py-1 text-white rounded' : 'text-secondary fw-bold'}`}
                    onClick={() => handlePeriodChange('m')}
                >
                    Monthly
                </button>
                <button
                    className={`btn  ${selectedPeriod === 'w' ? 'bg-warning px-2 py-1 text-white rounded' : 'text-secondary fw-bold'}`}
                    onClick={() => handlePeriodChange('w')}
                >
                    Weekly
                </button>
            </div>
        </div>
    );
};

export default ClientChart;
