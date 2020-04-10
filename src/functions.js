// Function to calculate days
export const computeDays = (period, value) => {
  switch (period) {
    case 'months' || 'month':
      return value * 30;
    case 'weeks' || 'week':
      return value * 7;
    default:
      return value;
  }
};

// Global Functions

export const lostMoney = (infections, avgIncome, avgPopulation, days) => {
  const outcome = infections * avgIncome * avgPopulation;
  const result = (outcome / days);
  return Math.floor(result);
};


export const prototypeEstimator = ({
  reportedCases,
  periodType,
  timeToElapse,
  totalHospitalBeds,
  region
}, infectedPeople) => {
  // calculations
  const currentlyInfected = reportedCases * infectedPeople;
  const days = computeDays(periodType, timeToElapse);
  const factor = Math.floor(days / 3);
  const infectionsByRequestedTime = currentlyInfected * (2 ** factor);
  const severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;
  const availableBeds = Math.trunc(((totalHospitalBeds * 0.35) - severeCasesByRequestedTime));
  const icuCases = Math.trunc(0.05 * infectionsByRequestedTime);
  const ventilatorCases = Math.trunc(0.02 * infectionsByRequestedTime);

  // object properties
  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: availableBeds,
    casesForICUByRequestedTime: icuCases,
    casesForVentilatorsByRequestedTime: ventilatorCases,
    dollarsInFlight: (lostMoney(infectionsByRequestedTime * region.avgDailyIncomeInUSD
      * region.avgDailyIncomePopulation, days)).toFixed(2)
  };
};
