import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2'; // Assuming you're using Chart.js

const StatsBar = ({ transactions }) => {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    const tagTotals = {};
    let sum = 0;

    transactions.forEach((tx) => {
      sum += parseFloat(tx.amount);
      if (tx.tag) {
        if (!tagTotals[tx.tag]) {
          tagTotals[tx.tag] = 0;
        }
        tagTotals[tx.tag] += parseFloat(tx.amount);
      }
    });

    setTotal(sum);
    setData({
      labels: Object.keys(tagTotals),
      datasets: [
        {
          label: 'Spending by Tag',
          backgroundColor: '#fce390',
          borderColor: '#df7559',
          data: Object.values(tagTotals),
        },
      ],
    });
  }, [transactions]);

  return (
    <div className="p-4 bg-background dark:bg-background-dark">
      <h2 className="text-lg font-bold mb-2">Total: {total}</h2>
      <Bar data={data} />
    </div>
  );
};
StatsBar.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.string.isRequired,
      tag: PropTypes.string,
    })
  ).isRequired,
};

export default StatsBar;
