import moment from 'moment';

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (expenseList = []) => {
   const groupedData = {};
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  expenseList.forEach((expense) => {
    const { category, amount, date } = expense;
    const expenseDate = new Date(date);

    if (expenseDate >= thirtyDaysAgo) {
      if (groupedData[category]) {
        groupedData[category] += Number(amount);
      } else {
        groupedData[category] = Number(amount);
      }
    }
  });

  const chartData = Object.entries(groupedData).map(([name, amount]) => ({
    name,
    amount,
  }));

  return chartData;
};


export const prepareIncomeBarChartData = (incomeList = []) => {
  const groupedData = {};
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  incomeList.forEach((income) => {
    const { source, amount, date } = income;
    const incomeDate = new Date(date);

    if (incomeDate >= sixtyDaysAgo) {
      if (groupedData[source]) {
        groupedData[source] += Number(amount);
      } else {
        groupedData[source] = Number(amount);
      }
    }
  });

  const chartData = Object.entries(groupedData).map(([name, amount]) => ({
    name,
    amount,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format('Do MMM'),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
};