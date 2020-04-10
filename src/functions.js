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
  const outcome = (infections * avgIncome * avgPopulation) / days;
  return Math.floor(outcome);
};

export const availableBeds = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const occupied = 0.65 * totalHospitalBeds;
  const available = totalHospitalBeds - occupied;
  return Math.trunc(available - severeCasesByRequestedTime);
};

export const infectionProjections = (currentlyInfected, days) => {
  const projection = currentlyInfected * (2 ** Math.floor(days / 3));
  return projection;
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
  const infectionsByRequestedTime = infectionProjections(currentlyInfected, days);
  const severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;

  // object properties
  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: availableBeds(totalHospitalBeds, severeCasesByRequestedTime),
    casesForICUByRequestedTime: Math.floor(0.05 * infectionsByRequestedTime),
    casesForVentilatorsByRequestedTime: Math.floor(0.02 * infectionsByRequestedTime),
    dollarsInFlight: (lostMoney(infectionsByRequestedTime * region.avgDailyIncomeInUSD
      * region.avgDailyIncomePopulation, days)).toFixed(2)
  };
};
